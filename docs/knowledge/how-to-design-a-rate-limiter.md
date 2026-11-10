# How to design a rate limiter?

> **A rate limiter counts how many requests someone sent recently, and says "no" when it's too many.**

---

## 1. The problem

Let's say you have a public API, and one client starts sending 5,000 requests per second.

Maybe it's an attacker trying passwords on `POST /auth/login`. Maybe it's a scraper. Maybe it's just a bug in someone's `while` loop. It doesn't matter. Your servers are busy answering one client, and **everyone else experiences slowness, or no responses at all**.

So we want a rule like:

> **Each client can send at most 100 requests per minute.**

And for request number 101, we answer immediately, without doing any real work:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
```

That's a rate limiter. It protects you from:

- ✅ **Abuse**: brute-force login, scraping, spam
- ✅ **Cost**: endpoints that send an SMS or call a paid API cost you money on every request
- ✅ **Fairness**: one noisy client can't eat the capacity of everyone else
- ✅ **Overload**: a buggy client can't take your database down

---

## 2. Where does the rate limiter live?

There are 2 places you could put it:

1. **At WAF level** (like Cloudflare or AWS WAF)  
   Great for rough rules, like "max 10 requests per second per IP". This outer layer usually don't know who the user is, so they can only count by IP.
2. **As a middleware in your backend**:  
   Knows everything: who the user is, their plan, which endpoint they're calling, etc.

In real systems you often have **both**. In this guide we build a **Express middleware** that runs **before** your route handler.

```text
request ──► rate limiter middleware ──► allowed?  ── yes ──► route handler
                                            │
                                            no
                                            ▼
                                     429 Too Many Requests
```

---

## 3. Who & what we are limiting

So who are we limiting?

We can limit:

- A user - i.e. `user:42` (Anonymous endpoints like login or register)
- An IP address - i.e. `1.2.3.4` (Logged-in endpoints)
- An API key - i.e. `sk_line_8f...` (Public APIs with plans (free / pro))

What are we limiting?

- We are limiting different endpoints / path
- Each endpoint could have its own rule / counter

A rule usually limits **one key on one endpoint group**, so the Redis key looks like this:

```text
rate-limit:get-items:user:42        → API calls from user 42
rate-limit:auth-login:1.2.3.4       → login attempts from this IP
```

With the above setup, user 42 can be blocked on `/get-items`, while still being allowed to log in (`/auth/login`). Each rule has its own counter.

---

## 4. Why Redis? Why not in-memory?

### - A. more than one server behind a load balancer

The number of replicas I have **multiplies the rate limit**.

If I'm allowed to send only 100 requests, but instead I sent 300 that got split into 3 identical servers, **my 100 limit was really 300**. My 101 request should have been blocked, but it wasn't.

```text
                       ┌──► Server A   Map: { daniel: 34 }
Daniel ──► LB ─────────┼──► Server B   Map: { daniel: 33 }
                       └──► Server C   Map: { daniel: 33 }
```

### - B. every deploy resets the counters to 0

A restart to the server also resets the counter, and not just for one user, but for many users.

### - C. counter lives in one place

> **The counter has to live in one place that all servers share.**

Come in Redis:

- **Fast**: everything is in memory, a command takes well under a millisecond
- **Shared**: all servers talk to the same Redis
- **Atomic counters**: `INCR` adds 1 and returns the new value in one step
- **Built-in expiry**: `EXPIRE` deletes a key automatically, so old counters clean themselves up

---

## 5. Algorithm 1: Fixed window counter

The idea: cut time into fixed windows of 1 minute. **Count the requests in the current window**. When the minute is over, start again from 0.

```text
limit: 3 per minute

12:00 ─────────────── 12:01 ─────────────── 12:02
  ✅ ✅ ✅ ❌ ❌         ✅ ✅ ✅
  1  2  3 4 5         1  2  3
```

The **key will be some prefix text, then the userId, then the window id**:

```text
rate-limit:user:42:29371680
```

### The code

```js
async function fixedWindow(userId, limit, windowMs) {
  const window = Math.floor(Date.now() / windowMs);
  const redisKey = `rate-limit:user:${userId}:${window}`;

  const [[, count]] = await redis
  .multi()
  .incr(redisKey)
  .pexpire(redisKey, windowMs, 'NX')
  .exec();

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterMs: (window + 1) * windowMs - Date.now(),
  };
}
```

### The problem: the window boundary

There's a problem happening around the edge of the window:

The client sends 100 requests at 59th second, and 100 more at 1st second of the next minute. Each minute-window sees only 100, so everything passes. **The client got 2x the limit in 2 seconds**.

```text
limit: 100 per minute

        window 12:00               window 12:01
|─────────────────────────|─────────────────────────|
                     100 ▲ ▲ 100
                 12:00:59   12:01:00
```

---

## 6. Algorithm 2: Sliding window log

The most accurate idea: **save the timestamp of every request**, and to decide - count how many timestamps are from the last 60 seconds. Every request is basically NOW... minus 60 seconds. That's the windows. Every request creates a window.

Redis has the perfect data structure for this: a `ZSET`. Which means a **sorted set**. Each member in a `ZSET` has a **score**, and we use the timestamp as the score. Then "remove everything older than 60 seconds" is one command.

```text
limit: 3 per minute, now = 12:01:20

log:  12:00:10   12:00:50   12:01:05   12:01:15
        ✂️ older than 12:00:20, remove

count in the last minute = 3 → ❌ reject
```

### The Pseudo-Code

The algorithm:

1. **`ZREMRANGEBYSCORE`** removes every timestamp that is older than `now - 60s`. After this line, the set contains only the last minute.
2. **`ZCARD`** returns how many members the set has, which is the number of requests in the last minute.
3. If we're at the limit:
   - No insert to the `ZSET`.
   - We reject the request with status 429.
   - The client can retry when the **oldest** request in the set turns 60 seconds old.
4. Otherwise, apply **`ZADD`** to log this request with the current time as its score.
5. The **key for each request** is a random **UUID** (unique), and not a timestamp.  
   Why uuid as the member key? Members in a sorted set are unique. If two requests arrive in the same millisecond and we used the timestamp as the member, the second ZADD would just overwrite the first one, and we'd count 1 request instead of 2.
6. **`PEXPIRE`**: on the entire key of the `ZSET`, such that if the client stops sending requests, the whole set disappears after 1 minute.

:::tip
Notice we **don't log rejected requests**. So a client that keeps hammering after being blocked **doesn't extend its own punishment**. Both choices are valid, this one is the more common.
:::

### The problem: memory

The boundary problem is gone, the window really slides. **But we store every single request**.

A limit of 10,000 requests per hour means up to 10,000 members **per client**. With 1M clients that's gigabytes of Redis memory, just to count.

So sliding window log is great when the limit is **small**: like 5 login attempts per 15 minutes. For big limits, we want something that slides but stays small.

---

## 7. Algorithm 3: Sliding window counter

The idea: **keep only 2 numbers**. The count of the previous fixed window, and the count of the current one. Then **estimate** how many requests happened in the last 60 seconds.

For example, if we're at the half way mark, we take all requests on this window, and half of the total of the previous window. If we're at the third way mark of this current window, we take all requests inside this window, and 2 thirds of the total of the previous window.

Now, let's say the previous window had 80 requests. We don't know exactly when those 80 requests happened, so we **assume even distribution**:

The idea is that **as the current window moves forward, the previous window's weight goes down** from 100% to 0%. **That's called the slide**.

So if we now revisit the issue we had previously, about 100 requests at the 59th, then 100 at the 1st second. Now, with the slide effect, at the 1st second of the current window, the weight of the previous window is very near to 100%, so the estimate is already `100 × 1 + 0 = 100`, and so new requests are rejected. ✅

```text
limit: 100 per minute, now = 12:01:15 (25% into the current window)

      previous window (12:00)        current window (12:01)
                                     15 seconds in
|──────────────────────────────|─────────|─────────────────────|
            80 requests                30 requests (so far)
      ◄──────── last 60 seconds ────────►
                |  75% of the  |
                |  previous    |
```

### The Pseudo-Code

We keep the 2 counters in one Redis hash: `{ window, curr, prev }`.

The algorithm:

1. **Load** the counters. On the very first request the hash doesn't exist, so everything starts at 0.
2. **Roll the windows**. If the last request was in the previous window, the old `curr` becomes `prev`. If the client was quiet for 2 windows or more, both are 0.
3. **Estimate**, with the formula from above, and reject if we're at the limit. For `retryAfter`, we solve the same formula backwards: how far into the window do we need to be, so the previous window's weight drops enough for one more request?
4. **Count** the request and save. `PEXPIRE` is 2 windows, because the current window is still needed as "previous" during the next one.

### The trade-off

It's an **approximation**: if the 80 previous requests all happened in the first second of that window, the estimate is wrong. In practice, real traffic is spread out enough that the error is small (Cloudflare measured it at a fraction of a percent of requests).

In return: **3 small numbers per client**, no matter how big the limit is. That's why it's a very common default.

---

## 8. Algorithm 4: Token bucket

All the algorithms so far answer "**how many** requests in the last minute?". Token bucket answers a different question: "**how fast** are you sending, on average, and **how big** a burst do I allow?".

Picture a bucket:

```text
         +1 token every 100ms   (refill rate: 10/sec)
                  │
                  ▼
            ┌───────────┐
            │ ● ● ● ● ● │  capacity: 20 tokens
            │ ● ● ● ● ● │
            └─────┬─────┘
                  │
                  ▼
     every request takes 1 token
     no token? → ❌ 429
```

- The bucket holds up to **20 tokens** (the **capacity**)
- It **refills** at **10 tokens per second**
- Each request **takes 1 token**. No token left → rejected.

So a client that was quiet for a while has a full bucket, and can send **20 requests at once** (a burst). After that it can only go as fast as the refill: **10 per second**. That's a great fit for real apps: a page load fires 15 requests at once, then it's quiet.

### The trick: we never actually refill

You might think we need a timer that adds tokens to every bucket every 100ms. With 1M clients that would be crazy.

Instead, we store **2 numbers**:

1. how many tokens were left
2. and **when** we last looked

On the next request we calculate how many tokens would have filled in since then:

```text
limit:       20 requests (token)
last time:   12:00:00.000, you had 4 tokens left
now:         12:00:00.500
Time diff:   500ms passed
Fill:        time passed * rate = 500ms × 10 per second = 5 new tokens

tokens = min(limit, 4 + 5) = 9  → take 1 → 8 left ✅
```

This is called **lazy refill**. Nothing happens between requests.

---

## 9. Which algorithm should I pick?

| Algorithm                  | Memory per client   | Accurate?                    | Bursts                         | Use it for                                    |
| -------------------------- | ------------------- | ---------------------------- | ------------------------------ | --------------------------------------------- |
| **Fixed window**           | 1 number            | ❌ 2x at the window boundary | Up to 2x the limit at the edge | Simple daily / monthly quotas                 |
| **Sliding window log**     | 1 entry per request | ✅ Exact                     | Never above the limit          | Small, strict limits (5 logins / 15 min)      |
| **Sliding window counter** | 3 numbers           | ⚠️ Very close                | Never much above the limit     | General API limits ("1000 requests / hour")   |
| **Token bucket**           | 2 numbers           | ✅ Exact (for a rate)        | ✅ Allowed, up to the capacity | API traffic from real apps, per-second limits |

A simple way to choose:

- 👉 "**At most N per period**" → **sliding window counter** (or **sliding window log** if N is small)
- 👉 "**On average N per second, with some bursts**" → **token bucket**
- 👉 "**N per day, reset at midnight**" → **fixed window** (here the boundary is a feature, not a bug)

---

## 10. Telling the client to Retry-After

A good rate limiter doesn't just say "no" (429). **It says when to come back**:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
RateLimit-Remaining: 0
Content-Type: application/json

{ "error": "Too many requests" }
```

| Header                  | Meaning                                        |
| ----------------------- | ---------------------------------------------- |
| `429 Too Many Requests` | The standard status code for "you're limited"  |
| `Retry-After`           | Seconds until the client may try again         |
| `RateLimit-Remaining`   | How many requests are left (on every response) |

`Retry-After` is the important one. A well-written client waits that long instead of retrying in a tight loop. And retrying in a tight loop is exactly what makes a limited client even more expensive for you.

---

## 11. What if Redis is down?

Every request now depends on Redis. So what happens when Redis is unreachable?

There are 2 choices:

- **Accept all**: Your API keeps working, but without protection for a while. ✅ The right default for most endpoints. An outage of the limiter shouldn't be an outage of your entire backend.
- **Reject all** (reject with `503`): nobody gets through. ✅ The right choice when one minute of unlimited requests is dangerous or expensive. For example, login (brute force), sending SMS or emails (money), password reset.

---

## Minimal mental model (keep this)

> **A rate limiter is a counter, per client, per rule, that lives in Redis so all servers share it.**
>
> **Fixed window** counts "this minute so far". Cheap, but allows 2x at the boundary.
> **Sliding window log** remembers every request. Exact, but expensive for big limits.
> **Sliding window counter** blends the last 2 windows. Almost exact, and tiny.
> **Token bucket** refills at a steady rate. Allows bursts, limits the average.
>
> Read, decide, and write in **one Lua script**, or two servers will both let request 101 through.
>
> Answer with **`429` + `Retry-After`**, and decide upfront whether to **fail open or closed** when Redis is down.
