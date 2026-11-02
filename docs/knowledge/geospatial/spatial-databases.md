# What is a Spatial Database?

**Spatial database** is a concept for a **database that understands location and shape**. Treats geographic and geometric data as a first-class citizen.

## 1. The problem

Back to the coffee-shop app. We know what a shape is, and how its coordinates are written. Now the app needs to **store** the shops, and find the ones **near the user**.

The first table everyone writes is this:

BAD! ❌

```sql
CREATE TABLE coffee_shops (
    id SERIAL PRIMARY KEY,
    name TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);
```

That works for _storing_ locations. The trouble starts when you try to _ask questions_ about them:

- "Which shops are within 1 km of me?" Two columns don't know they're a location on a sphere. You'd have to write the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) (a formula to measure distance between two points on a sphere) by hand in SQL.
- "Which shops are inside the Florentin neighborhood?" A neighborhood is a **polygon**, not two numbers. How do you even store it?
- "What are the 5 closest shops?" You'd compute the distance to **every row**, sort, then take the top 5. That's a full table scan on every request, on every pan of the map.
- "Does this delivery route cross a highway?" Now you need intersecting lines.

And a regular B-Tree index can't help with any of these.

## 2. The solution

**A spatial database!** ✅

It gives you three things:

1. **Types**: Column types that hold shapes: `Point`, `LineString`, `Polygon`... These are the [Geometry Types](./geometry-types.md) from **Simple Features**.
2. **Functions**: Operations on shapes: `distance`, `area`, `contains`, `intersects`, `buffer`, `union`... The questions above become a function call.
3. **Indexes**: Index structures that make "what's near / inside / overlapping" fast, so they don't read the whole table. The index is built on the bounding box of each shape. That index is usually an [R-Tree](./r-trees.md).

The database does not store your shapes as text. It keeps them in its own binary format, and hands them to you as **WKB**.
