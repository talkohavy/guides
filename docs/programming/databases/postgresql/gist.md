# What is GiST?

## 1. What is GiST?

**Gist** stands for **Generalized Search Tree**. It is a **highly flexible framework for building tree indexes** that is built into PostgreSQL.

A standard database index (like a B-Tree) is rigid - it only works for data that can be sorted linearly from smallest to largest (like numbers: 1, 2, 3... or test: A, B, C...). You cannot cleanly sort map shapes from "smallest to largest" on a single axis.

GiST solves this by **allowing developers to build custom index structures for complex, non-linear data types**. It provides the core scaffolding for balancing trees and managing pages, but leaves it up to extensions to define _how_ data is organized inside that tree.

Because GiST is a generic framework, it is used in PostgreSQL to power several different types of complex data searches:

- **PostGIS**: uses the GiST framework to build **R-Trees** - grouping shapes into **bounding boxes**.
- **Full-Text Search**: uses the GiST framework to build search indexes for text documents.
- **Range-Types**: use GiST to index time intervals or numerical ranges (e.g. checking if a specific time overlaps a booking window)

---

## 2. R-Tree is PostgreSQL

PostgreSQL actually had an `r-tree` index type a long time ago, but it was removed in PostgreSQL 8.2 and replaced by something more general: **GiST**, the framework for building tree indexes for any kind of data that can be organized hierarchically.

**GiST knows how to**:

- keep the tree balanced
- read and write pages to disk
- handle concurrency, locking, and crash recovery (WAL)
- walk the tree during a search

What it **doesn't** know is anything about **your data type**. For that, a data type plugs into GiST by providing a small set of functions (together called an **operator class**). These functions answer questions only the data type can answer:

| GiST function | The question it answers                                                      | For a spatial R-Tree, that means...                        |
| ------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `consistent`  | "Could anything under this entry possibly match the query?"                  | Does this bounding box overlap the query box?              |
| `union`       | "Give me one entry that summarizes all these entries."                       | Compute the bounding box that covers all the child boxes   |
| `penalty`     | "How bad would it be to put this new item under this entry?"                 | How much would the box need to grow?                       |
| `picksplit`   | "This page is full. How should its entries be divided into two pages?"       | Split into two groups with little area and overlap         |
| `same`        | "Are these two entries identical?"                                           | Are these two boxes equal?                                 |
| `distance`    | (optional) "How far is this entry from the query?" Used for nearest-neighbor | Distance from a point to a box. Powers `<->` in `ORDER BY` |

Look at the right-hand column. Implement those functions with **bounding-box logic**, and GiST behaves **exactly like an R-Tree**. That's precisely what PostGIS does.
