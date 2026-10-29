# Why Dependency Injection

> A class declares what it needs. The caller decides what it gets.

---

## TLDR;

Code that decides **what happens** shouldn't also decide **what exists**. Dependency injection de-couples those two apart.

---

## The one-liner

Dependency injection separates **using** a dependency from **choosing and implementing** it.
This is exactly the **"D" in SOLID - depend on an abstraction, not a concrete class**.
The class depends on a capability (`Cache`); the composition root decides it's Redis. You get business logic you can test, swap, and reuse without dragging infrastructure along.

---

## Why not just use a singleton?

That's the realistic baseline. Nobody opens a connection per call; you export one instance and import it:

```typescript
// db.ts
export const users = new PostgresUsers(process.env.DATABASE_URL);

// cache.ts
export const cache = new RedisCache(process.env.REDIS_URL);

// user-service.ts
import { users } from "./db";
import { cache } from "./cache";

export class UserService {
  async signUp(email: string) {
    if (await users.exists(email)) throw new Error("email already taken");

    const user = await users.create(email);
    await cache.set(`user:${user.email}`, user);
  }
}
```

One shared instance is fine. The problem is **global access** to it:

- **Hidden dependencies.** `new UserService()` looks free. It actually needs Postgres, Redis, and two env vars, and the signature says none of that.
- **Import-time side effects.** Importing `user-service.ts` connects to two servers. Config has to exist at import time, and touching the file in a test opens a connection.
- **Shared mutable state.** Every test in the process gets the same instance. Tests leak into each other, become order-dependent, and need resets.
- **"Exactly one" is baked in.** A read replica, a second Redis cluster, or per-tenant connections mean rewriting every consumer, because the class decided there's one.
- **Lifecycle is nobody's job.** Who connects first, who closes on shutdown, in what order? With globals, the answer is whoever imported first.

DI keeps the single instance and drops the global: the composition root creates one pool and passes it in. Singleton **lifetime** is good; the Singleton **pattern** is the problem.

---

## "But Jest can mock anything"

It can, and with DI you still pass fakes. The difference is what the test is coupled to:

- **`jest.mock("./db")` couples the test to file layout.** Move the import, split the module, or re-export it elsewhere, and the test breaks while behavior didn't change.
- **Module mocks are per file, not per test.** Different behavior per case means `mockImplementation` plus resets, and that's back to shared state.
- **Hoisting and ESM make it fragile.** `jest.mock` is hoisted magic, and native ESM support is still awkward.
- **A constructor fake goes through the public API.** It's plain code, type-checked against the interface, scoped to one test, and it survives refactors.

Module mocking patches the module system to work around a hidden dependency. DI makes the dependency a parameter, so there's nothing to work around.

---

## What does it look like after?

```typescript
class UserService {
  constructor(
    private users: UserStore,
    private cache: Cache,
  ) {}

  async signUp(email: string) {
    if (await this.users.exists(email)) throw new Error("email already taken");

    const user = await this.users.create(email);
    await this.cache.set(`user:${user.email}`, user);
  }
}

interface UserStore {
  exists(email: string): Promise<boolean>;
  create(email: string): Promise<User>;
}

interface Cache {
  set(key: string, value: unknown): Promise<void>;
}
```

The test describes a situation instead of standing up infrastructure:

```typescript
test("a taken email does not create or cache a user", async () => {
  let created = false;
  let cached = false;

  const service = new UserService(
    { exists: async () => true, create: async (email) => ((created = true), { email }) },
    { set: async () => void (cached = true) },
  );

  await expect(service.signUp("dana@example.com")).rejects.toThrow(/taken/);
  expect(created).toBe(false);
  expect(cached).toBe(false);
});
```

Wiring lives in one place, the **composition root**:

```typescript
const pool = createPool(config.databaseUrl);
const redis = createRedisClient(config.redisUrl);

const usersRepository = new PostgresUsers(pool);
const userCache = new RedisCache(redis);
const userService = new UserService(usersRepository, userCache);
```

Swapping Redis means a new `Cache` implementation plus one line here. Lifetimes are explicit: one pool, one Redis client, shared by passing them around.

---

## Do you need a framework for it?

No. Constructor args or factory params _are_ DI. Nest, Spring, and Angular containers just automate the wiring once the graph gets big.

---

## DI vs. dependency inversion?

They answer different questions:

- **Inversion** (the D in [SOLID](./solid.md)): depend on an abstraction, not a concrete class.
- **Injection**: the concrete instance arrives from outside.

You want both. `constructor(cache: RedisCache)` is injection that's still married to Redis. An interface with `new RedisCache()` inside the method is inversion in name only, because the `new` is the real dependency.

The [strategy pattern](./design-patterns.md) is the same split, applied to behavior.

---

## When does it stop paying off?

- **A long constructor is a design smell.** Twelve deps means the class does too much. Split it; don't hide it behind a container.
- **A service locator isn't DI.** `container.get(Cache)` inside a method hides the dependency again and fails at runtime instead of compile time.
- **Don't inject everything.** Value objects, `Map`, `Error`, pure formatters: just `new` them. Inject when it does I/O, has a lifetime to manage, needs faking in tests, or has real alternative implementations.
- **Keep the composition root dumb.** It picks objects. It doesn't make business decisions.
