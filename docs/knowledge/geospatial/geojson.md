# GeoJSON

What is GeoJSON? and why does every map speak it?

By now the shapes are settled. [Simple Features](./simple-features.md) named them, and databases have been writing them as [WKT and WKB](./wkt-and-wkb.md) for years.

Then the web maps showed up. Leaflet and Mapbox run in a browser, and **a browser speaks JSON**. Nobody wants to parse WKT strings or WKB hex in JavaScript.

So the web needed one way to write a shape as JSON. That way is **GeoJSON**.

**GeoJSON is the official standard way used to represent geographic data structures using JSON**. It is open and lightweight. Its media type is `application/geo+json`.

Two decisions in the RFC are the whole format:

1. The shapes are **Simple Features**. GeoJSON didn't invent any of them.
2. The coordinates are **always WGS 84**, written longitude then latitude.

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

- **Longitude comes first**. As per the spec.
- **Value should be a number**. If it were a string, `"34.7741"`, it would be invalid ❌
- **A position can carry a third number - elevation**. The elevation is meters above the WGS 84 ellipsoid: `[34.7741, 32.0779, 12]`. Most apps never send it.
- **Six decimal places is about 10 centimeters on the ground.** Extra digits don't make the pin more accurate. They make the file bigger.

## 2. The same geometry types, as JSON

Every [geometry type](./geometry-types.md) keeps its name: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, `GeometryCollection`. What changes is the writing. A position becomes an array `[long, lat]`, and a ring becomes an array of positions.

Here's the neighborhood with the park hole, from [Geometry Types](./geometry-types.md#--c-polygon):

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

**Each ring has a direction**. Either **clockwise**, or **counterclockwise**, depending on the positions' order. Both standards agree on which direction is which:

- The **outer ring goes counterclockwise**.
- **Holes go clockwise**.

Walk the example above and you'll see it. GeoJSON calls this the **right-hand rule**.

What GeoJSON changed is how serious the rule is. **Simple Features describes this orientation, but doesn't make it a validity rule**, so a clockwise outer ring is still a valid polygon there (PostGIS accepts it). **GeoJSON says writers must follow it**. Parsers should still not reject a polygon that doesn't, since the original 2008 GeoJSON spec never mentioned ring direction.

---

## 3. A Feature is the shape plus the facts

A **Point** tells the map where. It doesn't tell your app the name of the place.

### - A. Feature

**A Feature is the object APIs, databases, and map libraries actually pass around**. The shape and the facts about it stay in separate fields:

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

**FeatureCollection** is the thing you actually send to the map, rather than an array of points or shapes.

### - C. bbox

Any of these objects can also carry a special property known as `bbox`.

```json
{
  "type": "FeatureCollection",
  "bbox": [34.7741, 32.0744, 34.792, 32.0779], // <--- [west, south, east, north]
  "features": [
    // ...the two shops from above
  ]
}
```

**A `bbox` is the smallest rectangle that can confine the shape**. A map uses it to skip features that are off screen. A spatial index uses the same rectangle to skip rows that can't possibly match (the [R-Tree](./r-trees.md)). Same idea, implemented in two places.

---

## 4. What GeoJSON leaves out

GeoJSON leaves three things out on purpose:

- any coordinate system besides WGS 84
- a timestamp
- and a 3D solid.

GeoJSON is **vector** data: shapes defined by coordinates. A satellite photo or an elevation grid is **raster**, a grid of values, and it doesn't belong in this format.

---

## 5. TopoJSON

A cousin of the **GeoJSON** is the **TopoJSON**. **TopoJSON** stores a shared border once, instead of repeating it on both polygons. That's a big saving on a map of countries.

---

## 6. GeoJSON and a spatial database

A [spatial database](./spatial-databases.md) does not store your feature as JSON. It keeps shapes in its own binary format, and speaks **WKB**.

GeoJSON is how a shape gets in from the browser, and how it comes back out to the map. In PostgreSQL that's `ST_GeomFromGeoJSON` on the way in and `ST_AsGeoJSON` on the way out, covered in [PostGIS: GeoJSON in and out](../../programming/databases/postgresql/postgis.md#hands-on-geojson-in-and-out).

And when a server hands features to a client over HTTP, there's a standard for that too: [OGC API - Features](./ogc-api-features.md).

---

## 7. The mental model

**Simple Features** is the list of shapes. `Point`, `LineString`, `Polygon`, and the `Multi` versions.

**GeoJSON** is that list written as JSON. Always longitude, then latitude. Always WGS 84. A **Feature** is one shape plus the properties that describe it. A **FeatureCollection** is the document you pass to the map.

A **spatial database** stores those same shapes in binary, hands them out as **WKB**, indexes the bounding box, and answers "near" and "inside". **GeoJSON** is how a shape gets in from the browser and back to the map.

What **GeoJSON** adds is a way to package a **feature** as one JSON object, that the browser, the API, and the database can hand to each other.
