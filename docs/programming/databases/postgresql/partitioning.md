# Partitioning

This page is the hands-on, Postgres-specific follow-up to [How do you scale a database?](../../../knowledge/how-to-scale-a-database.md#3-partitioning). If you're not sure _why_ you'd want partitioning, start there.

## 1. Introduction

Postgres has **declarative partitioning** built in (since version 10). You create a **partitioned table** (the parent), which holds no data itself, and attach **partitions** to it, which are regular tables that hold the rows. Your application keeps reading and writing the parent, and Postgres routes each row to the right partition.

There are 3 ways to split the rows:

| Method    | Each partition holds...             | Typical use                                                 |
| --------- | ----------------------------------- | ----------------------------------------------------------- |
| **RANGE** | a range of values (`FROM` ... `TO`) | time-series: orders by month, logs by day                   |
| **LIST**  | an explicit list of values          | by country, by region, by tenant tier                       |
| **HASH**  | rows whose key hashes to it         | spreading rows evenly when there's no natural range or list |

RANGE by time is by far the most common, because most big tables are big _because of_ time: orders, events, logs, payments. That's what we'll build.

## 2. Hands-on: orders partitioned by month

Create a playground database on your local server:

```bash
createdb partitioning_lab
psql partitioning_lab
```

### Step 1: Create the partitioned (parent) table

```sql
CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY,
  customer_id bigint        NOT NULL,
  total       numeric(10,2) NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
```

Notice the primary key is `(id, created_at)`, not just `id`. Try it with `id` alone, and you'll get:

> _ERROR: unique constraint on partitioned table must include all partitioning columns_

Each partition has its own separate index, so Postgres can only guarantee uniqueness inside a single partition. **Any primary key or unique constraint must include the partition key**. More on that in [Gotchas](#6-gotchas).

### Step 2: Create the partitions

```sql
CREATE TABLE orders_2026_01 PARTITION OF orders FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE orders_2026_03 PARTITION OF orders FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

**`FROM` is inclusive, `TO` is exclusive**. So `orders_2026_01` holds everything from January 1st 00:00, up to (but not including) February 1st 00:00. No gaps, no overlaps.

### Step 3: What happens when no partition matches?

```sql
INSERT INTO orders (customer_id, total, created_at) VALUES (1, 10, '2026-05-05');
```

> _ERROR: no partition of relation "orders" found for row_

**Partitions are not created automatically**. If you forget to create next month's partition, inserts start failing on the 1st of the month. See [section 4](#4-maintenance-this-is-where-partitioning-pays-off).

You can add a **default partition** that catches everything that doesn't fit elsewhere:

```sql
CREATE TABLE orders_default PARTITION OF orders DEFAULT;
```

It's a safety net, but it comes with its own trap, covered in [section 4](#the-default-partition-trap).

### Step 4: Indexes

Create an index on the parent, and **Postgres creates a matching index on every partition**, including future ones:

```sql
CREATE INDEX ON orders (customer_id);
```

```sql
\di orders*
```

```
              Name              |       Type        |     Table
--------------------------------+-------------------+----------------
 orders_2026_01_customer_id_idx | index             | orders_2026_01
 orders_2026_01_pkey            | index             | orders_2026_01
 ...
 orders_customer_id_idx         | partitioned index | orders
 orders_pkey                    | partitioned index | orders
```

### Step 5: Add some data, and see where it landed

```sql
INSERT INTO orders (customer_id, total, created_at)
SELECT (random() * 1000)::int,
       (random() * 500)::numeric(10,2),
       timestamptz '2026-01-01' + random() * interval '89 days'
FROM generate_series(1, 30000);
```

Every table has a hidden `tableoid` column, which tells you which partition a row physically lives in:

```sql
SELECT tableoid::regclass AS partition, count(*) FROM orders GROUP BY 1 ORDER BY 1;
```

```
   partition    | count
----------------+-------
 orders_2026_01 | 10418
 orders_2026_02 |  9427
 orders_2026_03 | 10155
```

We inserted into `orders`, and Postgres spread the rows by month.

To see the whole structure of a partitioned table:

```sql
SELECT * FROM pg_partition_tree('orders');
```

## 3. Partition pruning: why queries get faster

When a query filters on the partition key, the planner skips partitions that can't contain matching rows. Use `EXPLAIN` to see it:

```sql
ANALYZE orders;

EXPLAIN SELECT count(*) FROM orders
WHERE created_at >= '2026-03-01' AND created_at < '2026-04-01';
```

```
 Aggregate
   ->  Seq Scan on orders_2026_03 orders
         Filter: ((created_at >= '2026-03-01 ...') AND (created_at < '2026-04-01 ...'))
```

**Only `orders_2026_03` is scanned**. The other partitions were pruned. That's the finance team's "all orders from March" query from the [concept guide](../../../knowledge/how-to-scale-a-database.md#3-partitioning).

Now filter on something that's _not_ the partition key:

```sql
EXPLAIN SELECT count(*) FROM orders WHERE customer_id = 7;
```

```
 Aggregate
   ->  Append
         ->  Bitmap Heap Scan on orders_2026_01 orders_1
               ->  Bitmap Index Scan on orders_2026_01_customer_id_idx
         ->  Bitmap Heap Scan on orders_2026_02 orders_2
               ->  Bitmap Index Scan on orders_2026_02_customer_id_idx
         ->  Bitmap Heap Scan on orders_2026_03 orders_3
               ->  Bitmap Index Scan on orders_2026_03_customer_id_idx
         ->  Seq Scan on orders_default orders_4
```

**Every partition is visited**. With 3 partitions that's fine, but with 60 monthly partitions this query does 60 index lookups instead of 1. That's what the concept guide means by "partitioning doesn't automatically make every query faster". **Pick a partition key that most of your heavy queries filter on**.

Pruning also works when the value is only known at runtime, like `now()` or a query parameter:

```sql
EXPLAIN SELECT * FROM orders WHERE created_at >= now() - interval '7 days';
```

```
 Append
   Subplans Removed: 3
   ->  Seq Scan on orders_default orders_1
         Filter: (created_at >= (now() - '7 days'::interval))
```

`Subplans Removed: 3` means 3 partitions were pruned when the query started executing.

## 4. Maintenance: this is where partitioning pays off

Honestly, the biggest win of partitioning usually isn't query speed. It's that **operations on huge amounts of old data become instant**.

### Deleting old data

Say we keep 12 months of orders. Without partitioning, removing a month is:

```sql
DELETE FROM orders WHERE created_at < '2025-02-01';
```

That's millions of rows deleted one by one. It generates a huge amount of WAL (which replicas must replay too), takes locks for a long time, and leaves the table full of dead rows for vacuum to clean up.

With partitioning:

```sql
ALTER TABLE orders DETACH PARTITION orders_2026_01;
DROP TABLE orders_2026_01;
```

**Both are metadata operations, they take milliseconds regardless of how many rows there are**. And between the 2 steps, `orders_2026_01` is a regular standalone table. You can dump it to cold storage (`pg_dump -t orders_2026_01`) before dropping it.

`DETACH PARTITION` takes a strong lock on the parent for a moment. On a busy table, you can use `DETACH PARTITION ... CONCURRENTLY` instead, which waits for running queries rather than blocking them. One limitation: it can't be used when the table has a default partition.

### Creating future partitions

Since partitions aren't created automatically, **always create them ahead of time**, e.g. 3 months in advance, with a scheduled job:

```sql
CREATE TABLE IF NOT EXISTS orders_2026_04 PARTITION OF orders FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE IF NOT EXISTS orders_2026_05 PARTITION OF orders FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

Doing this by hand gets old fast. The [pg_partman](https://github.com/pgpartman/pg_partman) extension automates both creating and dropping partitions. It's not part of our lab (it needs to be installed separately), but on a freshly created partitioned table, it looks like this:

```sql
CREATE SCHEMA partman;
CREATE EXTENSION pg_partman SCHEMA partman;

-- keep 4 future monthly partitions ready at all times
SELECT partman.create_parent(
  p_parent_table := 'public.orders',
  p_control      := 'created_at',
  p_interval     := '1 month'
);

-- and drop partitions older than 12 months
UPDATE partman.part_config
SET retention = '12 months', retention_keep_table = false
WHERE parent_table = 'public.orders';
```

Then run `CALL partman.run_maintenance_proc();` periodically, from a cron job, [pg_cron](https://github.com/citusdata/pg_cron), or pg_partman's own background worker. (pg_partman's API changed between major versions. This is the 5.x syntax.)

### Attaching a pre-loaded table

Sometimes you want to bulk-load a month of data (e.g. a backfill) without touching the live table. Load it into a standalone table first, then attach it:

```sql
CREATE TABLE orders_2026_06 (LIKE orders INCLUDING DEFAULTS INCLUDING CONSTRAINTS);

-- ... COPY / INSERT the data into orders_2026_06 ...

ALTER TABLE orders_2026_06
  ADD CONSTRAINT orders_2026_06_range CHECK (created_at >= '2026-06-01' AND created_at < '2026-07-01');

ALTER TABLE orders ATTACH PARTITION orders_2026_06 FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

ALTER TABLE orders_2026_06 DROP CONSTRAINT orders_2026_06_range;
```

When attaching, Postgres must verify that every row fits the partition bounds, which means scanning the whole table while holding a lock. **The CHECK constraint lets it skip that scan**, because it already proves the rows fit. Once attached, the constraint is redundant, so we drop it.

### The default partition trap

Remember the default partition? There's no partition for July yet, so a July order lands there:

```sql
INSERT INTO orders (customer_id, total, created_at) VALUES (1, 10, '2026-07-05');
```

Now try creating the July partition:

```sql
CREATE TABLE orders_2026_07 PARTITION OF orders FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

> _ERROR: updated partition constraint for default partition "orders_default" would be violated by some row_

Postgres won't create a partition for July while July rows sit in the default partition. You have to move them out:

```sql
BEGIN;
ALTER TABLE orders DETACH PARTITION orders_default;

CREATE TABLE orders_2026_07 PARTITION OF orders FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

INSERT INTO orders OVERRIDING SYSTEM VALUE
SELECT * FROM orders_default WHERE created_at >= '2026-07-01' AND created_at < '2026-08-01';

DELETE FROM orders_default WHERE created_at >= '2026-07-01' AND created_at < '2026-08-01';

ALTER TABLE orders ATTACH PARTITION orders_default DEFAULT;
COMMIT;
```

(`OVERRIDING SYSTEM VALUE` keeps the original ids, since `id` is `GENERATED ALWAYS`.)

Also, every time you create a new partition, **Postgres scans the default partition** to check nothing in it belongs to the new one. If the default partition is big, that's slow, and it holds a lock while doing so.

**So: the default partition should stay empty**. Treat rows in it as an alert that a partition is missing, not as a place to store data.

## 5. LIST and HASH partitioning

**LIST**, by explicit values:

```sql
CREATE TABLE customers (
  id      bigint,
  country text NOT NULL,
  name    text
) PARTITION BY LIST (country);

CREATE TABLE customers_il    PARTITION OF customers FOR VALUES IN ('IL');
CREATE TABLE customers_eu    PARTITION OF customers FOR VALUES IN ('DE', 'FR', 'ES');
CREATE TABLE customers_other PARTITION OF customers DEFAULT;
```

**HASH**, spreading rows evenly over a fixed number of partitions:

```sql
CREATE TABLE events (
  id          bigint,
  customer_id bigint NOT NULL,
  payload     jsonb
) PARTITION BY HASH (customer_id);

CREATE TABLE events_p0 PARTITION OF events FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE events_p1 PARTITION OF events FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE events_p2 PARTITION OF events FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE events_p3 PARTITION OF events FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

A query for one customer (`WHERE customer_id = 42`) is pruned down to a single partition. But hash partitioning loses the maintenance superpower: **there's no "old" partition to drop**, and changing the number of partitions means rewriting all the data. Use it when you need to split a huge table that has no time dimension.

You can also **sub-partition**: a partition can itself be partitioned (e.g. by month, then each month by hash). That's rarely needed. Start simple.

## 6. Gotchas

- **No global uniqueness**. Since unique constraints must include the partition key, `id` alone is not guaranteed unique across partitions. In practice, an identity column or `uuidv7()` won't produce duplicates anyway. Just know the database isn't enforcing it.
- **Foreign keys pointing _to_ the partitioned table** must reference the full key, `(id, created_at)`. Other tables that reference orders need both columns.
- **Autovacuum settings must go on each partition**, not on the parent: `ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = ...)` fails with _cannot specify storage parameters for a partitioned table_.
- **Autovacuum never ANALYZEs the parent**. It analyzes each partition, but the parent's own statistics (used for some query plans across partitions) are only refreshed when you run `ANALYZE orders;` yourself. Schedule it occasionally.
- **Partition bounds are interpreted in the session's time zone**. `'2026-01-01'` means midnight in whatever `TimeZone` the session had when you ran `CREATE TABLE`. Pick one convention (usually UTC: `'2026-01-01 00:00:00+00'`) and stick to it in scripts.
- **Don't over-partition**. Each partition adds planning overhead, especially for queries that can't be pruned. Hundreds of partitions is fine. Tens of thousands is not. Daily partitions for 10 years is probably too many, monthly is probably right.
- **Updating the partition key moves the row** to another partition (internally a delete + insert). It works, but it's slower than a normal update.
- **Small tables don't need it**. Partitioning makes sense when a table is big (tens of GBs, or hundreds of millions of rows), or when you need cheap retention. Below that, a good index is simpler and just as fast.

## 7. Converting an existing table

You can't `ALTER TABLE ... PARTITION BY` an existing table. A common trick is to **make the existing table the first partition** of a new parent, with no data copy:

```sql
-- 1. Online preparation (doesn't block reads or writes)
CREATE UNIQUE INDEX CONCURRENTLY orders_id_created_at_idx ON orders (id, created_at);
ALTER TABLE orders ADD CONSTRAINT orders_legacy_range CHECK (created_at < '2026-12-01') NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_legacy_range;

-- 2. The switch (metadata only, fast)
BEGIN;
ALTER TABLE orders RENAME TO orders_legacy;
ALTER TABLE orders_legacy ALTER COLUMN id DROP IDENTITY;
ALTER TABLE orders_legacy
  DROP CONSTRAINT orders_pkey,
  ADD CONSTRAINT orders_legacy_pkey PRIMARY KEY USING INDEX orders_id_created_at_idx;

CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY,
  customer_id bigint        NOT NULL,
  total       numeric(10,2) NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
CREATE INDEX ON orders (customer_id);

ALTER TABLE orders ATTACH PARTITION orders_legacy FOR VALUES FROM (MINVALUE) TO ('2026-12-01');
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT max(id) FROM orders_legacy));
CREATE TABLE orders_2026_12 PARTITION OF orders FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');
COMMIT;
```

What each part does:

- The new unique index on `(id, created_at)`, built `CONCURRENTLY`, becomes the legacy table's primary key, because the partitioned table's primary key requires it.
- The `NOT VALID` + `VALIDATE` CHECK constraint proves all rows fit the legacy range, without blocking writes. So `ATTACH` doesn't have to scan the table.
- A partition can't have its own identity column, so the legacy table drops it, and the new parent's sequence continues from the old max id.

From then on, new rows go into monthly partitions, and `orders_legacy` stays as one big partition for the old data. You can split it into months later, or just let it age out.

:::caution
Foreign keys from other tables that reference `orders (id)` will block dropping the old primary key. They have to be dropped first, and recreated against `(id, created_at)`. Rehearse this on a copy of production before running it for real.
:::

## 8. Cleanup

```bash
dropdb partitioning_lab
```

## 9. Summary

- A **partitioned table** is a parent with no data, routing rows to **partitions**, which are regular tables.
- **RANGE by time** is the common case. LIST and HASH exist for when there's no time dimension.
- Primary keys and unique constraints **must include the partition key**.
- Queries benefit only when they **filter on the partition key** (check with `EXPLAIN`).
- The real superpower is **instant retention**: `DETACH` + `DROP` instead of `DELETE`.
- **Create partitions ahead of time** (pg_partman or a cron job), and keep the default partition empty.
