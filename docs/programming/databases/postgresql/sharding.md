# Sharding

This page is the hands-on, Postgres-specific follow-up to [How do you scale a database?](../../../knowledge/how-to-scale-a-database.md#4-sharding). If you're not sure _why_ you'd want sharding, or what a shard key or a hot shard is, start there.

## 1. Introduction

**Postgres has no built-in sharding**. Replication and partitioning are core features, but distributing one table's data across several servers is something you add on top. You have 4 realistic options:

1. **Application-level sharding**: several ordinary Postgres servers, and your backend code decides which one to talk to.
2. **Citus**: an open-source Postgres extension that turns several Postgres servers into one distributed database.
3. **postgres_fdw + partitioning**: built-in features that can be combined into "poor man's sharding". Good for learning, rarely for production.
4. **A distributed database that speaks Postgres**: CockroachDB, YugabyteDB, or AWS Aurora Limitless. Your app thinks it's talking to Postgres, but it isn't really Postgres underneath.

We'll go through the first 3 hands-on. But first...

## 2. Before you shard

Sharding is the most expensive of the 3 techniques. Not in money, but in complexity you'll carry forever: cross-shard queries, schema migrations on N servers, rebalancing, backups of N servers. **A single, well-tuned Postgres server goes much further than most people expect**. Multi-terabyte databases handling tens of thousands of transactions per second on one primary are common.

So check, in this order:

1. **Slow queries and missing indexes** (`pg_stat_statements` will show you, see [Configuration](./configuration.md#logging--observability)).
2. **Configuration**. The defaults are tuned for a tiny machine (see [Configuration](./configuration.md)).
3. **A bigger server** (vertical scaling). It's boring, and it works.
4. **Connection pooling** (PgBouncer), if the problem is the number of connections.
5. **Read replicas**, if the load is mostly reads (see [Replication](./replication.md)).
6. **Partitioning**, if the problem is a few huge tables (see [Partitioning](./partitioning.md)).
7. **Archiving old data** somewhere else.

Shard when **writes or total data size truly exceed what one server can handle**, and nothing above helped.

## 3. Choosing the shard key

Everything else depends on this decision, and it's very hard to change later. A good shard key:

- **Appears in most queries**, so most queries go to exactly one shard.
- **Groups data that's used together**, so joins and transactions stay on one shard (**co-location**).
- **Has many distinct values, spread evenly**, so no shard becomes a hot shard.

For our online store, `customer_id` is a natural choice. A customer's orders, payments, and cart are all fetched together, and almost always filtered by customer.

Bad choices:

- `created_at`: all new writes go to the shard holding "now". A textbook hot shard.
- `country`: low cardinality, and very uneven (one big market overwhelms its shard).
- `order_id`: spreads evenly, but now a customer's orders are spread across all shards, so "show my orders" hits every shard.

**In SaaS apps, the shard key is almost always the tenant** (`company_id`, `account_id`, `workspace_id`).

## 4. Option A: Application-level sharding

You run N ordinary Postgres servers, each with the same schema, each holding a slice of the customers. The backend has a **shard map**, and uses it to route every query.

### The naive way, and why it hurts

```ts
const shardIndex = customerId % servers.length;
```

Simple, and evenly distributed. But when you go from 2 servers to 3, `customerId % 3` gives a different answer than `customerId % 2` for most customers. **Adding a server means moving almost all of the data**.

### The better way: many logical shards

Split the key space into a **fixed, large number of logical shards** (e.g. 1024), which never changes. Then map _ranges_ of logical shards to physical servers:

```ts
import { createHash } from 'node:crypto';
import { Pool } from 'pg';

const LOGICAL_SHARDS = 1024; // never change this

const servers = [
  { from: 0, to: 511, pool: new Pool({ connectionString: process.env.SHARD_A_URL }) },
  { from: 512, to: 1023, pool: new Pool({ connectionString: process.env.SHARD_B_URL }) },
];

function logicalShardOf(customerId: string): number {
  const hash = createHash('md5').update(customerId).digest();
  return hash.readUInt32BE(0) % LOGICAL_SHARDS;
}

function poolFor(customerId: string): Pool {
  const shard = logicalShardOf(customerId);
  return servers.find((server) => shard >= server.from && shard <= server.to)!.pool;
}

// every query for a customer goes through poolFor()
const { rows } = await poolFor(customerId).query('SELECT * FROM orders WHERE customer_id = $1', [customerId]);
```

When server A gets full, add server C, **move logical shards 256-511 from A to C**, and change one line of the map. Only a quarter of the data moves, and only from one server. To make the move easy, store the logical shard number on every row (a `shard_no` column), or give each logical shard its own schema. Instagram famously sharded Postgres this way, with thousands of logical shards stored as schemas.

The hash function must be **stable forever**: same input, same output, on every machine, in every language that will ever route queries. That's why we use a standard hash (md5 here, for distribution, not security), and not something language-specific.

### IDs must be globally unique

With `id bigint GENERATED ALWAYS AS IDENTITY`, each shard counts from 1 on its own, so shard A and shard B both have an order with `id = 1`. Use IDs that are unique without coordination:

- **UUIDv7**: time-ordered UUIDs, so they're index-friendly. Built into Postgres 18 (`DEFAULT uuidv7()`). For older versions, generate them in the app.
- **Snowflake-style IDs**: 64-bit integers made of a timestamp, a shard/machine number, and a counter.

### Cross-shard queries: you write the scatter-gather

The finance team's "all orders in March" has no `customer_id`, so it must ask every shard:

```ts
async function totalRevenueInMarch() {
  const results = await Promise.all(
    servers.map((server) =>
      server.pool.query(
        `SELECT count(*) AS orders, sum(total) AS revenue
         FROM orders
         WHERE created_at >= '2026-03-01' AND created_at < '2026-04-01'`,
      ),
    ),
  );

  const orders = results.reduce((acc, r) => acc + Number(r.rows[0].orders), 0);
  const revenue = results.reduce((acc, r) => acc + Number(r.rows[0].revenue ?? 0), 0);

  return { orders, revenue, averageOrder: orders ? revenue / orders : 0 };
}
```

Notice we fetch `sum` and `count` from each shard, and compute the average at the end. Averaging each shard's average would be wrong (see [Fetching data from multiple shards](../../../knowledge/how-to-scale-a-database.md#7-extra-fetching-data-from-multiple-shards) for this, and for joins and transactions across shards).

### The operational cost

- **Schema migrations** must run on every shard, and you need a plan for when one shard fails mid-migration.
- **Tables that aren't per-customer** (products, countries) either live in a separate database, or get copied to every shard.
- **Backups, monitoring, upgrades** are now N times the work.

This is a lot of code to own. That's exactly what Citus does for you.

## 5. Option B: Citus

[Citus](https://github.com/citusdata/citus) is an open-source Postgres extension (maintained by Microsoft). You run a **coordinator** node, which your application connects to like a normal Postgres, and several **worker** nodes, which hold the data. You declare which tables are distributed and by which column. Citus splits them into shards (32 by default), spreads them over the workers, and **routes, fans out, and merges queries for you**.

It's the "routing proxy / coordinator" option from the [concept guide](../../../knowledge/how-to-scale-a-database.md#who-does-the-combining), living inside Postgres.

### Step 1: Start a cluster with Docker

One coordinator and one worker for now. We'll add a second worker later, to see rebalancing:

```bash
docker network create citus-net

docker run -d --name citus-coordinator --network citus-net --platform linux/amd64 \
  -e POSTGRES_HOST_AUTH_METHOD=trust citusdata/citus:latest -c wal_level=logical

docker run -d --name citus-worker-1 --network citus-net --platform linux/amd64 \
  -e POSTGRES_HOST_AUTH_METHOD=trust citusdata/citus:latest -c wal_level=logical
```

- `--platform linux/amd64`: the official image has no ARM build. On Apple Silicon, Docker runs it through emulation (slower, but fine for a lab). On Intel/AMD machines, you can drop this flag.
- `POSTGRES_HOST_AUTH_METHOD=trust`: no passwords between the nodes. Lab only!
- `-c wal_level=logical`: Citus moves shards between nodes using logical replication. Without this, rebalancing gets stuck with _logical decoding requires "wal_level" >= "logical"_.

Connect to the coordinator, and register the nodes:

```bash
docker exec -it citus-coordinator psql -U postgres
```

```sql
SELECT citus_set_coordinator_host('citus-coordinator', 5432);
SELECT citus_add_node('citus-worker-1', 5432);

SELECT * FROM citus_get_active_worker_nodes();
```

### Step 2: Create tables, and distribute them

Create the tables as usual:

```sql
CREATE TABLE customers (
  id      bigint PRIMARY KEY,
  name    text NOT NULL,
  country text
);

CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY,
  customer_id bigint        NOT NULL,
  product_id  bigint        NOT NULL,
  total       numeric(10,2) NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (customer_id, id)
);

CREATE TABLE products (
  id    bigint PRIMARY KEY,
  name  text NOT NULL,
  price numeric(10,2) NOT NULL
);
```

Then tell Citus how to spread them:

```sql
SELECT create_distributed_table('customers', 'id');
SELECT create_distributed_table('orders', 'customer_id', colocate_with => 'customers');
SELECT create_reference_table('products');
```

These 3 lines are the 3 strategies for joins from the [concept guide](../../../knowledge/how-to-scale-a-database.md#joins-across-shards):

- **Distributed table**: split into shards by the distribution column (= the shard key).
- **Co-location**: `orders` is sharded by `customer_id` using the same hash ranges as `customers`. So customer 42 and all of customer 42's orders always end up on the same worker, and joining them never crosses the network.
- **Reference table**: `products` is small, so a full copy is kept on every worker, and any shard can join against it locally.

:::info
Same rule as with partitioning: **primary keys and unique constraints must include the distribution column**. That's why the primary key of `orders` is `(customer_id, id)`. Try distributing a table whose primary key is just `id`, and you'll get:

> _Distributed relations cannot have UNIQUE, EXCLUDE, or PRIMARY KEY constraints that do not include the partition column_

:::

Add some data:

```sql
INSERT INTO products SELECT g, 'product ' || g, g * 10 FROM generate_series(1, 50) g;
INSERT INTO customers SELECT g, 'customer ' || g, 'IL' FROM generate_series(1, 1000) g;
INSERT INTO orders (customer_id, product_id, total)
SELECT (random() * 999)::int + 1, (random() * 49)::int + 1, 10 FROM generate_series(1, 20000);
```

And look at what Citus did:

```sql
SELECT table_name, citus_table_type, distribution_column, colocation_id, shard_count FROM citus_tables;
```

```
 table_name | citus_table_type | distribution_column | colocation_id | shard_count
------------+------------------+---------------------+---------------+-------------
 customers  | distributed      | id                  |             1 |          32
 orders     | distributed      | customer_id         |             1 |          32
 products   | reference        | <none>              |             2 |           1
```

`customers` and `orders` share `colocation_id = 1`.

### Step 3: Watch the routing

A query that filters on the shard key goes to **one shard**:

```sql
EXPLAIN (COSTS OFF)
SELECT o.id, p.name FROM orders o JOIN products p ON p.id = o.product_id WHERE o.customer_id = 42;
```

```
 Custom Scan (Citus Adaptive)
   Task Count: 1
   ->  Task
         Node: host=citus-worker-1 port=5432 dbname=postgres
         ->  Hash Join
               ->  Seq Scan on products_102072 p
               ->  Hash
                     ->  Bitmap Heap Scan on orders_102067 o
                           Recheck Cond: (customer_id = 42)
```

`Task Count: 1`: one shard of `orders` (`orders_102067`), joined with the local copy of `products`.

A query without the shard key goes to **all of them** (scatter-gather):

```sql
EXPLAIN (COSTS OFF)
SELECT c.country, count(*) FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY 1;
```

```
 HashAggregate
   Group Key: remote_scan.country
   ->  Custom Scan (Citus Adaptive)
         Task Count: 32
         ->  Task
               ->  HashAggregate
                     Group Key: c.country
                     ->  Hash Join
                           Hash Cond: (o.customer_id = c.id)
```

`Task Count: 32`: every shard computes a partial `count(*)` per country, and the coordinator adds them up (the top `HashAggregate`). Notice the join itself still runs inside each shard. That's co-location paying off.

**`Task Count` in `EXPLAIN` is the number to watch**. For your frequent queries, it should be 1.

Multi-shard writes in a single transaction are safe too. Citus uses two-phase commit (2PC) behind the scenes, so they're atomic across workers.

### Step 4: Add a worker, and rebalance

```bash
docker run -d --name citus-worker-2 --network citus-net --platform linux/amd64 \
  -e POSTGRES_HOST_AUTH_METHOD=trust citusdata/citus:latest -c wal_level=logical
```

```sql
SELECT citus_add_node('citus-worker-2', 5432);

SELECT nodename, count(*) FROM citus_shards WHERE table_name = 'orders'::regclass GROUP BY 1;
```

```
    nodename    | count
----------------+-------
 citus-worker-1 |    32
```

**Adding a node doesn't move anything by itself**. Start a rebalance:

```sql
SELECT citus_rebalance_start();
SELECT * FROM citus_rebalance_status(); -- run until state = finished
```

```
    nodename    | count
----------------+-------
 citus-worker-1 |    17
 citus-worker-2 |    15
```

Shards are moved online, using logical replication, while the application keeps reading and writing. Co-located shards move together, so customer 42 and their orders are never split apart.

### Things to know about Citus

- **Pick shard count up front**. The default is 32 shards per table. Shards (not rows) are the unit that moves between nodes, so you can't spread 32 shards across more than 32 workers. Set `citus.shard_count` before creating tables if you expect a big cluster.
- **Each worker should have replicas** for high availability. Citus distributes data, it doesn't replace replication. The coordinator is also a single point of failure that needs a replica.
- **Multi-tenant apps** can also use **schema-based sharding** (Citus 12+): one schema per tenant, and each schema lives on one node. No distribution columns needed.
- **Managed**: Azure offers Citus as a managed service (elastic clusters in Azure Database for PostgreSQL).

### Cleanup

```bash
docker rm -f citus-coordinator citus-worker-1 citus-worker-2
docker network rm citus-net
```

## 6. Option C: postgres_fdw + partitioning

This combines 2 built-in features:

- **postgres_fdw** (foreign data wrapper) lets one Postgres server expose a table living on another server as a local **foreign table**.
- A **partition can be a foreign table**.

So we can create a hash-partitioned `orders` table where each partition lives on a different server. It's a great way to _see_ sharding with nothing but Postgres.

### Step 1: Two shard servers

Like in the [replication lab](./replication.md#2-hands-on-a-primary-and-a-replica-on-your-machine), we create brand new servers in a lab folder:

```bash
mkdir -p ~/pg-lab
for n in 1 2; do
  initdb -D ~/pg-lab/shard$n -U postgres --auth=trust
  pg_ctl -D ~/pg-lab/shard$n -l ~/pg-lab/shard$n.log -o "-p 544$n" start
done
```

Shard 1 runs on port `5441`, shard 2 on `5442`. Create the same table on both:

```bash
for p in 5441 5442; do
  psql -p $p -U postgres -c "CREATE TABLE orders (
    id          bigint        NOT NULL,
    customer_id bigint        NOT NULL,
    total       numeric(10,2) NOT NULL,
    created_at  timestamptz   NOT NULL DEFAULT now(),
    PRIMARY KEY (customer_id, id)
  );"
done
```

### Step 2: The coordinator

Your regular local server will play the coordinator:

```bash
createdb fdw_lab
psql fdw_lab
```

```sql
CREATE EXTENSION postgres_fdw;

CREATE SERVER shard_1 FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host '127.0.0.1', port '5441', dbname 'postgres', async_capable 'true');
CREATE SERVER shard_2 FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host '127.0.0.1', port '5442', dbname 'postgres', async_capable 'true');

CREATE USER MAPPING FOR CURRENT_USER SERVER shard_1 OPTIONS (user 'postgres');
CREATE USER MAPPING FOR CURRENT_USER SERVER shard_2 OPTIONS (user 'postgres');

CREATE TABLE orders (
  id          bigint        NOT NULL,
  customer_id bigint        NOT NULL,
  total       numeric(10,2) NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now()
) PARTITION BY HASH (customer_id);

CREATE FOREIGN TABLE orders_shard_1 PARTITION OF orders
  FOR VALUES WITH (MODULUS 2, REMAINDER 0) SERVER shard_1 OPTIONS (table_name 'orders');
CREATE FOREIGN TABLE orders_shard_2 PARTITION OF orders
  FOR VALUES WITH (MODULUS 2, REMAINDER 1) SERVER shard_2 OPTIONS (table_name 'orders');
```

- `CREATE SERVER` describes how to reach each shard.
- `CREATE USER MAPPING` says which remote user to connect as.
- `async_capable 'true'` lets the coordinator query the shards **in parallel**, instead of one after the other.

### Step 3: Use it

```sql
INSERT INTO orders (id, customer_id, total) SELECT g, g % 100, 10 FROM generate_series(1, 1000) g;

SELECT tableoid::regclass, count(*) FROM orders GROUP BY 1;
```

```
    tableoid    | count
----------------+-------
 orders_shard_1 |   530
 orders_shard_2 |   470
```

The rows physically live on the other servers. Check directly: `psql -p 5441 -U postgres -c "SELECT count(*) FROM orders;"`.

A query with the shard key goes to one shard, and the filter is sent along:

```sql
EXPLAIN (VERBOSE, COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;
```

```
 Foreign Scan on public.orders_shard_1 orders
   Remote SQL: SELECT id, customer_id, total, created_at FROM public.orders WHERE ((customer_id = 42))
```

A query without it goes to both, in parallel (`Async Foreign Scan`). By default, aggregates are computed on the coordinator, meaning every row is shipped over the network first. Turn on partitionwise aggregation, and each shard computes its own part:

```sql
SET enable_partitionwise_aggregate = on;

EXPLAIN (VERBOSE, COSTS OFF)
SELECT customer_id, count(*), sum(total) FROM orders GROUP BY customer_id;
```

```
 Append
   ->  Async Foreign Scan
         Relations: Aggregate on (public.orders_shard_1 orders)
         Remote SQL: SELECT customer_id, count(*), sum(total) FROM public.orders GROUP BY 1
   ->  Async Foreign Scan
         Relations: Aggregate on (public.orders_shard_2 orders_1)
         Remote SQL: SELECT customer_id, count(*), sum(total) FROM public.orders GROUP BY 1
```

### Why this usually isn't enough for production

- **No atomic writes across shards**. A transaction that writes to both shards commits on each separately. If the coordinator crashes in between, one shard has the change and the other doesn't. (postgres_fdw has no two-phase commit.)
- **No rebalancing**. Going from 2 to 3 shards means repartitioning and moving the data yourself.
- **No global uniqueness**. Each shard enforces its own primary key, nothing checks across shards.
- **Schema changes** must be applied on every shard by hand, and on the coordinator.
- **Joins between foreign tables** on different servers pull rows to the coordinator.

Where it _is_ useful: moving old, rarely-read partitions to a cheaper server, while keeping them queryable through the same table.

### Cleanup

```bash
dropdb fdw_lab
for n in 1 2; do pg_ctl -D ~/pg-lab/shard$n stop; done
rm -rf ~/pg-lab
```

## 7. Summary

- Postgres doesn't shard on its own. **Exhaust indexes, configuration, bigger hardware, replicas, and partitioning first**.
- **The shard key is the decision that matters**: it should be in most queries, keep related data together, and spread evenly. Usually the customer or tenant id.
- **Application-level sharding**: full control, and full responsibility. Use many logical shards from day one, and globally unique ids.
- **Citus**: distributed tables, reference tables, co-location, query routing, 2PC, and online rebalancing, inside Postgres. **Watch `Task Count` in `EXPLAIN`**.
- **postgres_fdw + partitioning**: a good way to learn the mechanics. Missing the guarantees you'd want in production.
