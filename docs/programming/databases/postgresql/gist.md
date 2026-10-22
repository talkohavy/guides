# What is GiST?

## R-Tree is an idea, GiST is the machinery

You might expect PostgreSQL to have an index type called `rtree`. It actually did, a long time ago, but it was removed in PostgreSQL 8.2 and replaced by something more general: **GiST**.

**GiST** stands for **Generalized Search Tree**. It is **not** an index for one specific kind of data. It is a **framework for building tree indexes**, for any kind of data that can be organized hierarchically.

Here's the analogy. Think of GiST as a **generic tree engine**. It already knows how to:

- keep the tree balanced
- read and write pages to disk
- handle concurrency, locking, and crash recovery (WAL)
- walk the tree during a search

What it **doesn't** know is anything about **your data type**. For that, a data type plugs into GiST by providing a small set of functions (together called an **operator class**). These functions answer questions only the data type can answer:

| GiST function | The question it answers                                                      | For a spatial R-Tree, that means...                        |
| ------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `consistent`  | "Could anything under this entry possibly match the query?"                  | Does this bounding box overlap the query box?              |
| `union`       | "Give me one entry that summarizes all these entries."                       | Compute the bounding box that covers all the child boxes   |
| `penalty`     | "How bad would it be to put this new item under this entry?"                 | How much would the box need to grow?                       |
| `picksplit`   | "This page is full. How should its entries be divided into two pages?"       | Split into two groups with little area and overlap         |
| `same`        | "Are these two entries identical?"                                           | Are these two boxes equal?                                 |
| `distance`    | (optional) "How far is this entry from the query?" Used for nearest-neighbor | Distance from a point to a box. Powers `<->` in `ORDER BY` |

Look at the right-hand column. Implement those functions with **bounding-box logic**, and GiST behaves **exactly like an R-Tree**. That's precisely what PostGIS does.

So here's how the pieces relate:

- **R-Tree** is the _algorithm_: "index shapes by nesting bounding boxes."
- **GiST** is the _framework_ PostgreSQL provides for building balanced search trees.
- **PostGIS** plugs bounding-box logic into GiST, which gives you an **R-Tree implemented on top of GiST**.

:::info
The GiST paper came out of UC Berkeley in 1995 (Hellerstein, Naughton & Pfeffer), the same university PostgreSQL itself came from. The motivation was simple: adding a new index type to a database was a huge, risky engineering job. With GiST, an expert in a data type (geometry, text search, IP ranges...) can get a crash-safe, concurrent index by implementing a handful of functions, without touching the storage engine.
:::

## GiST isn't only for maps

Because GiST is generic, PostgreSQL uses it for plenty of non-spatial things too. Anything with a notion of "this contains/overlaps that" fits:

| Data                                                 | Example question GiST speeds up               |
| ---------------------------------------------------- | --------------------------------------------- |
| Built-in geometric types (`point`, `box`, `circle`)  | Is this point inside this circle?             |
| Range types (`tsrange`, `int4range`, `daterange`...) | Do these two time ranges overlap?             |
| Full-text search (`tsvector`)                        | Which documents contain these words?          |
| Trigrams (`pg_trgm` extension)                       | Which names are similar to "Jonh"?            |
| Network addresses (`inet`, `cidr`)                   | Is this IP in this subnet?                    |
| Hierarchical labels (`ltree` extension)              | Which nodes are descendants of `Top.Science`? |

A really useful non-spatial example is the **exclusion constraint**. Here's a booking system where the database itself guarantees no room is ever double-booked:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist; -- lets GiST handle plain "=" on the INT column

CREATE TABLE room_bookings (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    during TSTZRANGE NOT NULL,
    EXCLUDE USING GIST (room_id WITH =, during WITH &&)
);

INSERT INTO room_bookings (room_id, during)
VALUES (1, '[2026-10-21 10:00, 2026-10-21 11:00)');

INSERT INTO room_bookings (room_id, during)
VALUES (1, '[2026-10-21 10:30, 2026-10-21 12:00)');
-- ERROR: conflicting key value violates exclusion constraint "room_bookings_room_id_during_excl"
```

Read the constraint as: _"reject a new row if an existing row has the **same** `room_id` **and** an **overlapping** `during`."_ A `UNIQUE` constraint (B-Tree) can only check equality. Checking "overlaps" needs GiST.

## Creating a spatial index

Back to our `places` table. Creating a spatial index is one line. You just say `USING GIST`:

```sql
CREATE INDEX places_location_gist ON places USING GIST (location);
CREATE INDEX areas_boundary_gist  ON areas  USING GIST (boundary);
```

:::tip
**Rule of thumb:** every `geometry` / `geography` column you filter or join on should have a GiST index. Without one, every spatial query is a full table scan.
:::

## Seeing the index at work

Let's ask PostgreSQL how it plans to run our "within 2 km" query:

```sql
EXPLAIN ANALYZE
SELECT name
FROM places
WHERE ST_DWithin(location, 'SRID=4326;POINT(34.7741 32.0779)'::geography, 2000);
```

:::info
With only 5 rows, PostgreSQL will (correctly) decide a sequential scan is cheaper than using the index. To force the index for learning purposes, run `SET enable_seqscan = off;` first, and `RESET enable_seqscan;` when you're done. Never do this in production.
:::

You'll get a plan that looks roughly like this (trimmed):

```
Index Scan using places_location_gist on places
  Index Cond: (location && _st_expand('0101...'::geography, '2000'::double precision))
  Filter: st_dwithin(location, '0101...'::geography, '2000'::double precision, true)
```

This is the [filter & refine](./r-trees.md#filter--refine-the-two-step-query) process from the R-Trees page, in real life:

- **`Index Cond`** is the **filter** step. PostGIS expanded your point into a box 2 km in each direction, then used the `&&` operator ("bounding boxes overlap") to walk the GiST tree. This step is fast and approximate.
- **`Filter`** is the **refine** step. The precise `st_dwithin` calculation runs only on the candidates the index returned.

You didn't have to write `&&` yourself. Functions like `ST_DWithin`, `ST_Intersects`, `ST_Contains`, and `ST_Covers` automatically add the bounding-box check for you, so the index gets used.

## Writing index-friendly spatial queries

This is the most common performance mistake in PostGIS:

```sql
-- ❌ BAD: can't use the index. Computes the exact distance for EVERY row, then filters.
SELECT name FROM places
WHERE ST_Distance(location, 'SRID=4326;POINT(34.7741 32.0779)'::geography) < 2000;

-- ✅ GOOD: uses the index (filter), then the exact check (refine) on a few rows.
SELECT name FROM places
WHERE ST_DWithin(location, 'SRID=4326;POINT(34.7741 32.0779)'::geography, 2000);
```

They return the same rows. The first one asks "compute a number, then compare it". There's no bounding box an index could search with. The second one asks a **spatial question**, which the index understands.

The same idea applies to nearest-neighbor queries. `ORDER BY location <-> <point> LIMIT k` uses GiST's `distance` function to walk the tree nearest-first, and stops after `k` results. `ORDER BY ST_Distance(...) LIMIT k` computes the distance to every row and sorts all of them.

A few more tips:

- **Don't wrap the indexed column in a function or cast** inside `WHERE`. Something like `ST_Transform(location, 3857)` or `location::geometry` in the condition prevents the index on `location` from being used (unless you build an index on that exact expression).
- **Run `ANALYZE`** after loading lots of spatial data, so the planner has fresh statistics.
- **Use `ST_Subdivide`** on huge polygons (country borders, coastlines). One giant polygon has one giant bounding box, which matches almost every query. Splitting it into many small pieces gives the index tight boxes to work with.

## GiST vs. other index types

PostgreSQL has a few index types. Here's where GiST sits:

| Index       | How it works                                       | Best for                                                                             |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **B-Tree**  | Sorted, one dimension                              | `=`, `<`, `>`, `ORDER BY` on scalar values. The default                              |
| **GiST**    | Balanced tree of "summaries" that may overlap      | Spatial data, ranges, overlap/containment, nearest-neighbor. **The PostGIS default** |
| **SP-GiST** | Space-partitioning tree (quadtrees, k-d trees)     | Non-overlapping data, like lots of points. Sometimes faster than GiST for points     |
| **BRIN**    | Stores a summary per block range of the table      | Huge tables physically sorted by location (or time). Tiny index, coarse results      |
| **GIN**     | Inverted index ("which rows contain this element") | Arrays, JSONB, full-text search                                                      |

:::tip
When in doubt, use **GiST** for spatial columns. Only reach for SP-GiST or BRIN when you've measured a problem.
:::

---

## Putting It All Together

Here's the full picture, from top to bottom:

```
 Spatial database   The CONCEPT    A database that understands shapes:
                                   types + functions + spatial indexes
        |
        v
 PostGIS            The TOOL       The extension that makes PostgreSQL a spatial
                                   database: geometry/geography types, ST_* functions
        |
        v
 GiST               The FRAMEWORK  PostgreSQL's generic, pluggable tree index.
                                   PostGIS plugs bounding-box logic into it
        |
        v
 R-Tree             The ALGORITHM  What GiST becomes with bounding-box logic:
                                   nested boxes, prune what doesn't overlap
```

And the key takeaways:

1. A **spatial database** stores shapes as real types, and can answer questions like "near", "inside", and "overlapping".
2. **PostGIS** is how you get that in PostgreSQL. Use `geography(POINT, 4326)` for GPS data, and remember: **longitude first**.
3. An **R-Tree** indexes shapes by their **bounding boxes**, nested in a balanced tree. It answers queries by **pruning** every box that doesn't overlap the query.
4. **GiST** is PostgreSQL's general-purpose framework for tree indexes. PostGIS uses it to build R-Trees, and it's also behind range exclusion constraints, full-text search, trigram search, and more.
5. Spatial queries run in two steps: **filter** (index, bounding boxes, approximate) then **refine** (exact geometry). Write queries the index understands: `ST_DWithin` instead of `ST_Distance < x`, and `<->` for nearest-neighbor.
