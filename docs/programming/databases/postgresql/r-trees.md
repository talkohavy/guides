# Spatial Indexing with R-Trees

## 0. TLDR - What is an R-Tree?

Ever wondered how your map app finds the closest Coffee shop in milliseconds, without checking every place on earth? Meet the **R-Tree**.

An **R-Tree** is a **spatial data structure** that **organizes multi-dimensional information using Minimum Bounding Rectangles** (MBR).

```
+------------------------------------------------+
|                                                |
|                                                |
|                                                |
|               o                                |
|          o                                     |
|               o                                |
|                                                |
|                            o    o              |
|                                 o              |
|                                                |
|                                                |
|                                                |
|                      o                         |
|                 o                              |
|                      o                         |
|                                                |
|                                                |
|                                                |
|                                                |
+------------------------------------------------+
```

**It groups nearby locations together and draws a box around them**.

```
+------------------------------------------------+
|                                                |
|                                                |
|        +---------+                             |
|        |      o  |                             |
|        | o       |                             |
|        |      o  |                             |
|        +---------+       +---------+           |
|                          | o    o  |           |
|                          |      o  |           |
|                          +---------+           |
|                                                |
|               +---------+                      |
|               |      o  |                      |
|               | o       |                      |
|               |      o  |                      |
|               +---------+                      |
|                                                |
|                                                |
|                                                |
+------------------------------------------------+
```

**Then, it groups those boxes into even bigger boxes**, building a tree-like hierarchy.

```
+------------------------------------------------+
|                                                |
|      . . . . . . . . . . . . . . . . .         |
|      . +---------+                   .         |
|      . |      o  |                   .         |
|      . | o       |                   .         |
|      . |      o  |                   .         |
|      . +---------+       +---------+ .         |
|      .                   | o    o  | .         |
|      .                   |      o  | .         |
|      .                   +---------+ .         |
|      .                               .         |
|      .        +---------+            .         |
|      .        |      o  |            .         |
|      .        | o       |            .         |
|      .        |      o  |            .         |
|      .        +---------+            .         |
|      . . . . . . . . . . . . . . . . .         |
|                                                |
|                                                |
+------------------------------------------------+
```

The idea is to **index the box, not the shape**.  
When you search for an area, **the R-Tree checks the bigger boxes first**.  
If the search area **doesn't overlap** a box, the **R-Tree completely ignores** everything inside it.

```
           +--------+
           |  Root  |
           +--------+
          /    |     \
        /      |       \
      /        |/        \ /
+--------+ +---/----+ +---/----+
|   R1   | |  / R2  | |  / R3  |
+--------+ +-/------+ +-/------+
            /          /
        PRUNED: R2 & R3
```

It only drills down to the boxes that overlap, quickly finding your exact locations.

- 🚀 Fast spatial queries
- 📦 efficient grouping
- ⚡ and lightning speed maps

that's the power 💪🏼 of the R-Tree 🌳.

## 1. Why Regular Indexes Fail at Spatial Data

Before we get to R-Trees, it helps to see why the index you already know isn't enough.

A **B-Tree** (PostgreSQL's default index) works by **sorting** values along **one dimension**. Numbers sort, strings sort, dates sort. Given a sorted list, "find everything between X and Y" is a quick binary search.

But space has **two dimensions** (at least). There's no way to sort points on a map into a single line so that points close in space are always close in the list.

Suppose you try anyway, with a composite B-Tree index on `(lat, lng)`. A query like "everything in this small box around me" turns into:

```
lat BETWEEN 32.07 AND 32.08  AND  lng BETWEEN 34.77 AND 34.78
```

The B-Tree can use the `lat` range well. That narrows things down to a **thin horizontal stripe that wraps around the entire planet**. Inside that stripe it then has to filter `lng` row by row. You wanted a small box, and you scanned a band across the whole globe.

And that's the easy case, with points. With polygons and lines, which have an **extent** and not just a location, a B-Tree can't express "overlaps" at all.

We need an index that is **spatial by nature**. That's the R-Tree.

## 2. What is an R-Tree?

An **R-Tree** ("R" for Rectangle) is a tree data structure designed for indexing multi-dimensional data, like shapes on a map. It was introduced by Antonin Guttman in 1984, and nearly every spatial database uses some form of it today.

### The core idea: bounding boxes

Comparing complex shapes is expensive. A country's border might have 100,000 vertices. So the R-Tree doesn't work with the real shapes. It works with their **bounding boxes**.

A **bounding box**, or **Minimum Bounding Rectangle** (**MBR**), is the smallest axis-aligned rectangle that fully contains a shape:

```
   Real shape                Its bounding box (MBR)

      /\                     +-----------+
     /  \___                 |   /\      |
    /       \                |  /  \___  |
    \___    /                | /       \ |
        \__/                 | \___    / |
                             |     \__/  |
                             +-----------+
```

A rectangle is just 4 numbers (`xmin, ymin, xmax, ymax`). Checking whether two rectangles overlap takes 4 comparisons, no matter how complex the original shapes are.

### The structure: boxes inside boxes

An R-Tree groups **nearby** objects together, and wraps each group in a bounding box. Then it groups nearby **boxes** together and wraps those in bigger boxes. It keeps going until everything is under one root.

Here's a map with 8 objects (`a` through `h`):

```
+---------------------------------------------------------------+
|                                                               |
|  R1 +---------------------------------+                       |
|     |  R3 +----------+  R4 +--------+ |                       |
|     |     |  a    b  |     |  c     | |                       |
|     |     |          |     |     d  | |                       |
|     |     +----------+     +--------+ |                       |
|     +---------------------------------+                       |
|                                                               |
|                      R2 +-------------------------------+     |
|                         |  R5 +-------+   R6 +--------+ |     |
|                         |     | e     |      |    g   | |     |
|                         |     |    f  |      | h      | |     |
|                         |     +-------+      +--------+ |     |
|                         +-------------------------------+     |
+---------------------------------------------------------------+
```

And this is the tree that represents it:

```
                         +---------+---------+
  Root:                  |   R1    |   R2    |
                         +----+----+----+----+
                              |         |
                 +------------+         +------------+
                 v                                   v
         +-------+-------+                   +-------+-------+
  Inner: |  R3   |  R4   |                   |  R5   |  R6   |
         +---+---+---+---+                   +---+---+---+---+
             |       |                           |       |
             v       v                           v       v
          [a, b]   [c, d]                     [e, f]   [g, h]
  Leaves: each entry = bounding box of the object + pointer to the table row
```

The rules:

- **Leaf nodes** hold entries for the actual objects: their bounding box, plus a pointer to the row in the table.
- **Internal nodes** hold one entry per child: the bounding box that covers **everything** below that child.
- Every node has a maximum capacity (in a database, roughly what fits in one disk page).
- The tree is **balanced**: all leaves are at the same depth.

### Searching an R-Tree

Query: _"Find everything that intersects box Q"_, where Q is a small box drawn around `c`.

1. **Root**: Does Q overlap R1? **Yes**, go in. Does Q overlap R2? **No**. Skip it, and with it **half the data**, without ever looking inside.
2. **Inside R1**: Does Q overlap R3? **No**, skip. Does Q overlap R4? **Yes**, go in.
3. **Leaf R4**: Check `c` and `d`'s bounding boxes against Q. `c` matches.

We touched 3 nodes instead of scanning all 8 objects. With millions of rows, the tree is only a few levels deep, and the difference is a query that takes milliseconds versus one that takes minutes.

That's the whole trick: **if a box doesn't overlap your query, nothing inside it can either.** So you can prune entire subtrees.

### How it differs from a B-Tree

| B-Tree                                          | R-Tree                                                 |
| ----------------------------------------------- | ------------------------------------------------------ |
| Values have a total order (sorted)              | No ordering. Grouped by spatial proximity              |
| Sibling ranges never overlap                    | Sibling boxes **can overlap**                          |
| A lookup follows exactly one path down the tree | A lookup may need to follow **several** paths          |
| Answers `=`, `<`, `>`, `BETWEEN`                | Answers `overlaps`, `contains`, `within`, `nearest to` |

The overlap point is the key weakness of R-Trees, so it deserves a closer look.

### Overlap and dead space: what makes an R-Tree good or bad

#### Why boxes overlap at all

**In a B-Tree**, a node's ranges are **cut** out of a sorted line: `[1-100]`, `[101-200]`, `[201-300]`. **They cannot overlap by construction!**

**In an R-Tree**, a box isn't cut out of anything. It's **computed** from whatever entries happen to be inside the node. Which entries end up together is a decision the tree makes as data arrives, and nothing forces the resulting boxes to stay apart. Some shapes make overlap unavoidable: a highway crossing the whole country has a box that overlaps nearly everything around it.

#### The same data, grouped well and grouped badly

Take the four objects under R1 from the map above, `a`, `b`, `c` and `d`:

```
+-------------------------------------------+
|                                           |
|  R1 +---------------------------------+   |
|     |  R3 +----------+  R4 +--------+ |   |
|     |     |  a    b  |     |  c     | |   |
|     |     |          |     |     d  | |   |
|     |     +----------+     +--------+ |   |
|     +---------------------------------+   |
|                                           |
+-------------------------------------------+
```

Each leaf (R3 & R4) holds 2 entries. Here's the grouping we already saw, with `{a, b}` in R3 and `{c, d}` in R4:

```
 Good grouping

 R3 +-------------+  R4 +-------------+
    |             |     |      Q      |
    |  a       b  |     |  c  [ ]     |
    |             |     |             |
    |             |     |         d   |
    +-------------+     +-------------+

           [ ]
            P
```

And here's an equally valid R-Tree over the **same four objects**, grouped as `{a, d}` and `{b, c}`:

```
 Bad grouping

 R3 +-------------------------------------+
    |           R4 +------------------+   |
    |  a           |  b    c  [ ]     |   |
    |              |           Q      |   |
    |              +------------------+   |
    |                                 d   |
    |      [ ]                            |
    |       P                             |
    +-------------------------------------+
```

`a` and `d` are far apart, so R3 has to stretch across the whole area to cover both. R4 ends up **completely inside** R3. `Q` & `P` are arbitrary points that we want to query, and ask whether our polygon contains them. Now let's run the two queries against both trees:

| Query                           | Good grouping                        | Bad grouping                                                                  |
| ------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| **Q**, a small box next to `c`  | Overlaps R4 only. **1 leaf** read.   | Overlaps R3 **and** R4. **2 leaves** read, overlaps R4, and R3 finds nothing. |
| **P**, a box in an empty region | Overlaps nothing. **0 leaves** read. | Overlaps R3. **1 leaf** read, finds nothing.                                  |

Both trees return the **correct** answers. The bad one just does more work to get them, and that's the whole difference between a good R-Tree and a bad one: **how much useless searching it causes**.

Query `P` shows the second problem, **dead space**.

#### Dead space

**Dead space** is the area inside a box that none of its children actually cover. In the bad grouping, most of R3 is empty. A query landing anywhere in that emptiness gets a "yes, go in" from the parent, reads the page, and finds nothing.

Dead space also exists at the leaf level, because of the shapes themselves. A diagonal road has a box that is mostly empty:

```
 +--------------------------+
 |\__                       |
 |   \__                    |
 |      \___                |
 |          \___            |
 |              \___        |
 |                  \____   |
 +--------------------------+
   The road covers a thin diagonal line.
   Everything else in the box is dead space.
```

Any query in the upper-right part of that box will match the road's bounding box without touching the road. The index can't tell the difference, so this becomes a **false positive** that the refine step (covered below) has to throw away.

So the two failure modes are:

- **Overlap**: a query matches several sibling boxes, so it has to go down **several paths**.
- **Dead space**: a query matches a box that has **nothing useful inside**, so it goes down a path for nothing.

#### Why it compounds

One extra page read in the example doesn't sound like much. But real R-Trees are several levels deep, and overlap can happen at **every** level.

If a query follows 1 child per level in a 4-level tree, it reads 4 pages. If heavy overlap means it follows 2 children per level, it reads `1 + 2 + 4 + 8 = 15` pages, and most of them return nothing. In the extreme, where every box overlaps every other box, the index can't prune anything, and the "index scan" ends up reading the whole tree. That's slower than a plain sequential scan of the table.

#### What a "good" R-Tree aims for

Since you can't always avoid overlap and dead space, the tree tries to minimize them every time it decides where an entry goes. In practice it balances a few goals:

- **Small area**: tight boxes, so there's less dead space.
- **Little overlap** between siblings, so queries follow fewer paths.
- **Square-ish boxes** rather than long thin ones. Long thin boxes tend to cross many neighbors and overlap them.

These goals sometimes conflict, and the R-Tree variants exist because they trade them off differently. For example, the **R+-Tree** forbids overlap between sibling boxes entirely. The price is that an object that crosses the border between two boxes gets stored in **both** leaves.

All of these decisions happen when entries are inserted and nodes split, which is the next section.

### Inserting into an R-Tree

When a new object arrives:

1. **Choose a subtree.** Starting from the root, descend into the child whose bounding box would need to **grow the least** to fit the new object. That keeps boxes tight.
2. **Insert into the leaf**, and enlarge the bounding boxes on the way back up, as needed.
3. **Split if full.** If the leaf overflows, split its entries into two groups. Aim for two groups with small total area and little overlap. The split may cascade up to the parent, and if the root splits, the tree grows one level taller.

Different R-Tree variants (R\*-Tree, R+-Tree, Hilbert R-Tree...) mostly differ in **how they choose the subtree and how they split**. That's where the quality of the index comes from.

### Filter & refine: the two-step query

Since the index only knows **bounding boxes**, its answers are **approximate**. Two shapes can have overlapping boxes without actually touching:

```
+--------------+
|  ____        |
| |    |    +--+-----------+
| |____|    |  |    ____   |
|           |  |   /    \  |
+-----------+--+  /______\ |
            |              |
            +--------------+
   The boxes overlap, but the shapes don't touch.
```

So every spatial query runs in two phases:

1. **Filter** (cheap, uses the index): find all candidates whose **bounding boxes** match. This can return false positives, but never misses a real match.
2. **Refine** (expensive, exact): run the real geometric test on just those few candidates, to throw out the false positives.

Keep this in mind. You'll literally see both phases in `EXPLAIN` output on the next page, [What is GiST?](./gist.md).
