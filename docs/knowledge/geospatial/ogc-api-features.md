# OGC API - Features

[GeoJSON](./geojson.md) answers "how do I write a feature?". **OGC API - Features** answers "how does a server hand me features over HTTP?" in plain REST.

It's an **OGC** standard, the same organization behind **Simple Features**.

## 1. The endpoints

Every server that follows the standard exposes the same shape of URLs:

| Endpoint                                            | What you get back                                |
| --------------------------------------------------- | ------------------------------------------------ |
| `GET /`                                             | The landing page, with links to everything below |
| `GET /conformance`                                  | Which parts of the standard this server supports |
| `GET /collections`                                  | The list of collections (think: tables)          |
| `GET /collections/{collectionId}`                   | One collection's description                     |
| `GET /collections/{collectionId}/items`             | The features, as a **FeatureCollection**         |
| `GET /collections/{collectionId}/items/{featureId}` | One feature, as a **Feature**                    |

## 2. Asking for features in an area

You ask for the features in an area, and the body comes back as a GeoJSON **FeatureCollection**:

```
GET /collections/coffee_shops/items?bbox=34.76,32.05,34.80,32.10&limit=2
```

- **`bbox`** is the same rectangle as GeoJSON's `bbox`: `west,south,east,north`. Longitude first, as always.
- **`limit`** is the page size.

```json
{
  "type": "FeatureCollection",
  "numberMatched": 37, // <--- how many features match in total
  "numberReturned": 2, // <--- how many are in this page
  "features": [
    // ...two Features
  ],
  "links": [
    { "rel": "self", "href": "...items?bbox=...&limit=2" },
    { "rel": "next", "href": "...items?bbox=...&limit=2&offset=2" } // <--- the next page
  ]
}
```

To get the next page, follow the `next` link. Don't build the URL yourself. The server decides how paging works.

By default the coordinates are WGS 84, longitude then latitude, the same as GeoJSON. Extra parts of the standard add other coordinate systems and richer filtering, and a server lists the ones it supports under `/conformance`.
