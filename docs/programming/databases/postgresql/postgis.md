# What is PostGIS?

**PostGIS** is an **extension** for PostgreSQL that turns it into a full spatial database. It's open source, has been around since 2001, and is the de facto standard for spatial SQL.

Recall that an extension is a package that plugs new capabilities into Postgres: new types, functions, operators, and index support. PostGIS adds:

- **New column types**: `geometry`, `geography`, and `raster`.
- **Hundreds of functions**, all prefixed with `ST_` (Spatial Type), such as `ST_Distance`, `ST_Contains`, and `ST_Buffer`.
- **Spatial operators**, such as `&&` (bounding boxes overlap) and `<->` (distance, for nearest-neighbor ordering).
- **Spatial index support**, built on top of [GiST](./gist.md).
- **A `spatial_ref_sys` table**, a catalog of thousands of coordinate systems (every SRID) and how to convert between them.

## Installing PostGIS

On macOS:

```bash
brew install postgis
```

PostGIS is installed **per database**, not per server. Connect to the database you want, and run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Verify it worked:

```sql
SELECT postgis_full_version();
```

:::warning
The PostGIS binaries must be built for the **same major version** of PostgreSQL that your server is running. If `CREATE EXTENSION postgis` fails with something like _could not open extension control file ".../postgis.control"_, then Homebrew installed PostGIS for a different PostgreSQL version than yours. Check which one with `brew info postgis`.

An easy way around this is the official Docker image, which ships with both already matched:

```bash
docker run --name pg-gis -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgis/postgis
```

:::

You can also see which extensions are installed in the current database with the meta-command:

```sql
\dx
```

## `geometry` vs. `geography`

This is the first real decision you'll make with PostGIS, so it's worth understanding well.

❌ - **`geometry`** treats the world as a **flat plane** (Cartesian math). Distances are computed with the Pythagorean theorem, in whatever units the SRID uses.

✅ - **`geography`** treats the world as a **round Earth** (a spheroid). Distances are computed along the curved surface, and **always returned in meters**.

Here's why it matters. Let's measure the distance between Dizengoff Square and the Azrieli Center in Tel Aviv, using SRID 4326 (degrees):

```sql
-- As geometry: flat math on degrees
SELECT ST_Distance(
    'SRID=4326;POINT(34.7741 32.0779)'::geometry,
    'SRID=4326;POINT(34.7920 32.0744)'::geometry
);
-- ≈ 0.018   ← that's 0.018 DEGREES. Useless as a distance.

-- As geography: real distance on the Earth's surface
SELECT ST_Distance(
    'SRID=4326;POINT(34.7741 32.0779)'::geography,
    'SRID=4326;POINT(34.7920 32.0744)'::geography
);
-- ≈ 1730    ← meters. That's what you wanted.
```

:::info
The `'SRID=4326;POINT(...)'` string is called **EWKT** (Extended WKT). It's WKT with the SRID prepended, and PostGIS can cast it straight into a `geometry` or `geography` value.
:::

So which should you pick?

- **`geography`**: Use **when your data is lat/lng** spread over a city, a country, or the globe, and you want answers in meters.
- **`geometry`**: Use when your data is in a projected (meters-based) SRID, or you need functions `geography` doesn't have.

**Trade-offs**: `geography` **is more accurate but somewhat slower**, and supports fewer functions. `geometry` **is faster and has the full function library**. You can cast between them at any time with `::geometry` and `::geography`.

:::tip
For a typical app storing GPS points ("users", "stores", "drivers"), start with **`geography(POINT, 4326)`**. You get meters everywhere without having to think about projections.
:::

## Hands-on: your first spatial table

Let's create a table of places in Tel Aviv:

```sql
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL
);
```

`GEOGRAPHY(POINT, 4326)` is a **type modifier**. It restricts the column to points only, in SRID 4326. Trying to insert a polygon, or a point in a different SRID, will fail.

Now let's insert some rows. `ST_MakePoint(lng, lat)` builds a point, and `ST_SetSRID` stamps the coordinate system on it:

```sql
INSERT INTO places (name, location) VALUES
('Dizengoff Square',   ST_SetSRID(ST_MakePoint(34.7741, 32.0779), 4326)::geography),
('Rothschild Blvd',    ST_SetSRID(ST_MakePoint(34.7744, 32.0636), 4326)::geography),
('Azrieli Center',     ST_SetSRID(ST_MakePoint(34.7920, 32.0744), 4326)::geography),
('Tel Aviv Port',      ST_SetSRID(ST_MakePoint(34.7735, 32.0972), 4326)::geography),
('Jaffa Clock Tower',  ST_SetSRID(ST_MakePoint(34.7564, 32.0549), 4326)::geography);
```

Look at the data:

```sql
SELECT name, location FROM places;
```

You should see location results shows as unreadable hex (WKB).

```sql
SELECT name, ST_AsText(location) FROM places;
```

You should see location results location show up as POINT(34.7741 32.0779).

## Hands-on: asking spatial questions

**1. How far is everything from Dizengoff Square?**

```sql
SELECT
    b.name,
    ROUND(ST_Distance(a.location, b.location)) AS meters
FROM places a
JOIN places b ON a.id <> b.id
WHERE a.name = 'Dizengoff Square'
ORDER BY meters;
```

**2. Which places are within 2 km of me?**

```sql
SELECT name
FROM places
WHERE ST_DWithin(
    location,
    'SRID=4326;POINT(34.7741 32.0779)'::geography,
    2000  -- meters, because it's geography
);
```

**3. What are the 3 nearest places to me?** (a "K-Nearest-Neighbors", or KNN, query)

```sql
SELECT
    name,
    ROUND(ST_Distance(location, 'SRID=4326;POINT(34.7741 32.0779)'::geography)) AS meters
FROM places
ORDER BY location <-> 'SRID=4326;POINT(34.7741 32.0779)'::geography
LIMIT 3;
```

The `<->` operator means "distance between". Using it in `ORDER BY` lets PostgreSQL walk the spatial index in nearest-first order, instead of computing the distance to every row and sorting. More on that on [What is GiST?](./gist.md).

**4. Which places are inside this area?**

Let's define a (very rough) rectangle around the city center as a polygon:

```sql
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL
);

INSERT INTO areas (name, boundary) VALUES
('City Center (rough box)',
 'SRID=4326;POLYGON((34.765 32.070, 34.785 32.070, 34.785 32.085, 34.765 32.085, 34.765 32.070))');

SELECT p.name AS place, a.name AS area
FROM places p
JOIN areas a ON ST_Covers(a.boundary, p.location);
```

The query answers: **"For every place, which area is it in?"** Each row in the result is a (place, area) pair where the area's boundary covers the place's location.

`ST_Covers(A, B)` returns true when **no point of B lies outside A**. In other words, A must **fully** cover B:

- ✅ - B is completely inside A → `true`.
- ✅ - B lies on A's edge (e.g. a point exactly on the polygon's border) → `true`.
- ❌ - B only **partially overlaps** A (e.g. a road that starts inside the area and leaves it) → `false`.

The argument order matters: `ST_Covers(A, B)` asks "does A cover B?", so the bigger shape (the area) goes first.

:::info
Related functions you'll run into:

- **`ST_Intersects(A, B)`**: true if A and B share **at least one point**. Use this when partial overlap should count.
- **`ST_Contains(A, B)`**: almost the same as `ST_Covers`, but a B that lies only on A's boundary is **not** contained. It also only works on `geometry`, which is why we used `ST_Covers` on our `geography` columns.
- **`ST_CoveredBy(B, A)`** and **`ST_Within(B, A)`**: the same checks as `ST_Covers` and `ST_Contains`, with the arguments flipped.
  :::

As an answer, we got that only Dizengoff Square falls inside this box.  
Now check out the `ON` part of the `JOIN`. Notice how we didn't match based on 2 IDs? What we did instead was a **spatial join**: we joined two tables on a spatial relationship.

## The function families

You don't need to memorize hundreds of functions. They fall into a handful of families:

| Family             | Question it answers                    | Examples                                                                             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| **Constructors**   | "Build me a shape"                     | `ST_MakePoint`, `ST_GeomFromText`, `ST_GeomFromGeoJSON`, `ST_MakeEnvelope`           |
| **Accessors**      | "Tell me about this shape"             | `ST_X`, `ST_Y`, `ST_SRID`, `ST_GeometryType`, `ST_NPoints`                           |
| **Relationships**  | "How do these two shapes relate?"      | `ST_Intersects`, `ST_Contains`, `ST_Within`, `ST_Covers`, `ST_Touches`, `ST_DWithin` |
| **Measurements**   | "How big / far is it?"                 | `ST_Distance`, `ST_Area`, `ST_Length`, `ST_Perimeter`                                |
| **Processing**     | "Make a new shape out of this one"     | `ST_Buffer`, `ST_Union`, `ST_Intersection`, `ST_Simplify`, `ST_Centroid`             |
| **Transformation** | "Convert to another coordinate system" | `ST_Transform`                                                                       |
| **Output**         | "Give it to me in another format"      | `ST_AsText`, `ST_AsGeoJSON`, `ST_AsBinary`, `ST_AsMVT`                               |

:::tip
`ST_AsGeoJSON` is the one you'll use the most in web apps. Its output can be handed straight to Leaflet, Mapbox, or any other map library on the frontend.
:::
