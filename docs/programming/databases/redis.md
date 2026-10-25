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

Immediately after installing `redis`, I saw that it ran the server automatically. But we want the docker one, so we'll need to stop the `redis-server`:

```bash
brew services stop redis
```

Now that the redis server on our localhost stopped, and the redis server on our docker runs, let's connect to it:

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

**Syntax**

```bash
ping
```

**Description**

Simple ping request.

**Example response**

```bash
PONG
```

<br/>

### - Command 2: FLUSHALL

**Syntax**

```bash
FLUSHALL
```

**Description**

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

**Syntax**

```bash
SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]
```

**Description**

The `SCAN` command (and relatives `SSCAN`, `HSCAN` and `ZSCAN`) are used in order to incrementally iterate over a collection of elements.

- `SCAN` iterates the set of keys in the currently selected Redis database.
- `SSCAN` iterates elements of `Sets` types.
- `HSCAN` iterates fields of `Hash` types and their associated values.
- `ZSCAN` iterates elements of `Sorted Set` types and their associated scores.

Since these commands allow for **incremental iteration**, returning only a small number of elements per call, they can be used in production without the downside of commands like `KEYS` or `SMEMBERS` that may block the server for a long time (even several seconds) when called against big collections of keys or elements.

**SCAN basic usage**

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

**SCAN with a COUNT option**

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

**SCAN with a MATCH option**

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

**SCAN with other DATA TYPES**

SCAN is also available with other data-types.
The full list of SCANs available to use is:

- `SSCAN` - Used with sets. Returns list of set members.
- `HSCAN` - Used with hashes. Returns array of elements with a field and value.
- `ZSCAN` - Used with sorted sets. Returns array of elements with associated score.

<br/>

### - Command 4: KEYS

**Syntax**

```bash
KEYS som*Pattern
```

`KEYS` will return all keys & values that match a specific pattern.

:::danger
Note that it **SHOULD BE AVOIDED IN PRODUCTION ENVIRONMENTS!!!** Because it returns everything at once, and it can be very taxing on the system. It should only be used in development.
:::

<br/>

### - Command 5: SET

**Syntax**

```bash
SET foo-key 42
```

**Description**

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

**Syntax**

```bash
EXISTS key [key ...]
```

**Description**

Returns 1 if a key (keys) exists. Returns 0 if does not exist.  
Can be used on multiple keys at once.
When querying multiple keys, the return integer specifies the number of keys that exist from those specified as arguments.

<br/>

### - Command 7: GET

**Syntax**

```bash
GET key
```

**Description**

Get the value of key. If the key does not exist the special value `nil` is returned.

An **error is returned if the value** stored at key **is not a string**, because `GET` **only handles string values**.

<br/>

### - Command 7: GETEX

**Syntax**

```bash
GETEX key [EX seconds | PX milliseconds | EXAT unix-time-seconds |
  PXAT unix-time-milliseconds | PERSIST]
```

**Description**

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

**Syntax**

```bash
TTL key
```

**Description**

Returns the remaining time to live of a key that has a timeout. This introspection capability allows a Redis client to check how many seconds a given key will continue to be part of the dataset.

In Redis 2.6 or older the command returns `-1` if the key does not exist or if the key exists but has no associated expire.

Starting with Redis 2.8 the return value in case of error changed:

- The command returns `-2` if the key does not exist.
- The command returns `-1` if the key exists but has no associated expire.

You also have the `PTTL` command that **returns the same information only in milliseconds** resolution (Only available in Redis 2.6 or greater).

### - Command 9: DEL

**Syntax**

```bash
DEL key [key ...]
```

**Description**

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

<br/>

### - Command 10: TYPE

**Syntax**

```bash
TYPE key
```

**Description**

Returns the string representation of the type of value stored at `key`.  
Use this when you discover a key via `KEYS *` or `SCAN`, and don't know its type.

Returns `none` if the key does not exist.

| Type stored at key | `TYPE` returns | Commands to read it              |
| ------------------ | -------------- | -------------------------------- |
| String             | `string`       | `GET`, `MGET`                    |
| Hash               | `hash`         | `HGET`, `HSCAN`                  |
| Set                | `set`          | `SMEMBERS`, `SSCAN`, `SISMEMBER` |
| List               | `list`         | `LRANGE`, `LINDEX`, `LPOP`       |
| Sorted Set         | `zset`         | `ZRANGE`, `ZSCORE`, `ZRANK`      |
| Stream             | `stream`       | `XREAD`, `XRANGE`                |
| Key does not exist | `none`         | —                                |

Examples:

```bash
> SET mystring "hello"
"OK"
> TYPE mystring
"string"

> HSET myhash field1 "value1"
(integer) 1
> TYPE myhash
"hash"

> SADD myset "one" "two"
(integer) 2
> TYPE myset
"set"

> TYPE nonexistent
"none"
```

---

## 4. Redis Hashes

A **Redis Hash** is a map of field-value pairs stored under a single key. Think of it like an object: `user:1000` holds `username`, `email`, `age`—each field has a name and a value. Commands like `HSET`, `HGET`, and `HGETALL` work with this structure. The `TYPE` command returns **`"hash"`** for keys holding a Hash.

**Hashes vs Sets:** A **Hash** stores named fields with values (e.g., `username` → `"Tal Kohavy"`). A **Set** stores an unordered collection of unique strings with no field names—just members (e.g., `"one"`, `"two"`, `"three"`). Use Hashes for objects/records; use Sets for membership lists, tags, or unique items.

<br/>

### - Command 11: HSET

**Syntax**

```bash
HSET key field value [field value ...]
```

**Description**

Sets the specified fields to their respective values in the hash stored at key. This command overwrites the values of specified fields that already exist in the hash. If key doesn't exist, a new key holding a hash is created.

The command can set multiple field-value pairs at once. The return value is the number of fields that were added to the hash (not including updates to existing fields).

Benefit - instead of going roundtrip n times, you can in one trip set many key-value pairs.

Examples:

```bash
> HSET user:1000 username antirez email john@example.com age 30
(integer) 3
> HGET user:1000 username
"antirez"
> HGETALL user:1000
1) "username"
2) "antirez"
3) "email"
4) "john@example.com"
5) "age"
6) "30"
```

<br/>

### - Command 12: HGET

**Syntax**

```bash
HGET key field
```

**Description**

Returns the value associated with field in the hash stored at key. If the field doesn't exist in the hash, or if the key doesn't exist, the command returns `nil`.

Unlike `HSET` which can set multiple fields at once, `HGET` retrieves the value of only one specific field from a hash. If you need to get multiple fields, use `HMGET` for multiple specific fields or `HGETALL` to get all fields and their values.

**Use Cases:**

- Retrieve a specific piece of information from a hash (e.g., just the username from a user profile)
- Check if a particular field exists in a hash
- Access individual properties of complex data structures stored as Redis hashes

Examples:

```bash
> HSET user:1000 username antirez email john@example.com age 30
(integer) 3
> HGET user:1000 username
"antirez"
> HGET user:1000 email
"john@example.com"
> HGET user:1000 nonexistent
(nil)
> HGET nonexistent:key username
(nil)
```

<br/>

### - Command 13: HGETALL

**Syntax**

```bash
HGETALL key
```

**Description**

Returns all fields and values of the hash stored at key. In the returned value, every field name is followed by its value, so the length of the reply is twice the size of the hash.

If the key doesn't exist, the command returns an empty list. This command is useful when you need to retrieve all the data from a hash at once, but be careful with large hashes as it can be memory intensive.

**Use Cases:**

- Retrieve complete user profiles or configuration objects
- Debug or inspect the entire contents of a hash
- Export all data from a hash structure
- Check what fields exist in a hash

**Performance Note:**
For large hashes, consider using `HSCAN` instead of `HGETALL` to avoid blocking the Redis server.

Examples:

```bash
> HSET user:1000 username antirez email john@example.com age 30 country USA
(integer) 4
> HGETALL user:1000
1) "username"
2) "antirez"
3) "email"
4) "john@example.com"
5) "age"
6) "30"
7) "country"
8) "USA"
> HGETALL nonexistent:key
(empty array)
```

<br/>

### - Command 14: HSCAN

**Syntax**

```bash
HSCAN key cursor [MATCH pattern] [COUNT count]
```

**Description**

Incrementally iterates over the fields and values of a hash stored at key. This command is the hash-specific version of the `SCAN` command and is designed to handle large hashes without blocking the Redis server.

The `HSCAN` command returns:

1. A new cursor value (to be used in the next call)
2. An array of field-value pairs from the hash

Like `SCAN`, the iteration starts with cursor 0 and ends when the returned cursor is 0.

**Options:**

- `MATCH pattern` - Only return fields that match the given pattern (supports glob-style patterns)
- `COUNT count` - Hint about how many elements to return per call (default is usually around 10)

**Use Cases:**

- Safely iterate through large hashes in production
- Search for specific fields in a hash using pattern matching
- Process hash data in chunks to avoid memory issues
- Inspect hash contents without risking server blocking

**When to use HSCAN vs HGETALL:**

- Use `HSCAN` for large hashes (>1000 fields) or in production environments
- Use `HGETALL` for small hashes or development/debugging

Examples:

```bash
> HSET user:1000 username antirez email john@example.com age 30 country USA city SF phone 555-1234
(integer) 6
> HSCAN user:1000 0
1) "0"
2) 1) "username"
   2) "antirez"
   3) "email"
   4) "john@example.com"
   5) "age"
   6) "30"
   7) "country"
   8) "USA"
   9) "city"
  10) "SF"
  11) "phone"
  12) "555-1234"
> HSCAN user:1000 0 MATCH *e*
1) "0"
2) 1) "username"
   2) "antirez"
   3) "email"
   4) "john@example.com"
   5) "phone"
   6) "555-1234"
> HSCAN user:1000 0 COUNT 2
1) "0"
2) 1) "username"
   2) "antirez"
   3) "email"
   4) "john@example.com"
```

---

## 5. Redis Sets

A **Redis Set** is an unordered collection of unique strings. No duplicate members are allowed. Sets are useful for membership tracking, tags, unique visitors, and more. The `TYPE` command returns **`"set"`** for keys holding a Set.

<br/>

### - Command 15: SMEMBERS

**Syntax**

```bash
SMEMBERS key
```

**Description**

Returns all members of the set stored at key. The order of elements is not guaranteed—Redis sets are unordered.

If the key does not exist, an empty array is returned. If the key holds a value that is not a set, an error is returned.

**Time complexity:** O(N) where N is the number of members in the set

**Use Cases:**

- Retrieve all members of a set (tags, group members, IDs)
- Inspect or export the contents of a set
- Display all items in a collection

Examples:

```bash
> SADD myset "one" "two" "three" "four"
(integer) 4
> SMEMBERS myset
1) "one"
2) "two"
3) "three"
4) "four"
> SMEMBERS nonexistent
(empty array)
```

:::warning
For large sets in production, consider using `SSCAN` instead of `SMEMBERS` to avoid blocking the server. `SMEMBERS` returns the entire set at once, which can be slow for big collections.
:::

<br/>

### - Command 16: SSCAN

**Syntax**

```bash
SSCAN key cursor [MATCH pattern] [COUNT count]
```

**Description**

Incrementally iterates over the members of the set stored at key. This command is the set-specific version of `SCAN` and is designed to handle large sets without blocking the Redis server.

The `SSCAN` command returns:

1. A new cursor value (to be used in the next call)
2. An array of set members

Like `SCAN`, the iteration starts with cursor 0 and ends when the returned cursor is 0.

**Options:**

- `MATCH pattern` - Only return members that match the given pattern (supports glob-style patterns, e.g., `user:*`)
- `COUNT count` - Hint about how many elements to return per call (default is usually around 10)

**Time complexity:** O(1) for every call. O(N) for a complete iteration, where N is the number of members in the set

**Use Cases:**

- Safely iterate through large sets in production
- Search for specific members using pattern matching
- Process set data in chunks to avoid memory issues
- Alternative to `SMEMBERS` when the set is large

**When to use SSCAN vs SMEMBERS:**

- Use `SSCAN` for large sets (>1000 members) or in production environments
- Use `SMEMBERS` for small sets or development/debugging

Examples:

```bash
> SADD myset "one" "two" "three" "four" "five"
(integer) 5
> SSCAN myset 0
1) "0"
2) 1) "one"
   2) "two"
   3) "three"
   4) "four"
   5) "five"
> SSCAN myset 0 MATCH t*
1) "0"
2) 1) "two"
   2) "three"
> SSCAN myset 0 COUNT 2
1) "0"
2) 1) "one"
   2) "two"
```

<br/>

### - Command 17: SADD

**Syntax**

```bash
SADD key member [member ...]
```

**Description**

Adds one or more members to the set stored at key. If the key does not exist, a new set is created before adding the members. If the key exists but holds a value that is not a set, an error is returned.

Duplicate members are ignored—Redis sets only store unique values. The return value is the number of members that were **added** to the set (not including duplicates that were already present).

**Time complexity:** O(1) per member added

**Use Cases:**

- Create a set and add members in one command
- Build collections of tags, categories, or IDs
- Track unique users, items, or events
- Store group memberships or permissions

Examples:

```bash
> SADD myset "one" "two" "three"
(integer) 3
> SADD myset "one" "four"
(integer) 1
> SADD myset "five"
(integer) 1
```

In the first `SADD`, we create the set and add three members. In the second, `"one"` is already in the set so it's ignored; only `"four"` is added. The third adds `"five"`.

<br/>

### - Command 18: SREM

**Syntax**

```bash
SREM key member [member ...]
```

**Description**

Removes the specified members from the set stored at key. Members that do not exist in the set are ignored. If the key does not exist, it is treated as an empty set and the command returns 0.

The return value is the number of members that were **removed** from the set (not including non-existing members).

**Time complexity:** O(1) per member removed

**Use Cases:**

- Remove a user from a group
- Revoke permissions or tags
- Maintain a dynamic list of unique items

Examples:

```bash
> SADD myset "one" "two" "three" "four"
(integer) 4
> SREM myset "two" "four"
(integer) 2
> SREM myset "nonexistent"
(integer) 0
```

<br/>

### - Command 19: SISMEMBER

**Syntax**

```bash
SISMEMBER key member
```

**Description**

Determines whether a member belongs to the set stored at key. Returns `1` if the element is a member of the set, or `0` if the element is not a member of the set, or when the key does not exist.

**Time complexity:** O(1)

**Use Cases:**

- Check if a user is in a group or has a specific permission
- Verify membership before performing set operations
- Data deduplication checks
- Rate limiting or feature flag lookups

Examples:

```bash
> SADD myset "one" "two" "three"
(integer) 3
> SISMEMBER myset "one"
(integer) 1
> SISMEMBER myset "two"
(integer) 1
> SISMEMBER myset "four"
(integer) 0
> SISMEMBER nonexistent "one"
(integer) 0
```

:::info
For checking multiple members at once, use `SMISMEMBER` (available since Redis 6.2).
:::

<br/>

### - Command 20: SCARD

**Syntax**

```bash
SCARD key
```

**Description**

Returns the number of members (cardinality) of the set stored at key. If the key does not exist, `0` is returned. If the key exists but holds a value that is not a set, an error is returned.

**Time complexity:** O(1)

**Use Cases:**

- Get the size of a set (e.g., number of unique visitors, tags, or group members)
- Check if a set is empty before processing
- Display counts or statistics

Examples:

```bash
> SADD myset "one" "two" "three"
(integer) 3
> SCARD myset
(integer) 3
> SADD myset "four"
(integer) 1
> SCARD myset
(integer) 4
> SCARD nonexistent
(integer) 0
```

---

## 6. Redis Sorted Sets (ZSET)

A **Redis Sorted Set** is a collection of unique string members, where every member is associated with a **score** (a floating-point number). Members are always kept ordered by their score, from lowest to highest. The `TYPE` command returns **`"zset"`** for keys holding a Sorted Set.

**Sets vs Sorted Sets:** Like a **Set**, a **Sorted Set** only holds unique members. The difference is that a Set is unordered, while a Sorted Set gives every member a score and keeps them sorted by it. This lets you ask questions like "who are the top 10?", "what is the rank of X?" or "give me everything with a score between 50 and 100", all of them fast.

**How ordering works:**

- Members are sorted by score, in ascending order.
- If two members have the **same score**, they are sorted lexicographically (alphabetically) by the member string.
- The same member can't appear twice. Adding an existing member again just updates its score.

**Common use cases:**

- Leaderboards (score = points)
- Priority queues (score = priority)
- Time-ordered data, like recent activity or scheduled jobs (score = Unix timestamp)
- Rate limiting with a sliding window (score = request timestamp)

**Time complexity: Sets vs Sorted Sets**

Keeping members sorted has a cost. Most write operations on a Set are O(1), while the same operations on a Sorted Set are O(log N), because Redis has to find the right position for each member.

| Operation                  | Set                     | Sorted Set                      |
| -------------------------- | ----------------------- | ------------------------------- |
| Add a member               | `SADD` - O(1)           | `ZADD` - O(log N)               |
| Remove a member            | `SREM` - O(1)           | `ZREM` - O(log N)               |
| Check / get a member       | `SISMEMBER` - O(1)      | `ZSCORE` - O(1)                 |
| Count all members          | `SCARD` - O(1)          | `ZCARD` - O(1)                  |
| Get all members            | `SMEMBERS` - O(N)       | `ZRANGE key 0 -1` - O(N)        |
| Iterate incrementally      | `SSCAN` - O(1) per call | `ZSCAN` - O(1) per call         |
| Get a range (top 10, etc.) | not possible            | `ZRANGE` - O(log N + M)         |
| Get the rank of a member   | not possible            | `ZRANK` / `ZREVRANK` - O(log N) |
| Count members in a range   | not possible            | `ZCOUNT` - O(log N)             |

N = number of members in a collection. M = number of members returned.

So if you only need membership checks ("is X in the group?"), a Set is cheaper. Pick a Sorted Set when you need ordering, ranks or ranges.

<br/>

### - Command 21: ZADD

**Time complexity**

O(log N) - per each member added.

**Syntax**

Simple form:

```bash
ZADD groupkey score member
```

Complex form:

```bash
ZADD key [NX | XX] [GT | LT] [CH] [INCR] score member [score member ...]
```

**Description**

Adds one or more members with their scores to the sorted set stored at groupkey. If a member already exists, its score is updated and the member is re-positioned to keep the correct order. If the groupkey does not exist, a new sorted set is created.

The return value is the number of members that were **added** (not updated) to the sorted set.

The `ZADD` command supports a set of options that modify its behavior:

- `NX` -- Only add new members. Never update existing ones.
- `XX` -- Only update existing members. Never add new ones.
- `GT` -- Only update an existing member if the new score is **greater** than the current score (Redis 6.2+).
- `LT` -- Only update an existing member if the new score is **less** than the current score (Redis 6.2+).
- `CH` -- Change the return value to the number of members **changed** (added + updated), instead of only added.
- `INCR` -- Behave like `ZINCRBY`: increment the member's score instead of setting it. Only one score-member pair is allowed with this option.

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol" 85 "dave"
(integer) 4
> ZADD leaderboard 110 "alice"
(integer) 0
> ZADD leaderboard CH 115 "alice"
(integer) 1
> ZADD leaderboard GT 90 "carol"
(integer) 0
> ZSCORE leaderboard "carol"
"120"
```

- In the first `ZADD`, we create the sorted set with four members - alice, bob carol & dave.
- In the second `ZADD`, when adding/updating alice with 110, `"alice"` already exists, so her score is updated from 100 to 110 but the return value is 0 (nothing new was added).
- On the third `ZADD`, when adding/updating alice with 115 and `CH`, the update is counted, so we get 1.
- On the fourth `ZADD`, when adding/updating carol with 90 and `GT`, the existing score 120 is higher, so no update.

<br/>

### - Command 22: ZRANGE

**Time complexity**

O(log N + M)

N= number of members in set. M= number of members returned

**Syntax**

Simple form:

```bash
ZRANGE groupkey 0 -1
```

Complex form:

```bash
ZRANGE groupkey start stop [BYSCORE | BYLEX] [REV] [LIMIT offset count] [WITHSCORES]
```

**Description**

Returns the members of the sorted set stored at key within the specified range. By default, `start` and `stop` are **indexes** (ranks), starting at 0. Negative indexes count from the end, so `-1` is the last member, `-2` is the one before it, and so on. `ZRANGE key 0 -1` returns the whole sorted set.

The `ZRANGE` command supports a set of options that modify its behavior:

- `WITHSCORES` -- Return the score of each member as well. The reply alternates between member and score.
- `REV` -- Reverse the order. Desc instead of ASC. From highest score to lowest.
- `BYSCORE` -- Treat `start` and `stop` as **scores** instead of indexes.
  - Use `-inf` and `+inf` for "no lower bound" and "no upper bound".
  - By default the bounds are inclusive. Prefix a bound with `(` to make it exclusive, for example `(85` means "greater than 85".
- `BYLEX` -- Treat `start` and `stop` as lexicographical ranges of member names. Only useful when all members have the same score.
- `LIMIT offset count` -- Skip `offset` members and return at most `count` members (similar to SQL's `OFFSET` / `LIMIT`). Only works together with `BYSCORE` or `BYLEX`.

:::warning
When using `REV` together with `BYSCORE`, the order of the bounds flips: you pass the **max first, then the min** (e.g., `ZRANGE key +inf -inf BYSCORE REV`).
:::

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol" 85 "dave"
(integer) 4
> ZRANGE leaderboard 0 -1 WITHSCORES
1) "bob"
2) "85"
3) "dave"
4) "85"
5) "alice"
6) "100"
7) "carol"
8) "120"
> ZRANGE leaderboard 0 2 REV WITHSCORES
1) "carol"
2) "120"
3) "alice"
4) "100"
5) "dave"
6) "85"
> ZRANGE leaderboard 90 +inf BYSCORE
1) "alice"
2) "carol"
> ZRANGE leaderboard (85 120 BYSCORE
1) "alice"
2) "carol"
> ZRANGE leaderboard +inf -inf BYSCORE REV LIMIT 0 2
1) "carol"
2) "alice"
```

Notice that `"bob"` and `"dave"` both have a score of 85, so they're ordered alphabetically (`"bob"` comes before `"dave"`). The second command (`0 2 REV`) is the classic "top 3" leaderboard query.

:::info
Before Redis 6.2, these operations had separate commands: `ZREVRANGE`, `ZRANGEBYSCORE`, `ZREVRANGEBYSCORE`, `ZRANGEBYLEX` and `ZREVRANGEBYLEX`. They still work, but are considered deprecated. Prefer `ZRANGE` with the matching options.
:::

<br/>

### - Command 23: ZSCORE

**Time complexity**

O(1)

**Syntax**

```bash
ZSCORE key member
```

**Description**

Returns the score of member in the sorted set stored at key. If the member does not exist in the sorted set, or the key does not exist, `nil` is returned.

The score is returned as a string, because Redis replies don't have a float type (in RESP2).

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob"
(integer) 2
> ZSCORE leaderboard "alice"
"100"
> ZSCORE leaderboard "zoe"
(nil)
```

:::info
For getting the scores of multiple members at once, use `ZMSCORE` (available since Redis 6.2).
:::

<br/>

### - Command 24: ZRANK & ZREVRANK

**Time complexity**

O(log N)

**Syntax**

```bash
ZRANK key member [WITHSCORE]
ZREVRANK key member [WITHSCORE]
```

**Description**

Returns the rank (position) of member in the sorted set stored at key. The rank is **0-based**, so the first member has rank 0.

- `ZRANK` ranks members from the **lowest** score to the highest.
- `ZREVRANK` ranks members from the **highest** score to the lowest. This is what you usually want for leaderboards, where rank 0 is first place.

If the member does not exist, or the key does not exist, `nil` is returned. Since Redis 7.2, the `WITHSCORE` option returns the score together with the rank.

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol" 85 "dave"
(integer) 4
> ZRANK leaderboard "alice"
(integer) 2
> ZREVRANK leaderboard "alice"
(integer) 1
> ZREVRANK leaderboard "carol"
(integer) 0
> ZRANK leaderboard "zoe"
(nil)
```

<br/>

### - Command 25: ZINCRBY

**Time complexity**

O(log N)

**Syntax**

```bash
ZINCRBY key increment member
```

**Description**

Increments the score of member in the sorted set stored at key by `increment`. If the member does not exist, it is added with `increment` as its score (as if its previous score was 0). If the key does not exist, a new sorted set is created.

A negative `increment` decreases the score. The return value is the new score of the member, as a string.

This is atomic, so it's safe to use from many clients at once (e.g., many game servers adding points to the same leaderboard).

Examples:

```bash
> ZADD leaderboard 100 "alice"
(integer) 1
> ZINCRBY leaderboard 15 "alice"
"115"
> ZINCRBY leaderboard -5 "alice"
"110"
> ZINCRBY leaderboard 50 "zoe"
"50"
```

<br/>

### - Command 26: ZREM

**Time complexity**

O(M \* log N) - M= number of members removed. N= number of members in set.

**Syntax**

```bash
ZREM key member [member ...]
```

**Description**

Removes the specified members from the sorted set stored at key. Members that do not exist are ignored. If the key does not exist, it is treated as an empty sorted set and the command returns 0.

The return value is the number of members that were **removed** (not including non-existing members).

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol"
(integer) 3
> ZREM leaderboard "bob" "zoe"
(integer) 1
> ZRANGE leaderboard 0 -1
1) "alice"
2) "carol"
```

:::info
To remove members by range instead of by name, use `ZREMRANGEBYSCORE` (by score), `ZREMRANGEBYRANK` (by index) or `ZREMRANGEBYLEX` (by member name).  
For example, `ZREMRANGEBYRANK leaderboard 0 -101` keeps only the top 100 members.
:::

<br/>

### - Command 27: ZCARD & ZCOUNT

**Time complexity**

`ZCARD` is O(1). `ZCOUNT` is O(log N).

**Syntax**

```bash
ZCARD key
ZCOUNT key min max
```

**Description**

- `ZCARD` returns the number of members (cardinality) of the sorted set stored at key. This is the sorted set version of `SCARD`.
- `ZCOUNT` returns the number of members with a score between `min` and `max`. Like `ZRANGE ... BYSCORE`, the bounds are inclusive by default, support `(` for exclusive bounds, and accept `-inf` / `+inf`.

Both return `0` if the key does not exist.

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol" 85 "dave"
(integer) 4
> ZCARD leaderboard
(integer) 4
> ZCOUNT leaderboard 90 120
(integer) 2
> ZCOUNT leaderboard (85 +inf
(integer) 2
> ZCOUNT leaderboard -inf +inf
(integer) 4
> ZCARD nonexistent
(integer) 0
```

<br/>

### - Command 28: ZSCAN

**Syntax**

```bash
ZSCAN key cursor [MATCH pattern] [COUNT count]
```

**Description**

Incrementally iterates over the members and scores of the sorted set stored at key. This command is the sorted-set-specific version of `SCAN` and is designed to handle large sorted sets without blocking the Redis server.

The `ZSCAN` command returns:

1. A new cursor value (to be used in the next call)
2. An array of member-score pairs

Like `SCAN`, the iteration starts with cursor 0 and ends when the returned cursor is 0.

**Options:**

- `MATCH pattern` - Only return members that match the given pattern (supports glob-style patterns)
- `COUNT count` - Hint about how many elements to return per call (default is usually around 10)

**Time complexity:** O(1) for every call. O(N) for a complete iteration, where N is the number of members in the sorted set

:::warning
Unlike `ZRANGE`, `ZSCAN` does **not** guarantee that members are returned in score order. Use it to go over every member (e.g., for exports or cleanups), not to get sorted results.
:::

Examples:

```bash
> ZADD leaderboard 100 "alice" 85 "bob" 120 "carol" 85 "dave"
(integer) 4
> ZSCAN leaderboard 0
1) "0"
2) 1) "bob"
   2) "85"
   3) "dave"
   4) "85"
   5) "alice"
   6) "100"
   7) "carol"
   8) "120"
> ZSCAN leaderboard 0 MATCH a*
1) "0"
2) 1) "alice"
   2) "100"
```
