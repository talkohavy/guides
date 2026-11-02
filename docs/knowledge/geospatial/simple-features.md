# Simple Features

What is a "shape"? and why does every map, database, and GIS tool agree on it?

Let's say you're building an app that shows coffee shops in Tel Aviv.

A shop is a pin. A delivery zone is a shape drawn on the map. A neighborhood is a polygon, and the park in the middle of it is a hole.

The phone already has the coordinates. The database wants to store them and answer "which shops are inside this zone?" Leaflet or Mapbox wants to draw them.

**Everyone in that chain needs to agree** on what a pin, a line, and a polygon are.

**That agreement is Simple Features**.

---

## 1. Who defined it

**Simple Features** is a standard by the **OGC** (Open Geospatial Consortium, an international non-profit organization for voluntary consensus standards). It was later adopted by ISO as well.

It defines three things:

1. **The shapes**: `Point`, `LineString`, `Polygon`, and the `Multi` versions. See [Geometry Types](./geometry-types.md).
2. **How to write them**: as text (**WKT**) and as binary (**WKB**). See [WKT & WKB](./wkt-and-wkb.md).
3. **What you can ask about them**: `contains`, `intersects`, `distance`, `buffer`...

**"Simple" means the edges between points are always straight lines**. No curves, no arcs. A circle is approximated by a polygon with many points.

---

## 2. Databases got there first

**Databases agreed on this vocabulary long before browsers got involved.** The first version of Simple Features came out in the late 1990s, as a spec for SQL databases. **GeoJSON**, the format web maps speak, only showed up in 2008.

**When databases** like PostGIS, SpatiaLite, SQL Server, MySQL, Oracle Spatial, and GIS tools like QGIS **recognize a polygon, this is the agreement they're honoring**. Learn it once and you'll recognize it everywhere.

And when the web needed a way to write shapes, it didn't invent new ones. **GeoJSON reused the Simple Features shapes**, and only changed how they're written.
