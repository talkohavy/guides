# What is a Spatial Database?

This part of the guide introduces four ideas that build on top of each other:

1. **Spatial database**: the concept. A **database** that **understands location and shape**. Treats geographic and geometric data as a first-class citizen.
2. **PostGIS**: the implementation. The **extension that turns PostgreSQL into a spatial database**.
3. **R-Tree**: the algorithm. **A data structure for indexing shapes in space**.
4. **GiST**: the framework. **PostgreSQL's general-purpose tree index system**. PostGIS uses it to build R-Tree-style indexes.

Two acronyms show up constantly around this:

- **GIS**: (**Geographic Information System**) is the broader field, and the software, for working with maps and location.
- **OGC**: (**Open Geospatial Consortium**) is the standards body that defines how those systems describe shapes, so PostGIS and other GIS tools can speak the same language.

We'll go in that order: first the problem, then the tool, then how the tool is fast.

## 1. The problem

Say you're building an app that shows **coffee shops near the user**. Your first instinct might be:

```sql
CREATE TABLE coffee_shops (
    id SERIAL PRIMARY KEY,
    name TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);
```

That works for _storing_ locations. The trouble starts when you try to _ask questions_ about them:

- "Which shops are within 1 km of me?" You'd have to write the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) (a formula to measure distance between two points on a sphere) by hand in SQL.
- "Which shops are inside the Florentin neighborhood?" A neighborhood is a **polygon**, not two numbers. How do you even store it?
- "What are the 5 closest shops?" You'd compute the distance to **every row**, sort, then take the top 5. That's a full table scan on every request.
- "Does this delivery route cross a highway?" Now you need intersecting lines.

Plain numbers don't know they're coordinates. A regular B-Tree index can't help either.

## 2. The solution

A **spatial database** is a database that treats geographic and geometric data as a first-class citizen. It gives you three things:

1. **Types**: Column types that hold shapes: points, lines, polygons.
2. **Functions**: Operations on shapes: `distance`, `area`, `contains`, `intersects`, `buffer`, `union`...
3. **Indexes**: Index structures that make "what's near / inside / overlapping" fast.

Most of the industry follows the same standard for this, called **OGC Simple Features** (OGC is the Open Geospatial Consortium). Learn it once and you'll recognize it in PostGIS, SpatiaLite, SQL Server, MySQL, Oracle Spatial, and GIS tools like QGIS.

## 3. The basic geometry types

| Type                 | What it represents                   | Real-world example        |
| -------------------- | ------------------------------------ | ------------------------- |
| `POINT`              | A single location                    | A coffee shop             |
| `LINESTRING`         | A sequence of connected points       | A road, a running route   |
| `POLYGON`            | A closed area, optionally with holes | A park, a neighborhood    |
| `MULTIPOINT`         | A collection of points               | All branches of a chain   |
| `MULTILINESTRING`    | A collection of lines                | A river with its branches |
| `MULTIPOLYGON`       | A collection of polygons             | A country with islands    |
| `GEOMETRYCOLLECTION` | A mixed bag of any of the above      | Rarely used directly      |

## 4. How shapes are written: WKT

Shapes are usually written as text in a format called **WKT** (Well-Known Text):

```
POINT(34.7741 32.0779)
LINESTRING(34.77 32.07, 34.78 32.08, 34.79 32.08)
POLYGON((34.76 32.07, 34.78 32.07, 34.78 32.09, 34.76 32.09, 34.76 32.07))
```

Notice two things:

1. A polygon's ring must be **closed**: the last point equals the first.
2. The order is `(X Y)`, which for geographic data means **`(longitude latitude)`**.

:::warning
**Longitude comes first!** This is the most common spatial bug in the world. Google Maps shows you `32.0779, 34.7741` (lat, lng), but WKT and PostGIS expect `34.7741 32.0779` (lng, lat). Swap them and your Tel Aviv coffee shop ends up somewhere in the Indian Ocean, off the coast of Somalia.
:::

Databases store shapes internally in a binary format called **WKB** (Well-Known Binary). That's why a raw `SELECT` of a spatial column shows a long hex string like `0101000020E6100000...`. You convert it to something readable with functions like `ST_AsText()`.

## 5. Coordinate systems & SRID

The pair `(34.7741, 32.0779)` is meaningless until you know **which coordinate system** it's in. Is it degrees on a globe? Meters on a flat map? Feet from some local origin?

That's what an **Spatial Reference IDentifier** (**SRID**) tells you. **It's a number** that identifies a coordinate system. You'll mostly meet two:

| SRID     | Name         | Units   | Used by                                                  |
| -------- | ------------ | ------- | -------------------------------------------------------- |
| **4326** | WGS 84       | Degrees | GPS, phones, GeoJSON. "Raw latitude/longitude"           |
| **3857** | Web Mercator | Meters  | The tiles of Google Maps, OpenStreetMap, Mapbox, Leaflet |

:::tip
If you're storing GPS coordinates from users or an API, you almost always want **SRID 4326**.
:::

## 6. Vector vs. Raster

Everything above is **vector** data: shapes defined by coordinates. Spatial databases can also store **raster** data: grids of pixels where each cell holds a value, like satellite imagery or elevation maps. **This guide focuses on vector data**, which is what most applications need.
