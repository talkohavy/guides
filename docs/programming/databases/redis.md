# Redis

<font size="5">Redis is NOT a database!</font>

## 1. Installing & running a Redis server

Run the following command:

```bash
docker run -d --name redis -p 6379:6379 redis
```

---

## 2. Connect to redis server

We now want to check that the installation worked.

We can check in 1 of 2 ways:

1. `exec` into the container, where you have `redis-cli` already installed.
2. install `redis-cli` locally on your machine and connect to the redis server from outside the container.

### - A. Test connectivity from inside the container

Run the following command:

```bash
docker exec -it redis redis-cli
```

You should see the following terminal being opened:

```
127.0.0.1:6379>
```

### - B. Test connectivity from localhost

There is no installation for `redis-cli` only.  
To this day, all we can do is:

```bash
brew install redis
```

which bundles together both `redis-server` (used to run the redis server itself), and `redis-cli`. You just don't run the redis server using the `redis-server` tool, and only use `redis-cli` to connect to our dockerized redis server.

```bash
redis-cli
```

The above command is flagless, which assumes you're running a redis server on localhost, on the default port of **6379**, with no authentication.

if you need a more detailed way, then:

```bash
redis-cli -h 127.0.0.1 -p 6379 -a pass123
```

The following also works:

```bash
redis-cli -u redis://username:password@host:port
redis-cli -u redis://host:port
```

Upon successful login you should see the following terminal being opened:

```
127.0.0.1:6379>
```

---

## 3. Redis Commands

### - Command 1: ping

#### Syntax

```bash
ping
```

#### Description

Simple ping request.

#### Example response:

```bash
PONG
```

<br/>

### - Command 2: FLUSHALL

#### Syntax

```bash
FLUSHALL
```

#### Description

Delete all the keys of all the existing databases, not just the currently selected one. This command never fails.

By default, `FLUSHALL` will synchronously flush all the databases. Starting with Redis 6.2, setting the `lazyfree-lazy-user-flush` configuration directive to "yes" changes the default flush mode to asynchronous.

It is possible to use one of the following modifiers to dictate the flushing mode explicitly:

- `ASYNC`: flushes the databases asynchronously
- `SYNC`: flushes the databases synchronously

```bash
FLUSHALL SYNC
```

:::info

- An asynchronous `FLUSHALL` command only deletes keys that were present at the time the command was invoked. Keys created during an asynchronous flush will be unaffected.
- This command does not delete functions.
- Other than emptying all databases (similar to FLUSHDB), this command clears the RDB persistence file, aborts any snapshot that is in progress, and, if the save config is enabled, saves an empty RDB file.
  :::

<br/>

### - Command 3: SCAN

#### Syntax

```bash
SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]
```

#### Description

The `SCAN` command (and relatives `SSCAN`, `HSCAN` and `ZSCAN`) are used in order to incrementally iterate over a collection of elements.

- `SCAN` iterates the set of keys in the currently selected Redis database.
- `SSCAN` iterates elements of `Sets` types.
- `HSCAN` iterates fields of `Hash` types and their associated values.
- `ZSCAN` iterates elements of `Sorted Set` types and their associated scores.

Since these commands allow for **incremental iteration**, returning only a small number of elements per call, they can be used in production without the downside of commands like `KEYS` or `SMEMBERS` that may block the server for a long time (even several seconds) when called against big collections of keys or elements.

#### SCAN basic usage

An iteration starts when the cursor is set to 0:

```bash
> scan 0
1) "17"
2)  1) "key:12"
    2) "key:8"
    3) "key:4"
    4) "key:14"
    5) "key:16"
    6) "key:17"
    7) "key:15"
    8) "key:10"
    9) "key:3"
   10) "key:7"
   11) "key:1"
```

In NO. 2, we get back the results.  
In NO. 1, we get back the **cursor return value** to use as input in order to get the next batch.

```bash
> scan 17
1) "0"
2) 1) "key:5"
   2) "key:18"
   3) "key:0"
   4) "key:2"
   5) "key:19"
   6) "key:13"
   7) "key:6"
   8) "key:9"
   9) "key:11"
```

Since in the second call the returned cursor is 0, the server signaled to the caller that the iteration finished, and the **collection was completely explored**.

#### Example response:

```bash
PONG
```
