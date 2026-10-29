# Access Tokens and Refresh Tokens

> **The access token is what you show on every request. The refresh token is what you show rarely, to get a new access token.**

---

## 0. TLDR

> **Refresh tokens exist so users can stay logged in for a long time (good UX), while the token sent on every request stays short-lived and revocation still takes effect quickly (high security).**

- **Access token**: short-lived (minutes), sent on every request, checked by signature only. If it leaks, it's useless soon.
- **Refresh token**: long-lived (days), sent only to `POST /auth/refresh`, checked against the DB every time. That's where you can revoke access.
- Every few minutes the client has to come back and ask "am I still allowed?", and the server gets a chance to say no, without the user ever noticing.

---

## 1. The problem

Imagine you have **one** token. The user logs in, you sign a JWT, and the client sends it on every request:

```http
GET /orders
Authorization: Bearer eyJhbGciOi...
```

Your backend verifies the token by **checking its signature**. No database lookup. That's the whole appeal of JWTs:

- ✅ Fast: verifying a signature is just CPU work
- ✅ Stateless: any service that has the public key can verify it
- ✅ Scales: no shared session store, no DB hit per request

But here's the catch:

> **A token that is verified without asking the database can't be cancelled by the database.**

If the user:

- clicks "log out"
- changes their password
- gets banned
- has their laptop stolen

...the token is **still valid until it expires**. The signature is still correct. Your API has no reason to reject it.

So now you have to choose how long this single token should live:

| Lifetime        | Security                                              | User experience                  |
| --------------- | ----------------------------------------------------- | -------------------------------- |
| **Short** (15m) | ✅ A stolen token is useless soon                     | ❌ User logs in every 15 minutes |
| **Long** (30d)  | ❌ A stolen token works for a month, can't be revoked | ✅ User stays logged in          |

You can't have both with one token. **That's the entire reason refresh tokens exist.**

---

## 2. The solution: split the job into two tokens

Instead of one token doing everything, you give the client two tokens with **different jobs**:

### 1️⃣ Access token

👉 "Let me in."

- Sent on **every** API request
- **Short-lived** (typically 5–15 minutes, sometimes up to 1 hour)
- Verified **statelessly** (signature check, no DB)
- Usually a **JWT** containing user id, roles, scopes

### 2️⃣ Refresh token

👉 "Give me a new access token."

- Sent **only** to one endpoint: `POST /auth/refresh`
- **Long-lived** (days to weeks)
- Verified **statefully** (looked up in the database every time)
- Usually a **random opaque string** (not a JWT), stored hashed in your DB

The key insight:

> **The access token is cheap to check but impossible to revoke.**
> **The refresh token is expensive to check but easy to revoke.**
>
> **Combining them gives you cheap checks on 99% of requests, and a revocation checkpoint every few minutes.**

---

## 3. How does it work?

Let's compare two setups for the following case:

1. The user logs in at 09:00
2. An admin bans them at 10:30.

### ❌ Setup A: one 24-hour access token

```text
09:00  login → access token valid until 09:00 tomorrow
10:30  admin bans the user
10:31  GET /orders  → signature valid → ✅ 200 OK   (still works!)
...
08:59  GET /orders  → signature valid → ✅ 200 OK   (still works!)
```

The ban has **no effect for 22.5 hours**. Your API never asks the DB, so it never finds out.

### ✅ Setup B: 1-hour access token + 24-hour refresh token

```text
09:00  login → access token (until 10:00) + refresh token (until 09:00 tomorrow)
10:00  access token expires → POST /auth/refresh
         → DB: refresh token valid? user active? → ✅ new access token (until 11:00)
10:30  admin bans the user
10:31  GET /orders  → signature valid → ✅ 200 OK   (still works, for now)
11:00  access token expires → POST /auth/refresh
         → DB: user is banned → ❌ 401
         → user is logged out
```

The ban takes effect **within at most 1 hour** (the access token lifetime).

So:

- **The access token lifetime** = the maximum delay before a revocation takes effect.
- **The refresh token lifetime** = how long the user can stay logged in without typing their password again.

They answer two **different** questions, which is why they're two different numbers.

---

## 4. The second benefit: exposure

Revocation is the main reason, but there's another one: **how much each token is exposed.**

The access token:

- travels on **every** request (hundreds or thousands of times a day)
- goes to **many** services (your API, microservices, maybe third-party resource servers)
- ends up in logs, proxies, debugging tools, error reports, browser memory

The more places a secret goes, the more likely it leaks.

The refresh token:

- travels **once every few minutes** at most
- goes to **one** endpoint, on **one** server (the auth server)
- can be stored somewhere much harder to reach (e.g. an `HttpOnly` cookie scoped to `/auth/refresh`)

So:

> **The token that travels everywhere is the one that expires quickly.**
> **The token that lives long is the one that almost never travels.**

If an access token leaks, the damage window is minutes. If you want to steal the long-lived refresh token, you have to break into a much smaller, better-protected place.

---

## 5. The full flow

### Step 1: Login

```text
Client                                   Auth server
  |                                           |
  |  POST /auth/login  { email, password }    |
  |------------------------------------------>|
  |                                           |  verify password
  |                                           |  create refresh token → save hash in DB
  |                                           |  sign access token (JWT, 15 min)
  |  { accessToken }                          |
  |  Set-Cookie: refresh_token=...; HttpOnly  |
  |<------------------------------------------|
```

### Step 2: Normal API calls (the 99% case)

```text
Client                                   API server
  |                                           |
  |  GET /orders                              |
  |  Authorization: Bearer <accessToken>      |
  |------------------------------------------>|
  |                                           |  verify JWT signature + expiry
  |                                           |  (no DB lookup for auth)
  |  200 OK  [ ...orders ]                    |
  |<------------------------------------------|
```

### Step 3: The access token expires

```text
Client                                   API server
  |                                           |
  |  GET /orders                              |
  |  Authorization: Bearer <expired token>    |
  |------------------------------------------>|
  |  401 Unauthorized                         |
  |<------------------------------------------|
```

### Step 4: Refresh

```text
Client                                   Auth server
  |                                           |
  |  POST /auth/refresh                       |
  |  Cookie: refresh_token=...                |
  |------------------------------------------>|
  |                                           |  look up hash in DB
  |                                           |  not expired? not revoked? user active?
  |                                           |  revoke old refresh token
  |                                           |  issue new refresh token (rotation)
  |                                           |  sign new access token
  |  { accessToken }                          |
  |  Set-Cookie: refresh_token=<new>          |
  |<------------------------------------------|
```

### Step 5: Retry the original request

The client retries `GET /orders` with the new access token. The user never noticed anything happened.

### Step 6: The refresh token expires (or is revoked)

`POST /auth/refresh` returns `401`. Now — and only now — the user is sent back to the login page.

---

## 6. Do I need an API just for refreshing?

**Yes.** You need one endpoint, usually `POST /auth/refresh` (in OAuth2 it's the `/token` endpoint with `grant_type=refresh_token`).

It's small, but it's the most important endpoint in your auth system, because it's the **checkpoint** where you get to say "no".

Things the refresh endpoint should check:

- Does this refresh token exist in the DB?
- Is it expired?
- Has it been revoked (logout, password change, "log out of all devices")?
- Is the user still active (not banned, not deleted)?
- Has this token already been used? (see rotation below)

### A minimal implementation

The DB table:

```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id),
  family_id   UUID NOT NULL,          -- all tokens descended from one login
  token_hash  TEXT NOT NULL UNIQUE,   -- never store the raw token
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ
);
```

Store the **hash** of the token, not the token itself — same reason you hash passwords. If your DB leaks, the attacker shouldn't get working tokens.

The endpoint (Express-style):

```ts
app.post('/auth/refresh', async (req, res) => {
  const presented = req.cookies.refresh_token;
  if (!presented) return res.sendStatus(401);

  const record = await db.refreshTokens.findByHash(sha256(presented));
  if (!record || record.expiresAt < new Date()) return res.sendStatus(401);

  if (record.revokedAt) {
    // An already-used token was presented again: someone has a stolen copy.
    await db.refreshTokens.revokeFamily(record.familyId);
    return res.sendStatus(401);
  }

  const user = await db.users.findById(record.userId);
  if (!user || user.isBanned) return res.sendStatus(401);

  // Rotation: the old refresh token dies, a new one replaces it.
  await db.refreshTokens.revoke(record.id);
  const newRefreshToken = crypto.randomBytes(32).toString('base64url');
  await db.refreshTokens.create({
    userId: user.id,
    familyId: record.familyId,
    tokenHash: sha256(newRefreshToken),
    expiresAt: addDays(new Date(), 30),
  });

  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: signAccessToken(user, { expiresIn: '15m' }) });
});
```

---

## 7. Refresh token rotation (and why it catches thieves)

**Rotation** means: every time a refresh token is used, it's **revoked** and a **new one** is issued.

So a refresh token is effectively **single-use**.

Why is that useful? Because it turns a stolen token into an alarm:

```text
1. User has refresh token R1
2. Attacker steals R1
3. Attacker uses R1 → gets R2 (attacker now has a valid session)
4. User's app uses R1 → but R1 was already used!
   → server: "R1 was used twice. One of these is a thief."
   → server revokes the whole family (R1, R2, everything from this login)
5. Both attacker and user are logged out. User logs in again with password.
```

It also works the other way around (switch between 3 & 4). Either way, **the second use of the same token reveals the theft**, and the attacker's session dies.

Without rotation, a stolen refresh token silently works until it expires.

### ⚠️ Gotcha: concurrent refreshes

If the user has two tabs open and both detect an expired access token at the same moment, both send the **same** refresh token. The second one looks like a reuse → the whole family gets revoked → the user is logged out for no reason.

Common fixes:

- On the client: make sure only **one** refresh request is in flight at a time (see next section)
- On the server: allow a short **grace period** (a few seconds) where the just-rotated token is still accepted

---

## 8. The client side - implementing invisible refresh

The client's job is to make refreshing **invisible** to the user.

The usual pattern is an HTTP interceptor: if a request fails with `401`, refresh once, then retry.

```ts
let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post('/auth/refresh', null, { withCredentials: true });
  accessToken = data.accessToken;
  return data.accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original._retried) throw error;
  original._retried = true;

  // Many requests can fail at once; they should all wait on one refresh.
  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = null;
  });

  try {
    await refreshPromise;
  } catch {
    redirectToLogin();
    throw error;
  }

  return api(original);
});
```

The important parts:

- **`refreshPromise`** makes sure ten parallel failing requests trigger **one** refresh, not ten
- **`_retried`** prevents an infinite loop if the retried request also returns `401`
- If the refresh itself fails, the session is really over → go to login

Some clients also refresh **proactively** (e.g. a minute before the access token's `exp`), so the user never even hits a `401`.

---

## 9. Where to store each token

### In the browser

For the **refresh token** there's only one right answer: an `HttpOnly; Secure; SameSite=Strict` cookie with `Path=/auth/refresh`. JS can't read it (XSS can't steal it), and the browser only sends it to the refresh endpoint.

The **access token**, however, has two valid options. Pick one, or support both:

#### Option A: in memory, sent in the `Authorization` header

| Token        | Where                     | Sent as                     |
| ------------ | ------------------------- | --------------------------- |
| Access token | In memory (a JS variable) | `Authorization: Bearer ...` |

- Not persisted: on page reload the access token is gone, so the app calls `/auth/refresh` on startup to get a new one.
- `/auth/refresh` returns the new access token in the **response body**, as in section 6.
- Immune to CSRF on your API, but an injected script can read the token from memory.

#### Option B: both tokens in cookies

| Token        | Where                       | Sent as                     |
| ------------ | --------------------------- | --------------------------- |
| Access token | `HttpOnly` cookie, `Path=/` | `Cookie` (on every request) |

- Survives page reloads; no token handling in JS at all.
- `/auth/refresh` sets **both** cookies via `Set-Cookie` instead of returning the access token in the body.
- XSS can't steal either token, but every endpoint is now a potential [CSRF](./csrf-attack.md) target, so `SameSite` (and CSRF tokens where needed) are mandatory.
- Only works smoothly when the frontend and API are on the same site.

#### Both: cookie for the web app, header for everything else

The backend accepts the access token from **either** place (header first, then cookie). The web app uses Option B, while mobile apps, CLIs and other services send the header.

The full comparison, and the backend helper for accepting both, is in [section 14](#14-access-token-cookie-vs-authorization-header).

❌ Avoid storing the refresh token in `localStorage`. Any XSS on your page can read `localStorage` and exfiltrate a long-lived token.

Because the refresh token is in a cookie, the refresh endpoint is a potential [CSRF](./csrf-attack.md) target in **both** options. An attacker's site can make the victim's browser call `POST /auth/refresh`, but the attacker gains nothing from it:

- **Option A**: the new access token comes back in the response body, and a cross-site page can't read the response.
- **Option B**: the new tokens come back as `Set-Cookie`, and they're stored in the **victim's** browser. The attacker can't read those cookies either. The victim just got fresh tokens they would have gotten anyway.

### In mobile / desktop apps

Use the OS secure storage: **Keychain** (iOS/macOS) or **Keystore** (Android). Don't put them in plain shared preferences or files.

---

## 10. Logout

With access + refresh tokens, logout means:

1. **Revoke the refresh token** in the DB (or the whole family / all of the user's tokens for "log out everywhere")
2. **Clear the cookies**: the refresh token cookie, plus the access token cookie if you store it there (Option B in section 9)
3. **Drop the access token** from client memory (Option A in section 9)

⚠️ Note what's **not** in the list: the access token itself is still technically valid until it expires (up to 15 minutes). That's the trade-off you accepted by making it stateless. Usually that's fine.

If it's not fine (e.g. banking), you can keep a small **deny-list** of revoked access token ids (`jti`) in Redis until they expire. That's a DB/cache hit per request again, so only do it when you need it.

---

## 11. When you DON'T need refresh tokens

This is the part that's rarely said out loud:

> **Refresh tokens solve a problem that stateless access tokens create.**

If you use classic **server-side sessions**:

```http
Cookie: session_id=a8f3...
```

and look the session up in Redis/DB on every request, then:

- revocation is already instant (delete the session)
- the session id never needs to be "refreshed"
- you can extend the session on activity (sliding expiration)

So there's nothing for a refresh token to fix. For a single monolith serving its own web frontend, server-side sessions are often the **simpler and better** choice.

Access + refresh tokens shine when:

- **Many services** need to verify the user without each calling a central session store (microservices)
- **Third parties** call your API on behalf of a user ([OAuth2](./oauth2.md))
- **Mobile / native clients** where cookies are awkward
- The **auth server is separate** from the API servers (Auth0, Keycloak, Cognito, etc.)

---

## 12. Choosing lifetimes

There's no universal answer, but common starting points:

| Token         | Typical lifetime | Think of it as                                               |
| ------------- | ---------------- | ------------------------------------------------------------ |
| Access token  | 5–15 minutes     | "How long can a revocation be delayed?"                      |
| Refresh token | 7–30 days (idle) | "How long can the user be inactive before logging in again?" |
| Session max   | 30–90 days       | "Absolute limit, even if they're active every day"           |

---

## 13. Common misconceptions

### ❌ "A refresh token is just a longer access token"

No. It's sent to a **different place**, checked in a **different way** (DB vs signature), and can be **revoked**. The lifetime is the least interesting difference.

### ❌ "If the attacker can steal the access token, they can steal the refresh token too"

Not necessarily. The access token is in JS memory and in every request header. The refresh token can be in an `HttpOnly` cookie that JS can't read, sent only to one path. Stealing one doesn't imply stealing the other. And if the refresh token **is** stolen, rotation detects it on the next reuse.

### ❌ "Why not just check the access token against the DB on every request?"

You can! But then you've rebuilt **server-side sessions**, and you lose the reason you chose stateless tokens. That's a valid choice — just make it consciously (see section 11).

### ❌ "The refresh token should be a JWT"

It can be, but there's little benefit. You're going to look it up in the DB anyway, so a random opaque string is simpler and leaks no information.

---

## Minimal mental model (keep this)

> **Access token**: short-lived, sent everywhere, checked by signature only. Cheap, but can't be cancelled.
>
> **Refresh token**: long-lived, sent to one endpoint, checked in the DB. Expensive, but can be cancelled.
>
> **The access token lifetime is how long a revocation can be delayed.**
> **The refresh token lifetime is how long the user stays logged in.**
>
> The refresh endpoint is your checkpoint: every few minutes, the client has to come back and ask "am I still allowed?" — and you get to say no.

---

## 14. Access token: cookie vs Authorization header

So far the access token was kept in JS memory and sent like this:

```http
GET /orders
Authorization: Bearer eyJhbGciOi...
```

But a very common alternative is to put it in a cookie, and let the browser send it:

```http
GET /orders
Cookie: access_token=eyJhbGciOi...
```

Both are fine. The token is the same, it's verified the same way, and the whole refresh flow stays the same. What changes is **which attack you have to defend against**.

### The core trade-off

> **Cookies are sent automatically. That's both their strength and their weakness.**

- **Automatically** means your JS never touches the token → XSS can't read it (with `HttpOnly`).
- **Automatically** also means the browser attaches it even when _another site_ triggers the request → [CSRF](./csrf-attack.md).

A header is the opposite: your JS has to attach it, so another site can't, but your JS (and anything injected into your page) can read it.

|                                        | `Authorization` header                                | `HttpOnly` cookie                      |
| -------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| XSS can **steal** the token            | ✅ Yes, it's readable by JS                           | ❌ No, JS can't read it                |
| CSRF possible                          | ❌ No, other sites can't set your headers             | ✅ Yes, needs `SameSite` / CSRF tokens |
| Survives page reload                   | ❌ No (if in memory), call `/auth/refresh` on startup | ✅ Yes                                 |
| Client code needed                     | Attach header on every request                        | None (just `withCredentials: true`)    |
| Works for mobile / CLI / third parties | ✅ Yes, the standard way                              | ⚠️ Awkward                             |
| Works across different domains         | ✅ Yes                                                | ⚠️ Only same-site, without extra pain  |
| Size limit                             | Practically none                                      | ~4KB per cookie                        |

### ⚠️ "HttpOnly protects me from XSS" — only partly

`HttpOnly` stops an injected script from **stealing** the token and using it later from the attacker's machine.

It does **not** stop the script from **using** the session while it runs in the victim's page: it can just call `fetch('/api/transfer', { method: 'POST' })` and the browser attaches the cookie.

So XSS is still game over for the duration of the visit — `HttpOnly` just limits it to that. Preventing XSS itself (escaping output, CSP) is still your job either way.

### If you use cookies

1. **Set the right flags:**

```http
Set-Cookie: access_token=...;  HttpOnly; Secure; SameSite=Strict; Path=/
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh
```

2. **Scope the refresh cookie to `/auth/refresh`.** If both cookies use `Path=/`, the browser sends the long-lived refresh token on every request, and you lose the exposure benefit from section 4.

3. **Defend against CSRF.** `SameSite=Strict` (or `Lax`) blocks most of it. For extra safety on state-changing endpoints, add a CSRF token or check the `Origin` header.

4. **Keep the frontend and API on the same site.** `app.example.com` and `api.example.com` are the **same site**, so `SameSite` cookies just work. `myapp.com` calling `myapi.io` is **cross-site**: you'd need `SameSite=None` (which reopens CSRF) plus CORS with `Access-Control-Allow-Credentials: true`. At that point the header is usually simpler.

5. **The client gets simpler.** No in-memory token, no request interceptor. Only the `401 → refresh → retry` part stays:

```ts
const api = axios.create({ withCredentials: true });

api.interceptors.response.use(undefined, async (error) => {
  // same single-flight refresh + retry logic as section 8,
  // minus setting the Authorization header
});
```

### Supporting both on the backend

Many APIs accept **either**: the web app uses the cookie, and mobile apps / CLIs / other services use the header.

```ts
function getAccessToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length);
  return req.cookies.access_token;
}
```

The verification after that is identical: check the signature, check `exp`, read the claims.

### So which one?

- **Your own web app, frontend and API on the same site** → `HttpOnly` cookie is a great default. Just don't skip `SameSite`.
- **Mobile apps, CLIs, third-party clients, or an API on a different domain** → `Authorization` header.
- **Both kinds of clients** → accept both, as above.
