# Geometry Types

These are the shapes [Simple Features](./simple-features.md) defines, and the shapes pretty much **every spatial database** can hold:

| Type                 | What it is                           | A real example           |
| -------------------- | ------------------------------------ | ------------------------ |
| `Point`              | One position                         | A coffee shop            |
| `LineString`         | A line through several positions     | A road, a delivery route |
| `Polygon`            | A closed area, optionally with holes | A neighborhood           |
| `MultiPoint`         | Several points, one shape            | Every branch of a chain  |
| `MultiLineString`    | Several lines                        | A river and its branches |
| `MultiPolygon`       | Several polygons                     | A country with islands   |
| `GeometryCollection` | A mix of any of the above            | Rarely what you want     |

The examples below are written in **WKT**, the text format **Simple Features** defines.

## - A. Point

A **Point** represents a single location in a coordinate space.

```
POINT(34.7741 32.0779)
```

A **Point** has very few validity requirements:

1. It has **exactly one coordinate position**.
   - A Point cannot contain multiple positions.
   - It cannot contain a sequence of coordinates like a **LineString**.
2. Its coordinates are **either all empty or all present**.
   - An empty Point is valid! ✅ `POINT EMPTY`
3. Its coordinate values must be well-defined.
   - 2D Point must have X and Y.
   - 3D Point must have X, Y, and Z.

## - B. LineString

A **LineString** is a path through **two or more** positions, connected by straight lines:

```
LINESTRING(34.77 32.07, 34.78 32.08, 34.79 32.08)
```

## - C. Polygon

A **Polygon is a closed shape**. But it **can also be a shape with holes**. Think of a donut, or a neighborhood with a park in the middle of it that you wanna cut out. A **Polygon** holds a **list of rings**. Each ring is in itself a list of **positions**.

**Polygon** validity requirements:

- **Each ring has to close**. Meaning that **the first and last position must be the same**. A polygon that doesn't come back to its start is invalid.
- **The first ring is the outside.** **Every ring after the first is a hole.**
- Holes must sit inside the outer ring, and rings can't cross each other.

The numbers below are just a grid, so you can see the walk:

```
POLYGON(
  (0 0, 10 0, 10 10, 0 10, 0 0),   -- the neighborhood
  (3 3, 3 7, 7 7, 7 3, 3 3)        -- the park, a hole
)
```

```text
  ● ┌─────────────────────────────────────┐
    │                                     │
    │            Neighborhood             │
    │                                     │
    │        ○ ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐          │
    │          ┆               ┆          │
    │          ┆     Park      ┆          │
    │          ┆     Hole      ┆          │
    │          └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘          │
    │                                     │
    │                                     │
    └──────────────────→──────────────────┘
                 Outer ring ↺

    ●  outer ring: neighborhood boundary
    ○  inner ring: the park, a hole
```

## - D. MultiPoint, MultiLineString, MultiPolygon

If every part of the shape is the same kind, use the `Multi*` type. For example, a country made of a mainland plus islands is one `MultiPolygon`, one feature:

```
MULTIPOLYGON(
  ((0 0, 10 0, 10 10, 0 10, 0 0)),   -- the mainland
  ((20 0, 25 0, 25 5, 20 5, 20 0))   -- an island
)
```

## - E. GeometryCollection

`GeometryCollection` is the mixed bag. Avoid it when a single type would do.
