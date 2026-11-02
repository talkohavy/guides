# WKT & WKB

Those [Simple Features shapes](./geometry-types.md) have **two famous representations** that are **part of the spec/standard**, and you will see both the moment you open a spatial database.

## 1. WKT

**WKT** (Well-Known Text) is the one humans write in SQL:

```
POINT(34.7741 32.0779)
LINESTRING(34.77 32.07, 34.78 32.08, 34.79 32.08)
POLYGON((34.76 32.07, 34.78 32.07, 34.78 32.09, 34.76 32.09, 34.76 32.07))
```

## 2. WKB

**WKB** (Well-Known Binary) is the one machines exchange. Each database keeps shapes in its own internal format, but WKB is the standard binary they all read and write. A raw `SELECT` of a geometry column in PostGIS comes back as hex, `0101000020E6100000...`. You convert it to something readable with functions like `ST_AsText()`.

:::info
Strictly speaking, that hex is **EWKB** (Extended WKB), PostGIS's version of WKB that also carries the SRID. The `20` in `01010000`**`20`** is a flag that says "an SRID follows", and the next bytes, `E6100000`, are 4326. Plain WKB for the same point starts with `0101000000...`, and has no SRID.
:::

So, same shop, three different representations:  
_(two are part of the spec, one isn't)_

| Representation | Dizengoff Square                                   |
| -------------- | -------------------------------------------------- |
| WKT            | `POINT(34.7741 32.0779)`                           |
| WKB            | `0101000000...`                                    |
| GeoJSON        | `{"type":"Point","coordinates":[34.7741,32.0779]}` |
