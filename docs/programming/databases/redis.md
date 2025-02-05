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

#### SCAN with a COUNT option

SCAN also comes with a COUNT option, which can be used like so:

```bash
SCAN COUNT 20
```

This is used to specify a count to override the default COUNT which is set to 10 result per iteration. COUNT can be changed from one iteration to the next.

So continuing the example from before, if I now do:

```bash
SCAN 0 COUNT 3
```

And an example output is:

```
1) "4"
2) 1) "key11"
    2) "key10"
    3) "key9"
```

#### SCAN with a MATCH option

SCAN also has a MATCH option. This will iterate elements that match a specific pattern.

So in this example here:

```bash
SCAN 0 MATCH something
```

We're saying "match the word `something`".
We don't have to be specific, and can also use expressions like this:

```bash
SCAN 0 MATCH k*
```

Gets everything that starts with the letter k.

#### SCAN with other DATA TYPES

SCAN is also available with other data-types.
The full list of SCANs available to use is:

- `SSCAN` - Used with sets. Returns list of set members.
- `HSCAN` - Used with hashes. Returns array of elements with a field and value.
- `ZSCAN` - Used with sorted sets. Returns array of elements with associated score.

<br/>

### - Command 4: KEYS

#### Syntax

```bash
KEYS som*Pattern
```

`KEYS` will return all keys & values that match a specific pattern.

:::danger
Note that it **SHOULD BE AVOIDED IN PRODUCTION ENVIRONMENTS!!!** Because it returns everything at once, and it can be very taxing on the system. It should only be used in development.
:::

<br/>

### - Command 5: SET

#### Syntax

```bash
SET foo-key 42
```

#### Description

Set key to hold a string value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful SET operation.

Upon successful set, returns:

```
"OK"
```

The `SET` command supports a set of options that modify its behavior:

- `EX` seconds -- Set the specified expire time, in seconds (a positive integer). An error is returned when seconds is invalid.
- `PX` milliseconds -- Set the specified expire time, in milliseconds (a positive integer).
- `EXAT` timestamp-seconds -- Set the specified Unix time at which the key will expire, in seconds (a positive integer).
- `PXAT` timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds (a positive integer).
- `NX` -- Only set the key if it does not already exist.
- `XX` -- Only set the key if it already exists.
- `KEEPTTL` -- Retain the time to live associated with the key.
- `GET` -- Return the old string stored at key, or nil if key did not exist. An error is returned and SET aborted if the value stored at key is not a string.

Complex example:

```bash
SET some-key "this value will expire in a minute" EX 60
```

:::warning
Note: Since the SET command options can replace `SETNX`, `SETEX`, `PSETEX`, `GETSET`, it is possible that in future versions of Redis these commands will be deprecated and finally removed.
:::

<br/>

### - Command 6: EXISTS

#### Syntax

```bash
EXISTS key [key ...]
```

#### Description

Returns 1 if a key (keys) exists. Returns 0 if does not exist.  
Can be used on multiple keys at once.
When querying multiple keys, the return integer specifies the number of keys that exist from those specified as arguments.

<br/>

### - Command 7: GET

#### Syntax

```bash
GET key
```

#### Description

Get the value of key. If the key does not exist the special value `nil` is returned.

An **error is returned if the value** stored at key **is not a string**, because `GET` **only handles string values**.

<br/>

### - Command 7: GETEX

#### Syntax

```bash
GETEX key [EX seconds | PX milliseconds | EXAT unix-time-seconds |
  PXAT unix-time-milliseconds | PERSIST]
```

#### Description

Get the value of key and optionally set its expiration. GETEX is similar to GET, but is a write command with additional options.

The `GETEX` command supports a set of options that modify its behavior:

- `EX` _seconds_ -- Set the specified expire time, in seconds.
- `PX` _milliseconds_ -- Set the specified expire time, in milliseconds.
- `EXAT` _timestamp-seconds_ -- Set the specified Unix time at which the key will expire, in seconds.
- `PXAT` _timestamp-milliseconds_ -- Set the specified Unix time at which the key will expire, in milliseconds.
- `PERSIST` -- Remove the time to live associated with the key.

Examples:

```bash
redis> SET mykey "Hello"
"OK"
redis> GETEX mykey
"Hello"
redis> TTL mykey
(integer) -1
redis> GETEX mykey EX 60
"Hello"
redis> TTL mykey
(integer) 60
redis>
```

<br/>

### - Command 8: TTL

#### Syntax

```bash
TTL key
```

#### Description

Returns the remaining time to live of a key that has a timeout. This introspection capability allows a Redis client to check how many seconds a given key will continue to be part of the dataset.

In Redis 2.6 or older the command returns `-1` if the key does not exist or if the key exists but has no associated expire.

Starting with Redis 2.8 the return value in case of error changed:

- The command returns `-2` if the key does not exist.
- The command returns `-1` if the key exists but has no associated expire.

You also have the `PTTL` command that **returns the same information only in milliseconds** resolution (Only available in Redis 2.6 or greater).

### - Command 9: DEL

#### Syntax

```bash
DEL key [key ...]
```

#### Description

Removes the specified keys. A key is ignored if it does not exist.

Examples:

```bash
DEL no-exist-key
(integer) 0
> SET key1 "Hello"
"OK"
> SET key2 "World"
"OK"
> DEL key1 key2 key3
(integer) 2
```
