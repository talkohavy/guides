---
title: The Hidden Problem with Offset-Based Pagination
description: Knowing the differences between Cursor-Based and Offset-Based Pagination. What are the Pros & Cons for each.
slug: cursor-vs-offset-pagination
authors: [talkohavy]
image: https://i.ibb.co/rGSxHmB/vite.png
tags: [database, pagination, offset]
hide_table_of_contents: false
---

## Pagination with `limit` & `offset`

Pagination is one of those problems that feels solved early in a developer’s career.
`LIMIT` and `OFFSET` are simple, expressive, and map nicely to the idea of "pages" in a UI.

That is, until your database grows...

When datasets reach **tens or hundreds of millions of rows**, offset-based pagination quietly becomes a performance liability — especially under filtering and sorting. This article explains **why that happens**, and how **cursor-based pagination** solves it.

---

## The Familiar Approach: OFFSET-Based Pagination

Most applications start with queries like this:

```sql
SELECT *
FROM orders
WHERE status = 'paid'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

Page 1 is fast.
Page 2 is still fast.
Everything seems fine — until users request deeper pages.

```sql
LIMIT 20 OFFSET 500000;
```

At scale, this query can become **significantly slower** than the first page.

This is not accidental. It’s a direct consequence of how databases execute OFFSET.

And no, this problem is not unique to `RDBMS`s. The exact same _class of problem_ exists in many NoSQL systems — including **MongoDB** and **Elasticsearch** — although it shows up under slightly different names and mechanics.

---

## Why OFFSET Gets Slower as the Page Number Grows

`OFFSET N` does **not** mean "jump directly to row N".

Internally, most relational databases:

1. Apply the `WHERE` filter
2. Sort the matching rows (or traverse a sorted index)
3. **Scan and discard the first N rows**
4. Return the next `LIMIT` rows

So even though the client only wants 20 rows, the database may need to:

- Read **hundreds of thousands or millions of rows**
- Throw most of them away

This means:

- Page 1 reads ~20 rows
- Page 10,000 reads ~200,000 rows
- Page 50,000 reads ~1,000,000 rows

The cost grows **linearly with the offset**.

Even with good indexing, this behavior remains — the database still has to walk the index entry by entry. That’s why OFFSET-based pagination does not scale well for large datasets.

---

## The Real Problem: We’re Asking the Wrong Question

Offset-based pagination answers this question:

> "Give me page number N."

But databases are much better at answering a different question:

> "Give me the next rows **after this one**."

That shift in thinking leads directly to cursor-based pagination.

---

## Cursor-Based Pagination (a.k.a. Keyset Pagination)

Cursor pagination replaces `OFFSET` with a **stable, ordered reference point** — the "cursor".

Instead of skipping rows, the query continues **from the last seen value**.

### First Page

```sql
SELECT *
FROM orders
WHERE status = 'paid'
ORDER BY created_at DESC
LIMIT 20;
```

The client stores the last row’s `created_at` value.

### Next Page

```sql
SELECT *
FROM orders
WHERE status = 'paid'
  AND created_at < '2025-01-01T12:34:56'
ORDER BY created_at DESC
LIMIT 20;
```

The database now performs an **index range scan** — no rows are skipped, no work is wasted.

---

## Why Cursor Pagination Scales

- No row skipping
- No growing scan cost
- Query time remains **constant**
- Perfect alignment with B-tree indexes

The database always starts exactly where it should.

This makes cursor pagination ideal for:

- Very large tables
- High-traffic APIs
- Infinite Scroll or "Load more" experiences
- Time-ordered data (events, logs, messages, orders)

---

## A Perfect Fit: Activity Feeds and Timelines

Consider a system showing:

- User activity
- Audit logs
- Notifications
- Orders history

Users:

- Always move **forward**
- Rarely jump to page 37
- Expect consistent performance

Cursor pagination matches this usage pattern perfectly:

- "Give me the next 20 items"
- Stable ordering
- Predictable latency

This is why cursor pagination is used by companies like Twitter, GitHub, Stripe, and Facebook.

---

## When Cursor Pagination Is _Not_ a Good Fit

Cursor pagination is not a silver bullet. Its trade-offs are real.

### 1. You Can’t Jump to Arbitrary Pages

There is no "page 42" without walking through the previous cursors.

If your UI requires:

- Random page access
- Direct navigation to specific page numbers

OFFSET may still be necessary (or a hybrid approach).

---

### 2. Requires a Stable, Unique Sort Key

You need a column (or composite) that is:

- Indexed
- Immutable
- Unambiguous

Common choices:

- `id`
- `created_at + id`

If ordering is unstable, pagination breaks.

---

### 3. More Complex Client Logic

The client must:

- Store cursors
- Pass them back to the server
- Handle edge cases when data changes

This complexity is manageable — but it’s not free.

---

## Conclusion

Offset-based pagination is simple and intuitive — and perfectly fine for small datasets.

But at scale, it becomes increasingly inefficient because the database must scan and discard more rows as offsets grow.

Cursor-based pagination flips the model:

- Instead of skipping rows, it **continues from a known position**
- Performance remains constant
- The database does exactly the work required — no more, no less

For large datasets, high traffic, and sequential access patterns, cursor pagination isn’t just an optimization — it’s the correct architectural choice.

And that’s what your interviewer was looking for.

---

If you want, I can:

- Add **SQL execution plan comparisons**
- Show **composite cursor examples**
- Rewrite this as a **system design interview answer**
- Or adapt it specifically to **PostgreSQL / MySQL / Elasticsearch**
