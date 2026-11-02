# GeoJSON

What is GeoJSON? and why does every map speak it?

Let's say you're building an app that shows coffee shops in Tel Aviv.

A shop is a pin. A delivery zone is a shape drawn on the map. A neighborhood is a polygon, and the park in the middle of it is a hole.

The phone already has the coordinates. Leaflet or Mapbox wants to draw them. The database wants to store them and answer "which shops are inside this zone?"

Everyone in that chain needs one way to write a shape. That way is **GeoJSON**.

**GeoJSON is the official standard way used to represent geographic data structures using JSON**. It is open and lightweight.

---

## 1. A shape is just JSON

Here is Dizengoff Square:

```json
{
  "type": "Point",
  "coordinates": [34.7741, 32.0779] // <--- [long, lat]
}
```

Rules:

- **Longitude comes first**. 34 is the longitude. 32 is the latitude.
  **Google Maps is doing it in reverse from the rest of the world!!!** They do it like so `[lat, long]`. So if you wanna search a point in google, don't forget to swap them.
- **Value should be a number**. If it were a string, `"34.7741"`, it would be invalid ❌
- **A position can carry a third number - elevation**. The elevation is meters above the WGS 84 ellipsoid: `[34.7741, 32.0779, 12]`. Most apps never send it.
- **Six decimal places is about 10 centimeters on the ground.** Extra digits don't make the pin more accurate. They make the file bigger.

---

## 2. The geometry types

A pin is the easy case. These are the shapes GeoJSON can actually hold:

| Type                 | What it is                           | A real example           |
| -------------------- | ------------------------------------ | ------------------------ |
| `Point`              | One position                         | A coffee shop            |
| `LineString`         | A line through several positions     | A road, a delivery route |
| `Polygon`            | A closed area, optionally with holes | A neighborhood           |
| `MultiPoint`         | Several points, one shape            | Every branch of a chain  |
| `MultiLineString`    | Several lines                        | A river and its branches |
| `MultiPolygon`       | Several polygons                     | A country with islands   |
| `GeometryCollection` | A mix of any of the above            | Rarely what you want     |

**GeoJSON didn't invent this list**. It comes from a standard called **Simple Features**, and you'll meet the same names in PostGIS, QGIS, and pretty much **every spatial database**. More on that standard in a minute.

## - A. Point

A **Point** represents a single location in a coordinate space.

A **Point** has very few validity requirements:

1. It has **exactly one coordinate position**.
   - A Point cannot contain multiple positions.
   - It cannot contain a sequence of coordinates like a **LineString**.
2. Its coordinates are **either all empty or all present**.
   - An empty Point is valid! ✅
3. Its coordinate values must be well-defined.
   - 2D Point must have X and Y.
   - 3D Point must have X, Y, and Z.

## - B. Polygon

A **Polygon is a closed shape**. But it **can also be a shape with holes**. Think of a donut, or a neighborhood with a park in the middle of it that you wanna cut out. A **Polygon** holds an **array of rings**. Each ring is in itself an array, but of **positions**. **Each ring has a direction**. Either **clockwise**, or **counterclockwise**. And this is important to understand. This direction is dependant on the positions' order.

**Polygon** validity requirements:

- **Each ring has to close**. Meaning that **the first and last position must be the same**. A polygon that doesn't come back to its start is invalid.
- The **first ring is required to go counterclockwise** (the outside).

The numbers below are just a grid, so you can see the walk.

```json
{
  "type": "Polygon",
  // note that `coordinates` is an array of rings
  "coordinates": [
    [
      [0, 0], // <--- bottom left corner
      [10, 0], // <--- right
      [10, 10], // <--- up
      [0, 10], // <--- left
      [0, 0] // <--- down
    ],
    [
      [3, 3], // <--- bottom left corner
      [3, 7], // <--- up
      [7, 7], // <--- right
      [7, 3], // <--- down
      [3, 3] // <--- left
    ]
  ]
}
```

**Every ring after the first is a hole.** The second ring is the park, drawn inside the first.

```text
    ┌─────────────────────────────────────┐
    │                                     │
    │            Neighborhood             │
    │                                     │
    │          ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐          │
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

## - C. MultiPoint, MultiLineString, MultiPolygon

If every part of the shape is the same kind (same direction), use the `Multi*` type. For example, a country made of a mainland plus islands is one `MultiPolygon`, one feature.

## - D. GeometryCollection

`GeometryCollection` is the mixed bag, and **the spec tells you to avoid it when a single type would do**.

---

## 3. A Feature is the shape plus the facts

A **Point** tells the map where. It doesn't tell your app the name of the place.

### - A. Feature

A **Feature** is the object APIs, databases, and map libraries actually pass around. The shape and the facts about it stay in separate fields:

- **`geometry`**: the shape from the last section. It can be `null` when you know the shop exists and you don't have a location yet.
- **`properties`**: any JSON object you want. The name, the opening hours, whether it has wifi. This can also be `null`.
- **`id`**: optional. A string or a number. Put the id your database already uses here.

```json
{
  "type": "Feature",
  "id": 1,
  "geometry": {
    "type": "Point",
    "coordinates": [34.7741, 32.0779]
  },
  "properties": {
    "name": "Dizengoff Square"
  }
}
```

**The map draws `geometry`. Your app reads `properties`.** That's the whole split. The name does not go inside the geometry, and the coordinates do not go inside `properties`.

### - B. Feature Collection

One shop is a **Feature**. The list you hand to the map is a **FeatureCollection**:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 1,
      "geometry": {
        "type": "Point",
        "coordinates": [34.7741, 32.0779]
      },
      "properties": { "name": "Dizengoff Square" }
    },
    {
      "type": "Feature",
      "id": 2,
      "geometry": {
        "type": "Point",
        "coordinates": [34.792, 32.0744]
      },
      "properties": { "name": "Azrieli Center" }
    }
  ]
}
```

This is the document. Not a bare **Point**, and not a raw array of points.

Any of these objects can also carry a special property known `bbox`.

```json
{
  "type": "Feature",
  "id": 1,
  "geometry": {
    "type": "Point",
    "coordinates": [34.7741, 32.0779]
  },
  "bbox": [],
  "properties": {
    "name": "Dizengoff Square"
  }
}
```

**A `bbox` is the smallest rectangle that can confine the shape**. A map uses it to skip features that are off screen. A spatial index uses the same rectangle to skip rows that can't possibly match (`r-tree`). Same idea, implemented in two places.

---

## 4. The standards around it

Three standards show up around a map, and each one does a different job.

1. **Simple Features** names the shapes.
2. **GeoJSON** writes those shapes as JSON.
3. **OGC API - Features** is how a server sends that JSON over HTTP.

### - A. Simple Features

**Simple Features is the vocabulary of shapes.** The OGC (Open Geo-spatial Consortium, an international non-profit organization for voluntary consensus standards) defined:

- `Point`
- `LineString`
- `Polygon`
- and the `Multi` versions.

Databases agreed on this vocabulary long before browsers got involved. **When databases** like PostGIS, SpatiaLite, SQL Server, MySQL, Oracle Spatial, and QGIS **recognize a polygon, this is the agreement they're honoring**.

Those **Simple Features shapes have two famous representations** that are **part of the spec/standard**, and you will see both the moment you open a spatial database:

#### - 1. WKT

**WKT** (Well-Known Text) is the one humans write in SQL. `POINT(34.7741 32.0779)`. Longitude, then latitude. A polygon still has to close.

#### - 2. WKB

**WKB** (Well-Known Binary) is the one the database stores. A raw `SELECT` of a geometry column comes back as hex, `0101000020E6100000...`, because you're looking at WKB.

:::info
**WKT and WKB are defined inside the Simple Features standard itself**.  
**GeoJSON is a separate spec (!)** that reused those shape names.
:::

So, same shop, three different representations:  
_(two are part of the spec, one isn't)_

| Representation | Dizengoff Square                                   |
| -------------- | -------------------------------------------------- |
| WKT            | `POINT(34.7741 32.0779)`                           |
| WKB            | `0101000020E6100000...`                            |
| GeoJSON        | `{"type":"Point","coordinates":[34.7741,32.0779]}` |

### - B. GeoJSON

**GeoJSON is Simple Features written for the web.** The media type is `application/geo+json`.

Two decisions in the RFC standard are the whole format:

1. The shapes are **Simple Features**.
2. The coordinates are always WGS 84, written longitude then latitude.

The object you exchange is a **Feature**, not a bare **geometry**.

### - C. OGC API

**Features is how a server hands you those features over HTTP.** You ask for the features in an area, and the body comes back as a **FeatureCollection**.

GeoJSON leaves three things out on purpose:

- any coordinate system besides WGS 84
- a timestamp
- and a 3D solid.

A cousin of the **GeoJSON** is the **TopoJSON**. **TopoJSON** stores a shared border once, instead of repeating it on both polygons. That's a big saving on a map of countries.

---

## 5. What a spatial database does with it

Now let's store the coffee shop in PostgreSQL.

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

That stores a pin. The trouble starts when you ask questions:

- Q1: "Which shops are within 1 km of me?" Two columns don't know they're a location on a sphere. You end up pasting the Haversine formula into the query.

- Q2: "Which shops are inside Florentin?" A neighborhood is a polygon. There is nowhere to put it.

- Q3: "What are the 5 closest shops?" You compute the distance to every row, sort, and take 5. Every pan of the map is a full table scan.

**What you need is a spatial database!** ✅

**A spatial database treats the shapes as first class citizens**. You get three things in return, and they map straight onto GeoJSON:

1. **Types.** A column that holds a value of type `Point`, `LineString`, or `Polygon`. Exactly the types GeoJSON supports, since its spec includes Simple Features.
2. **Functions.** Distance, area, contains, intersects. The questions above become a function call.
3. **Indexes.** So "near" and "inside" don't read the whole table. The index is built on the bounding box of each shape, the same rectangle as `bbox`. In PostgreSQL that index is a GiST index, covered in [What is GiST?](../programming/databases/postgresql/gist.md).

**[PostGIS](../programming/databases/postgresql/postgis.md)** is the extension that turns PostgreSQL into a spatial database. A backend stores its shapes in PostGIS, and the nice part is that a `Polygon` in PostGIS is also `Polygon` in SpatiaLite, SQL Server, MySQL, and Oracle Spatial, because they all follow the same **Simple Features** standard.

For GPS points the column is `geography(Point, 4326)`. **4326 is the same WGS 84 that GeoJSON already uses**, so a feature can go in and come out without a reprojection. `geography` measures along the curved Earth and answers in **meters**. A `geometry` column does flat math. On raw longitude and latitude, that flat math answers in degrees, which is not a distance. Choosing between them, and the queries themselves, is the [PostGIS](../programming/databases/postgresql/postgis.md) guide. The background on why these types exist at all is [What is a Spatial Database?](../programming/databases/postgresql/spatial-databases.md).

The database does not store your feature as JSON. It stores **WKB**.

On the way in, take the `geometry` member off the Feature and hand it over. PostGIS reads it as SRID 4326:

```sql
SELECT ST_GeomFromGeoJSON(
    '{"type":"Point","coordinates":[34.7741,32.0779]}'
);
```

On the way out, `ST_AsGeoJSON` on a geometry column returns the shape and nothing else:

```json
{"type":"Point","coordinates":[34.7741,32.0779]}
```

The name is still sitting in another column. That's a geometry, and the map asked for a Feature. Since PostGIS 3 you can pass the **row**. The geometry column becomes `geometry`, the other columns become `properties`, and `id_column` lifts the primary key into the Feature's `id`:

```sql
SELECT ST_AsGeoJSON(p.*, id_column => 'id')
FROM places AS p;
```

```json
{
  "type": "Feature",
  "id": 1,
  "geometry": { "type": "Point", "coordinates": [34.7741, 32.0779] },
  "properties": { "name": "Dizengoff Square" }
}
```

The `AS p` matters. `ST_AsGeoJSON` needs a record, and `p.*` is how you hand it one. A map wants the whole list, so wrap the rows:

```sql
SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(p.*, id_column => 'id')::json)
)
FROM places AS p;
```

That document is what you send to the frontend. Leaflet, Mapbox, and the rest already know what to do with a FeatureCollection.

GeoJSON is **vector** data: shapes defined by coordinates. A satellite photo or an elevation grid is **raster**, a grid of values, and it doesn't belong in this format. The spatial database can store both. The file you serve to the map, for shops and zones and neighborhoods, is the vector one.

---

## 6. The mental model

**Simple Features** is the list of shapes. `Point`, `line`, `polygon`, and the `Multi` versions.

**GeoJSON** is that list written as JSON. Always longitude, then latitude. Always WGS 84. A **Feature** is one shape plus the properties that describe it. A **FeatureCollection** is the list you put on the wire.

A **spatial database** stores those same shapes as **WKB**, indexes the bounding box, and answers "near" and "inside". **GeoJSON** is how a shape gets in from the browser and back out to the map.

**GeoJSON** did not invent `Point`, `LineString`, or `Polygon`. **Simple Features** already had those. What **GeoJSON** adds is one JSON object, the Feature, that the browser, the API, and the database can hand to each other.
