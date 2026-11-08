# Configuration

## 1. Introduction

Postgres ships with around 350 settings, and **the defaults are deliberately conservative**: they're chosen so that Postgres starts on any machine, including a tiny VM or a laptop. For example, the default `shared_buffers` (Postgres' main memory cache) is **128MB**, whether the server has 1GB of RAM or 256GB.

So if your production database runs on defaults, it's very likely using a fraction of the machine you're paying for.

The good news: **you don't need to understand all 350**. Around 20 settings make most of the difference, and that's what this page covers.

:::info
For local development, the defaults are fine. Everything here is about servers that do real work: production, staging, load tests.
:::

## 2. How configuration works

### Where the settings live

```sql
SHOW config_file;
```

Would output something like:

```
/opt/homebrew/var/postgresql@18/postgresql.conf
```

There are 2 files in the data directory:

- `postgresql.conf`: the main file, with every setting listed and commented out at its default.
- `postgresql.auto.conf`: written by `ALTER SYSTEM` (below). Don't edit it by hand. **It's read last, so it wins over `postgresql.conf`**.

### Reading a setting

```sql
SHOW shared_buffers;
```

Or, with more context:

```sql
SELECT name, setting, unit, context, source, pending_restart
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'max_connections');
```

```
      name       | setting | unit |  context   | source  | pending_restart
-----------------+---------+------+------------+---------+-----------------
 max_connections | 100     |      | postmaster | default | f
 shared_buffers  | 16384   | 8kB  | postmaster | default | f
 work_mem        | 4096    | kB   | user       | default | f
```

`setting` is shown in units of `unit`, so `shared_buffers = 16384 × 8kB = 128MB`.

**The `context` column tells you what it takes for a change to apply**:

| context              | To apply a change...                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `postmaster`         | **restart** the server                                                  |
| `sighup`             | **reload** the configuration (no downtime)                              |
| `superuser` / `user` | reload, or change it for a single session / role / database (see below) |

### Changing a setting

Either edit `postgresql.conf`, or use `ALTER SYSTEM` from SQL (which writes to `postgresql.auto.conf`):

```sql
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET shared_buffers = '4GB';

SELECT pg_reload_conf();
```

After a configuration reload, `work_mem` is applied. `shared_buffers` is not, since it needs a restart:

```sql
SELECT name, setting, pending_restart FROM pg_settings WHERE pending_restart;
```

```
      name      | setting | pending_restart
----------------+---------+-----------------
 shared_buffers | 16384   | t
```

Restart (with Homebrew: `brew services restart postgresql@18`), and it's applied.

If you edited the file by hand and something doesn't seem to apply, `pg_file_settings` shows what's in the files, whether it was applied, and any errors:

```sql
SELECT sourcefile, name, setting, applied, error FROM pg_file_settings;
```

### Settings per database, per role, per session

Settings with context `user` can be overridden at a narrower level, and **the narrowest one wins**:

```sql
ALTER DATABASE store SET work_mem = '32MB';           -- every connection to this database
ALTER ROLE reporting_user SET work_mem = '256MB';     -- every connection by this role
SET work_mem = '512MB';                               -- this session only

BEGIN;
SET LOCAL work_mem = '1GB';                           -- this transaction only
-- ... one heavy query ...
COMMIT;
```

This is extremely useful. You can keep safe server-wide values, and give more to the roles or queries that need it.

### In Docker and managed services

- **Docker**: pass settings as arguments to the `postgres` command.

  ```yaml
  services:
    db:
      image: postgres:18
      command: >
        postgres
        -c shared_buffers=4GB
        -c effective_cache_size=12GB
        -c work_mem=16MB
        -c shared_preload_libraries=pg_stat_statements
  ```

- **Managed services** (RDS, Cloud SQL, Azure, ...): you can't touch the files. Settings are changed through a **parameter group** / "database flags" in the console or Terraform. Many of the memory settings are already sized to the instance there, but the timeouts, logging, and autovacuum settings below are usually still at their defaults.

## 3. The settings that matter

Each section has a table with the default, and a reasonable starting point. The "starting point" column assumes a **dedicated database server, with SSD storage**. The example in [section 4](#4-example-a-4-vcpu--16gb-server) puts concrete numbers on it.

### Memory

| Setting                | Default | Starting point   | Applies on |
| ---------------------- | ------- | ---------------- | ---------- |
| `shared_buffers`       | 128MB   | 25% of RAM       | restart    |
| `effective_cache_size` | 4GB     | 50% - 75% of RAM | reload     |
| `work_mem`             | 4MB     | 16MB - 64MB      | reload     |
| `maintenance_work_mem` | 64MB    | 512MB - 2GB      | reload     |

**`shared_buffers`** is Postgres' own cache of table and index pages. More of your hot data in memory means fewer disk reads. Why not 80% of RAM? Because Postgres also relies on the operating system's file cache, and needs memory for connections and queries. 25% is the classic starting point. Going above 40% rarely helps.

**`effective_cache_size`** allocates nothing. It's a **hint to the query planner** about how much memory is available for caching overall (`shared_buffers` + the OS file cache). A low value makes the planner think data is probably on disk, so it avoids index scans. Set it to what's realistically available.

**`work_mem`** is the memory a query can use for **each sort or hash operation**, before spilling to temporary files on disk. Here's the catch: it's per operation, not per query, and not per server. A complex query can have several sorts and hashes, each using `work_mem` (hash operations can even use 2x, see `hash_mem_multiplier`), and there can be hundreds of connections. So:

```
worst case ≈ max_connections × (operations per query) × work_mem
```

That's why it's kept modest globally, and raised per role or per session for heavy reporting queries. To know if it's too low, enable `log_temp_files` (see [logging](#logging--observability)) and look for queries that spill to disk.

**`maintenance_work_mem`** is used by `VACUUM`, `CREATE INDEX`, and `ALTER TABLE ADD FOREIGN KEY`. These run rarely and one at a time, so they can get a lot more. A bigger value makes index builds and vacuums noticeably faster. Note that each autovacuum worker can use this much too (unless you set `autovacuum_work_mem` separately).

### Connections

| Setting            | Default   | Starting point                  | Applies on |
| ------------------ | --------- | ------------------------------- | ---------- |
| `max_connections`  | 100       | 100 - 300, plus a pooler        | restart    |
| `listen_addresses` | localhost | the server's private IP, or `*` | restart    |

**Every Postgres connection is a separate operating system process**, using memory even when idle. And the more active connections there are, the more they compete for CPU and locks. **Throughput usually peaks at a few times the number of CPU cores** in active connections, and goes _down_ after that.

So when the app needs more connections, the answer is not `max_connections = 2000`. It's a **connection pooler** like [PgBouncer](https://www.pgbouncer.org/), which lets thousands of client connections share a few dozen real ones. Most managed providers have one built in (e.g. RDS Proxy, Supabase's Supavisor).

**`listen_addresses`** defaults to `localhost`, so nothing outside the machine can connect. When your app runs on another machine, set it to the server's IP (or `*`, which means all interfaces), and control access with `pg_hba.conf` (see [Client Authentication](./client-authentication.md)).

### WAL & checkpoints

| Setting                        | Default | Starting point  | Applies on |
| ------------------------------ | ------- | --------------- | ---------- |
| `max_wal_size`                 | 1GB     | 4GB - 16GB      | reload     |
| `min_wal_size`                 | 80MB    | 1GB             | reload     |
| `checkpoint_timeout`           | 5min    | 15min           | reload     |
| `checkpoint_completion_target` | 0.9     | keep            | reload     |
| `wal_compression`              | off     | `lz4` or `zstd` | reload     |

Every change is first written to the WAL (see [Replication](./replication.md#1-how-replication-works-in-postgres)). Periodically, a **checkpoint** writes all the changed pages to the table files, so older WAL can be recycled. A checkpoint is triggered when `checkpoint_timeout` passes, or when `max_wal_size` worth of WAL has been written, whichever comes first.

With the default 1GB, a busy server hits `max_wal_size` every minute or so, so it's checkpointing constantly. That means a lot of extra disk writes, and also more WAL: **the first change to a page after each checkpoint writes the entire 8kB page to the WAL** (a "full-page write"), not just the changed bytes. If this is happening, the log says so:

> _LOG: checkpoints are occurring too frequently (23 seconds apart)_
> _HINT: Consider increasing the configuration parameter "max_wal_size"._

The goal is for checkpoints to be triggered by **time**, not by size. You can check which one is happening:

```sql
SELECT num_timed, num_requested FROM pg_stat_checkpointer;  -- Postgres 17+
```

`num_requested` growing much faster than `num_timed` means `max_wal_size` is too small.

The trade-off: after a crash, Postgres replays the WAL since the last checkpoint, so less frequent checkpoints mean longer crash recovery. With 15 minutes, that's usually a minute or two, which is fine.

**`wal_compression`** compresses those full-page writes. It costs a bit of CPU, and typically cuts WAL volume a lot. Less WAL also means less to ship to replicas, and smaller backups.

### Query planner & storage

| Setting                     | Default | Starting point | Applies on |
| --------------------------- | ------- | -------------- | ---------- |
| `random_page_cost`          | 4       | 1.1 (SSD)      | reload     |
| `effective_io_concurrency`  | 16      | 200 (SSD)      | reload     |
| `default_statistics_target` | 100     | keep           | reload     |

**`random_page_cost`** tells the planner how expensive a random disk read is, compared to a sequential one (`seq_page_cost = 1`). The default of 4 dates back to spinning disks, where random reads really were much slower. On SSDs they're nearly the same. **With the default, the planner overestimates the cost of index scans, and often chooses a sequential scan instead**. Setting it to 1.1 is one of the most impactful one-line changes on SSD-backed servers (which includes basically every cloud database).

**`effective_io_concurrency`** is how many disk reads Postgres may issue in parallel. SSDs handle many concurrent requests well. (Before Postgres 18, the default was 1, so on older versions, this matters even more.)

**`default_statistics_target`** controls how detailed the statistics are that `ANALYZE` collects. The default is fine. If one specific column gets bad estimates (look for row estimates way off in `EXPLAIN ANALYZE`), raise it for that column only:

```sql
ALTER TABLE orders ALTER COLUMN status SET STATISTICS 1000;
ANALYZE orders;
```

### Parallel queries

| Setting                            | Default | Starting point             | Applies on |
| ---------------------------------- | ------- | -------------------------- | ---------- |
| `max_worker_processes`             | 8       | number of CPU cores        | restart    |
| `max_parallel_workers`             | 8       | number of CPU cores        | reload     |
| `max_parallel_workers_per_gather`  | 2       | 2 - 4 (half the cores max) | reload     |
| `max_parallel_maintenance_workers` | 2       | 2 - 4                      | reload     |

Postgres can split a single big query (a large sequential scan, aggregate, or join) across several worker processes.

- `max_worker_processes`: the total pool of background processes (parallel workers, logical replication workers, extensions all take from it).
- `max_parallel_workers`: how many of those can be used for parallel queries at once.
- `max_parallel_workers_per_gather`: how many workers **a single query** can use.
- `max_parallel_maintenance_workers`: the same, for `CREATE INDEX` and `VACUUM`.

For an app doing many small queries (typical web backend), parallelism barely matters, and the defaults are fine. For analytics or reporting, raise them, but remember that 10 concurrent reports × 4 workers each = 40 processes competing for the CPU.

### Autovacuum

| Setting                          | Default | Starting point                   | Applies on |
| -------------------------------- | ------- | -------------------------------- | ---------- |
| `autovacuum`                     | on      | **never turn it off**            | reload     |
| `autovacuum_max_workers`         | 3       | 3 - 6                            | reload\*   |
| `autovacuum_vacuum_scale_factor` | 0.2     | 0.05 (and lower for huge tables) | reload     |
| `autovacuum_vacuum_cost_limit`   | -1      | 1000 - 2000                      | reload     |

\* `autovacuum_max_workers` needed a restart before Postgres 18.

When you `UPDATE` or `DELETE` a row in Postgres, the old version isn't removed immediately (other transactions might still need to see it). It stays as a **dead row** until **VACUUM** cleans it up. If dead rows pile up faster than vacuum cleans them, tables and indexes **bloat** (grow full of garbage), and queries get slower. Autovacuum is the background process that does this automatically.

**`autovacuum_vacuum_scale_factor`**: a table is vacuumed once dead rows exceed 20% of it (plus a small threshold). For a 1,000-row table, that's fine. For a 500-million-row `orders` table, that's **100 million dead rows** before vacuum even starts, and then it has a huge job to do. Lower it globally, and for the biggest tables, set it per table:

```sql
ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_analyze_scale_factor = 0.01);
```

(Postgres 18 also added `autovacuum_vacuum_max_threshold`, which caps the threshold at 100 million dead rows by default. Before 18, there was no cap.)

**`autovacuum_vacuum_cost_limit`**: autovacuum deliberately throttles itself, so it doesn't hurt your queries. `-1` means "use `vacuum_cost_limit`", which is 200. That throttle was designed for old spinning disks, and on SSDs, it's often so slow that vacuum falls behind on busy tables. Raising it to 1000-2000 lets each worker do several times more work. Note that the limit is **shared** between all running workers, so if you add workers, raise the limit too.

**`autovacuum_max_workers`**: how many tables can be vacuumed at the same time. With many busy tables, 3 can be too few.

### Timeouts

| Setting                               | Default      | Starting point                 |
| ------------------------------------- | ------------ | ------------------------------ |
| `statement_timeout`                   | 0 (no limit) | 30s - 60s **for the app role** |
| `idle_in_transaction_session_timeout` | 0 (no limit) | 1min - 5min                    |
| `lock_timeout`                        | 0 (no limit) | 5s - 10s **in migrations**     |
| `transaction_timeout`                 | 0 (no limit) | optional (Postgres 17+)        |

These aren't about speed. **They're about one bad query or one buggy client not taking down everything else**. All of them apply on reload, and all can be set per role.

**`statement_timeout`**: cancels any query running longer than this. Without it, a runaway query (a missing `WHERE`, an accidental cross join) runs for hours. **Set it on the application's role, not globally**, because migrations, `CREATE INDEX`, and manual maintenance legitimately take longer:

```sql
ALTER ROLE app_user SET statement_timeout = '30s';
```

**`idle_in_transaction_session_timeout`**: kills sessions that did `BEGIN`, and then went quiet (an app crashed mid-transaction, or someone left a `psql` session open with a transaction). Such a session keeps its locks, and **blocks vacuum from cleaning any rows newer than its transaction, in all tables**. This one is safe to set globally.

**`lock_timeout`**: how long a statement waits to acquire a lock, before giving up. This matters most for **migrations**. An `ALTER TABLE` needs an exclusive lock. If a long query holds a conflicting lock, the `ALTER TABLE` waits, and **every new query on that table queues up behind the `ALTER TABLE`**. A tiny migration can take your app down this way. With `SET lock_timeout = '5s'` at the top of your migration, it fails fast instead, and you can retry.

### Logging & observability

| Setting                       | Default | Starting point       | Applies on |
| ----------------------------- | ------- | -------------------- | ---------- |
| `shared_preload_libraries`    | (empty) | `pg_stat_statements` | restart    |
| `log_min_duration_statement`  | -1      | 250ms - 1s           | reload     |
| `log_lock_waits`              | off     | on                   | reload     |
| `log_temp_files`              | -1      | 0                    | reload     |
| `log_autovacuum_min_duration` | 10min   | 10s                  | reload     |
| `track_io_timing`             | off     | on                   | reload     |

**`pg_stat_statements`** is the single most useful extension for performance work. It records statistics for every distinct query: how many times it ran, total and average time, rows returned. Load it at startup, then enable it in the database:

```sql
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
-- restart the server, then:
CREATE EXTENSION pg_stat_statements;
```

Then ask "which queries take the most total time?":

```sql
SELECT calls,
       round(total_exec_time::numeric) AS total_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms,
       rows,
       left(query, 80) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

The top of this list is where optimization pays off. Often it's not the slowest query, but a fast one that runs a million times.

The rest:

- **`log_min_duration_statement`**: logs every query that takes longer than this, with its duration. Your slow query log.
- **`log_lock_waits`**: logs when a query waits for a lock longer than `deadlock_timeout` (1s). Explains "random" slowness.
- **`log_temp_files = 0`**: logs every query that spills to disk because it ran out of `work_mem`. This is how you know if `work_mem` is too small.
- **`log_autovacuum_min_duration`**: logs autovacuum runs that take longer than this, so you can see which tables keep it busy.
- **`track_io_timing`**: records time spent on disk I/O, shown in `EXPLAIN (ANALYZE, BUFFERS)` and `pg_stat_statements`. Cheap on modern hardware.

`log_checkpoints` is also useful, and is already on by default since Postgres 15.

### Replication

If you use replicas, 2 settings deserve attention (explained in the [Replication](./replication.md) guide):

- **`max_slot_wal_keep_size`** (default `-1`, unlimited): cap the WAL that replication slots can hold, so a dead replica can't fill the primary's disk.
- **`hot_standby_feedback`** (default `off`, set on the replica): avoids long queries on replicas being cancelled, at the cost of some extra bloat on the primary.

## 4. Example: a 4 vCPU / 16GB server

A dedicated database server with SSD storage, running a typical web application:

```bash
# Memory
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 16MB
maintenance_work_mem = 1GB

# Connections (use PgBouncer in front for more clients)
max_connections = 200
listen_addresses = '*'                # access is controlled by pg_hba.conf

# WAL & checkpoints
max_wal_size = 8GB
min_wal_size = 1GB
checkpoint_timeout = 15min
wal_compression = lz4

# Planner (SSD)
random_page_cost = 1.1
effective_io_concurrency = 200

# Parallelism
max_worker_processes = 4
max_parallel_workers = 4
max_parallel_workers_per_gather = 2
max_parallel_maintenance_workers = 2

# Autovacuum
autovacuum_max_workers = 4
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_scale_factor = 0.02
autovacuum_vacuum_cost_limit = 1000

# Timeouts (statement_timeout is set on the app role instead)
idle_in_transaction_session_timeout = '5min'

# Observability
shared_preload_libraries = 'pg_stat_statements'
log_min_duration_statement = 500ms
log_lock_waits = on
log_temp_files = 0
log_autovacuum_min_duration = 10s
track_io_timing = on
```

And for the application role:

```sql
ALTER ROLE app_user SET statement_timeout = '30s';
```

:::tip
[PGTune](https://pgtune.leopard.in.ua/) generates a similar starting config from your RAM, CPU count, storage type, and workload. It's a good sanity check.
:::

## 5. Verifying it helped

Configuration is a starting point. Measure, then adjust:

```sql
-- Cache hit ratio: for a typical web app, should be above 99%
SELECT round(100.0 * sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0), 2) AS cache_hit_pct
FROM pg_statio_user_tables;

-- Temporary files: a lot of temp_bytes means work_mem is too small for your queries
SELECT datname, temp_files, pg_size_pretty(temp_bytes) AS temp_size FROM pg_stat_database;

-- Checkpoints: num_requested should be small compared to num_timed (Postgres 17+)
SELECT num_timed, num_requested FROM pg_stat_checkpointer;
```

And the top of `pg_stat_statements` tells you where the time actually goes.

## 6. Summary

- The defaults are made to **start anywhere**, not to run well on your server.
- Check `context` in `pg_settings` to know if a change needs a **restart** or just a **reload**.
- Settings can be set **per database, per role, per session, and per transaction**. Use that instead of risky global values.
- The biggest wins, usually: `shared_buffers`, `effective_cache_size`, `random_page_cost`, `max_wal_size`, autovacuum tuning, timeouts, and `pg_stat_statements`.
- Don't solve connection counts with `max_connections`. **Use a pooler**.
