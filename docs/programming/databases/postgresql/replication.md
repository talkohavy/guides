# Replication

## 1. WAL - Write-Ahead Log

WAL (Write-Ahead Log) is a mechanism databases use to ensure durability and crash recovery.

The core idea is simple:

> Before modifying the actual database, write down what you're about to change in a sequential log.

If the database crashes halfway through a write, it can use that log to recover.

### - A. How does it work?

Imagine you execute:

```sql
UPDATE accounts
SET balance = 500
WHERE id = 123;
```

Without WAL, the database might immediately modify the relevant data page on disk.

## 1. How [replication](../../../knowledge/how-to-scale-a-database.md#2-replication) works in Postgres

Every change in Postgres is first written to the **WAL** (Write-Ahead Log), and only then applied to the actual table files. That log is what makes replication possible: **a replica (Postgres calls it a standby) is simply a server that keeps receiving the primary's WAL, and replays it**.

Postgres has 2 kinds of replication:

- **Physical (streaming) replication**: the standby is a **byte-for-byte copy of the entire server**, all databases, all tables. It is **read-only**. This is the one you use for read scaling and failover, and it's what most of this page is about.
- **Logical replication**: replicates **changes of specific tables** (rows inserted/updated/deleted) using a publish/subscribe model. The subscriber is a normal, writable database. Useful for major version upgrades, or sending a subset of data somewhere else. See [section 7](#7-logical-replication).

A standby that accepts read queries while replaying WAL is called a **hot standby**. That's the default behavior, so every standby you create here can serve reads.

## 2. Hands-on: a primary and a replica on your machine

We'll create **2 brand new Postgres servers** in a lab folder, so your existing server on port 5432 is untouched:

- primary on port `5433`
- replica on port `5434`

### Step 1: Create the primary

```bash
mkdir -p ~/pg-lab
initdb -D ~/pg-lab/primary -U postgres --auth-local=trust --auth-host=scram-sha-256
```

- `-U postgres` names the superuser `postgres`.
- `--auth-local=trust` lets you connect through the local socket without a password (lab convenience).
- `--auth-host=scram-sha-256` requires a password for TCP/IP connections, which is how the replica will connect.

Set the port, and start it:

```bash
echo "port = 5433" >> ~/pg-lab/primary/postgresql.conf
pg_ctl -D ~/pg-lab/primary -l ~/pg-lab/primary.log start
```

:::info
On Postgres 10 and above, **the defaults already allow streaming replication**: `wal_level = replica`, `max_wal_senders = 10`, `max_replication_slots = 10`. You can verify with `SHOW wal_level;`. On older versions, you had to set these yourself.
:::

### Step 2: Create a replication role

The replica connects to the primary as a regular client, so it needs a user. Give it the `REPLICATION` attribute, and nothing else:

```bash
psql -p 5433 -U postgres -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_pass';"
```

### Step 3: Allow the replica to connect (`pg_hba.conf`)

Replication connections are matched by the special `replication` keyword in the database column of `pg_hba.conf` (see [Client Authentication](./client-authentication.md)). `initdb` already added these lines for us:

```bash
cat ~/pg-lab/primary/pg_hba.conf | grep replication
```

```
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256
```

In production, the replica lives on another machine, so you'd add a line for its IP, and restrict it to the replication user:

```
host    replication     replicator      10.0.1.12/32            scram-sha-256
```

### Step 4: Clone the primary with `pg_basebackup`

A replica must start from a full copy of the primary. `pg_basebackup` takes that copy while the primary keeps running:

```bash
pg_basebackup -h 127.0.0.1 -p 5433 -U replicator -D ~/pg-lab/replica -R -X stream -C -S replica_1_slot -P
```

It will prompt for the password (`replicator_pass`). The flags:

- `-D ~/pg-lab/replica`: where to put the copy. This becomes the replica's data directory.
- `-R`: **write the replication config for us**. It creates an empty `standby.signal` file (which tells Postgres "start as a standby"), and adds `primary_conninfo` (how to reach the primary) to `postgresql.auto.conf`.
- `-X stream`: also stream the WAL generated _during_ the backup, so the copy is consistent.
- `-C -S replica_1_slot`: create a **replication slot** named `replica_1_slot` on the primary. More on slots in [section 3](#3-monitoring-replication).
- `-P`: show progress.

Look at what `-R` generated:

```bash
ls ~/pg-lab/replica | grep signal
cat ~/pg-lab/replica/postgresql.auto.conf
```

```
standby.signal

primary_conninfo = 'user=replicator password=replicator_pass ... host=127.0.0.1 port=5433 ...'
primary_slot_name = 'replica_1_slot'
```

### Step 5: Start the replica

The copy includes the primary's `postgresql.conf`, which says `port = 5433`. Override it when starting:

```bash
pg_ctl -D ~/pg-lab/replica -l ~/pg-lab/replica.log -o "-p 5434" start
```

### Step 6: See it work

Write to the primary:

```bash
psql -p 5433 -U postgres -c "CREATE TABLE products (id serial PRIMARY KEY, name text); INSERT INTO products (name) VALUES ('Keyboard');"
```

Read from the replica:

```bash
psql -p 5434 -U postgres -c "SELECT * FROM products;"
```

```
 id |   name
----+----------
  1 | Keyboard
```

The table and the row are there, even though we never created them on the replica. Now try to write to the replica:

```bash
psql -p 5434 -U postgres -c "INSERT INTO products (name) VALUES ('Mouse');"
```

> _ERROR: cannot execute INSERT in a read-only transaction_

**Only the primary accepts writes**. You can always ask a server which role it plays:

```sql
SELECT pg_is_in_recovery(); -- true on a standby, false on the primary
```

## 3. Monitoring replication

### On the primary: `pg_stat_replication`

One row per connected standby:

```sql
SELECT application_name, client_addr, state, sync_state,
       write_lag, flush_lag, replay_lag,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) AS replay_lag_size
FROM pg_stat_replication;
```

- `state = streaming` means the standby is caught up and receiving changes live.
- `sync_state` is `async` or `sync` (see [section 4](#4-asynchronous-vs-synchronous-replication)).
- `replay_lag` is **how far behind the replica is, in time**. `replay_lag_size` is the same thing in bytes of WAL.

**If a standby is missing from this view, it's not replicating**.

### On the replica: `pg_stat_wal_receiver`

```sql
SELECT status, sender_host, sender_port FROM pg_stat_wal_receiver;

-- how long ago was the last replayed transaction committed on the primary?
SELECT now() - pg_last_xact_replay_timestamp() AS lag;
```

:::caution
The second query looks at the last transaction that was replayed. If the primary is idle, this number keeps growing even though the replica is fully caught up.
:::

### Replication slots, and the disk-full trap

Without a slot, the primary deletes old WAL files whenever it wants. If a replica disconnects for a while, the WAL it needs may already be gone, and it can't catch up anymore. You'd have to re-clone it.

**A replication slot makes the primary keep WAL until the replica confirms it received it**. That solves the problem, but creates a new one: **if a replica dies and never comes back, its slot makes the primary keep WAL forever, until the disk is full and the primary crashes**.

Check your slots:

```sql
SELECT slot_name, slot_type, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal
FROM pg_replication_slots;
```

Two rules:

1. **Drop slots you no longer need**: `SELECT pg_drop_replication_slot('replica_1_slot');`
2. **Put a cap on it**: `max_slot_wal_keep_size = 50GB` in `postgresql.conf` (default `-1`, unlimited). A slot that exceeds the cap gets invalidated (that replica must be re-cloned), instead of taking the primary down with it.

## 4. Asynchronous vs synchronous replication

By default, replication is **asynchronous**. The primary commits, answers the client "done", and ships the change to replicas a moment later. That's fast, but if the primary crashes in that moment, **the last few transactions never made it to any replica**. If you then promote a replica, those transactions are lost.

With **synchronous replication**, the primary waits for a standby to confirm it has the change, before telling the client "committed".

### Turning it on

The primary identifies standbys by their `application_name`. Let's add a second replica that sets one, by passing a full connection string to `pg_basebackup`:

```bash
pg_basebackup -d "host=127.0.0.1 port=5433 user=replicator application_name=replica_2" \
  -D ~/pg-lab/replica2 -R -X stream -C -S replica_2_slot
pg_ctl -D ~/pg-lab/replica2 -l ~/pg-lab/replica2.log -o "-p 5435" start
```

Now, on the primary, tell it which standbys are synchronous:

```sql
ALTER SYSTEM SET synchronous_standby_names = 'replica_2';
SELECT pg_reload_conf();

SELECT application_name, sync_state FROM pg_stat_replication;
```

```
 application_name | sync_state
------------------+------------
 walreceiver      | async
 replica_2        | sync
```

`walreceiver` is the default name, which is what our first replica got, since it didn't set one.

With multiple candidates, you can choose a policy:

- `FIRST 1 (replica_2, replica_3)`: wait for the first one in the list that's connected. `replica_3` takes over if `replica_2` is down.
- `ANY 1 (replica_2, replica_3)`: wait for whichever of them answers first (quorum).

### How "synchronous" is synchronous? (`synchronous_commit`)

Once a synchronous standby exists, `synchronous_commit` controls what exactly the primary waits for:

| Value          | The client gets "committed" after...                                         |
| -------------- | ---------------------------------------------------------------------------- |
| `off`          | nothing. Not even the local disk flush (a crash can lose recent commits)     |
| `local`        | the primary flushed to its own disk. Standbys are ignored                    |
| `remote_write` | the standby received it, and handed it to its OS (not flushed to disk yet)   |
| `on` (default) | the standby flushed it to disk                                               |
| `remote_apply` | the standby replayed it, so **a read on that standby already sees the data** |

The nice part is that it can be set **per transaction**. So you can keep a fast default, and pay for durability only where it matters:

```sql
BEGIN;
SET LOCAL synchronous_commit = remote_apply;
INSERT INTO payments ...;
COMMIT;
```

### The 2 surprises of synchronous replication

1. **If the synchronous standby goes down, writes on the primary hang**. Not fail, hang. Every commit waits for a standby that isn't there. This is why you list at least 2 candidates (`FIRST 1 (a, b)` / `ANY 1 (a, b)`), or use a tool that removes the dead standby from the list automatically.
2. **The wait happens _after_ the local commit**. If you cancel a hanging commit (or your client times out), you get a warning, but **the transaction is already committed on the primary**. "My request timed out" does not mean "my write didn't happen".

## 5. Failover: promoting a replica

When the primary dies, a replica can become the new primary. Let's simulate it:

```bash
pg_ctl -D ~/pg-lab/primary stop
```

Promote the first replica:

```bash
psql -p 5434 -U postgres -c "SELECT pg_promote();"
# or: pg_ctl -D ~/pg-lab/replica promote
```

It now accepts writes:

```bash
psql -p 5434 -U postgres -c "INSERT INTO products (name) VALUES ('after failover');"
psql -p 5434 -U postgres -c "SELECT * FROM products;"
```

```
 id |      name
----+----------------
  1 | Keyboard
 34 | after failover
```

Notice `standby.signal` is gone from its data directory, and the id jumped from 1 to 34. **Sequences are replicated in batches of 32 values ahead**, so after a failover, ids skip a gap. That's harmless, but don't be surprised by it.

What the demo doesn't show is the hard part:

- **Split brain**: if the old primary wasn't really dead (just unreachable), you now have 2 primaries accepting different writes. Something must make sure the old one is fenced off.
- **Re-pointing everything**: the application, and the other replicas, must now connect to the new primary.
- **The old primary can't simply rejoin** as a replica, because its history diverged. You either re-clone it with `pg_basebackup`, or use `pg_rewind` to sync it back.

:::tip
**Don't build failover yourself in production**. Use a tool that does detection, promotion, and fencing: [Patroni](https://github.com/patroni/patroni) is the standard for self-hosted Postgres (and on Kubernetes, operators like [CloudNativePG](https://cloudnative-pg.io/) use the same ideas). Managed services (AWS RDS / Aurora, Google Cloud SQL, Azure, Neon, Supabase) do it for you, usually as a checkbox called "high availability" or "Multi-AZ".
:::

## 6. Using replicas from your application

Postgres doesn't route queries for you. **Your application (or a proxy) decides which server gets which query**.

### Option A: two connection pools

The simplest approach: one pool for writes, one for reads.

```ts
import { Pool } from 'pg';

const primary = new Pool({ connectionString: process.env.DATABASE_PRIMARY_URL });
const replicas = new Pool({ connectionString: process.env.DATABASE_REPLICA_URL });

// browsing products -> replica
const { rows: products } = await replicas.query('SELECT * FROM products WHERE category = $1', [category]);

// placing an order -> primary
await primary.query('INSERT INTO orders (customer_id, total) VALUES ($1, $2)', [customerId, total]);

// "show my order" right after placing it -> primary, because of replication lag
const { rows: orders } = await primary.query('SELECT * FROM orders WHERE customer_id = $1', [customerId]);
```

The last query is the **read-your-own-writes** problem from the [concept guide](../../../knowledge/how-to-scale-a-database.md#--a-replication-lag). Common strategies:

- Read from the primary for a few seconds after a user writes something.
- Read from the primary for anything that's about "my" data (my orders, my cart), and from replicas for shared data (product catalog).
- Use `synchronous_commit = remote_apply` for that write, so the replica is guaranteed to have it.

### Option B: let the driver pick (multi-host connection strings)

libpq-based drivers (`psql`, `pg` in Node, `psycopg`, and many others) accept **several hosts in one connection string**, and can pick based on the server's role:

```bash
# connect to whichever host is currently the primary
psql "postgresql://app@db1:5432,db2:5432,db3:5432/store?target_session_attrs=read-write"

# prefer a standby for reads, spread across them randomly (Postgres 16+ client)
psql "postgresql://app@db1:5432,db2:5432,db3:5432/store?target_session_attrs=prefer-standby&load_balance_hosts=random"
```

`target_session_attrs` accepts `any`, `read-write`, `read-only`, `primary`, `standby`, and `prefer-standby`. After a failover, a new connection with `read-write` automatically finds the new primary.

### Option C: a proxy

Tools like [Pgpool-II](https://www.pgpool.net/) or HAProxy sit in front of the servers. The application sees one address, and the proxy routes connections. Managed services usually give you a "writer endpoint" and a "reader endpoint" that do the same.

### Gotcha: long queries on a replica get cancelled

If a long report runs on a replica, while the primary deletes rows that report is reading (e.g. vacuum cleans them up), the replica has to choose between pausing replication and killing your query. After `max_standby_streaming_delay` (default 30s), it kills the query:

> _ERROR: canceling statement due to conflict with recovery_

Two fixes:

- `hot_standby_feedback = on` on the replica: the replica tells the primary which rows it still needs, so they're not cleaned up. The cost is some extra bloat on the primary.
- A dedicated replica for long analytics queries, with a larger `max_standby_streaming_delay`. That replica will lag more, and that's fine for reports.

## 7. Logical replication

Physical replication copies the whole server, and the copy is read-only. **Logical replication copies chosen tables, and the target stays a normal, writable database**. Typical uses:

- **Upgrading to a new major version** with almost no downtime (physical replication only works between servers of the same major version).
- Sending a few tables to an analytics database, or to another service.
- Consolidating several databases into one.

It requires `wal_level = logical` on the source, which needs a restart:

```bash
echo "wal_level = logical" >> ~/pg-lab/replica/postgresql.conf
pg_ctl -D ~/pg-lab/replica -l ~/pg-lab/replica.log -o "-p 5434" restart
```

On the source (the **publisher**), declare what to publish:

```sql
CREATE PUBLICATION products_pub FOR TABLE products;
-- or: CREATE PUBLICATION all_pub FOR ALL TABLES;
```

Create a third server to be the **subscriber**:

```bash
initdb -D ~/pg-lab/subscriber -U postgres --auth-local=trust --auth-host=scram-sha-256
pg_ctl -D ~/pg-lab/subscriber -l ~/pg-lab/subscriber.log -o "-p 5436" start
```

**Logical replication doesn't copy the schema**, so create the table on the subscriber first, then subscribe:

```sql
-- psql -p 5436 -U postgres
CREATE TABLE products (id serial PRIMARY KEY, name text);

CREATE SUBSCRIPTION products_sub
  CONNECTION 'host=127.0.0.1 port=5434 user=replicator password=replicator_pass dbname=postgres'
  PUBLICATION products_pub;
```

:::info
For the subscription's initial table copy, the `replicator` user needs read access to the table on the publisher: `GRANT SELECT ON products TO replicator;`
:::

The existing rows are copied, and from now on, every insert/update/delete on the publisher's `products` shows up on the subscriber.

Things logical replication does **not** do:

- **No DDL**: `ALTER TABLE` on the publisher is not replicated. Apply schema changes on the subscriber yourself (usually first).
- **No sequences**: the subscriber's `products_id_seq` is still at 1. Try inserting on the subscriber, and you'll get `duplicate key value violates unique constraint "products_pkey"`. When switching over (e.g. after an upgrade), you must bump the sequences with `setval`.
- **Tables need a primary key** (or a `REPLICA IDENTITY`) to replicate updates and deletes.

## 8. Cleaning up the lab

```bash
for d in primary replica replica2 subscriber; do pg_ctl -D ~/pg-lab/$d stop 2>/dev/null; done
rm -rf ~/pg-lab
```

## 9. Summary

- A Postgres replica is a server that **replays the primary's WAL**. Create one with `pg_basebackup -R`, start it, done.
- Watch `pg_stat_replication` for lag, and **watch replication slots for retained WAL**. Cap it with `max_slot_wal_keep_size`.
- Replication is **async by default**. Synchronous replication protects against data loss on failover, at the cost of latency, and of writes hanging if no synchronous standby is available.
- Promotion is one command, but **real failover needs a tool** (Patroni) or a managed service.
- **Your app routes the queries**. Send writes, and reads that must be fresh, to the primary.
- **Logical replication** is for copying specific tables to a writable database, and for major version upgrades.
