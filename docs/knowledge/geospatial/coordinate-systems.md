# Coordinate Systems & SRID

## 1. Longitude comes first

A position is written as `(X Y)`, which for geographic data means **`(longitude latitude)`**. WKT, PostGIS, and GeoJSON all agree on this.

:::info
**Longitude comes first!** This is the most common spatial bug in the world, because **plenty of tools put latitude first**. Google Maps shows you `32.0779, 34.7741`, and Leaflet's API takes `[lat, lng]` too. So whenever a coordinate moves from one tool to another, check which order each side expects, and swap if needed.
:::

## 2. SRID

The pair `(34.7741, 32.0779)` is meaningless until you know **which coordinate system** it's in. Is it degrees on a globe? Meters on a flat map? Feet from some local origin?

That's what a **Spatial Reference IDentifier** (**SRID**) tells you. **It's a number** that identifies a coordinate system. You'll mostly meet two:

| SRID     | Name         | Units   | Used by                                                  |
| -------- | ------------ | ------- | -------------------------------------------------------- |
| **4326** | WGS 84       | Degrees | GPS, phones, GeoJSON. "Raw latitude/longitude"           |
| **3857** | Web Mercator | Meters  | The tiles of Google Maps, OpenStreetMap, Mapbox, Leaflet |

**[GeoJSON](./geojson.md) is always WGS 84 (4326).** It has no field for any other coordinate system.

:::tip
If you're storing GPS coordinates from users or an API, you almost always want **SRID 4326**.
:::
