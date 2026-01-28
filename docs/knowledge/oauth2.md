# Everything about OAuth 2.0

## 1. what is OAuth 2.0?

> **OAuth 2.0 is an authorization framework that lets a user grant a third-party application limited access to a resource, without sharing their credentials.**

Key words:

- **authorization** (not authentication)
- **limited access**
- **no credential sharing**

If a definition doesn’t include those ideas, it’s incomplete.

---

## 2. What problem OAuth 2.0 actually solves?

Before OAuth:

> “Hey Google, give this random app my password so it can read my emails.”

That’s obviously terrible.

OAuth2 solves:

- **Delegated access**
- **Scoped access**
- **Revocable access**

Without:

- giving away your password
- letting the app do _everything_

---

## 3. The 4 core roles

OAuth2 is easiest to define by its **actors**:

### 1️⃣ Resource Owner

👉 The user

> “I own the data”

---

### 2️⃣ Client

👉 The app requesting access

> “I want to access your data on your behalf”

Examples:

- GitHub OAuth app
- Google login button
- A CLI tool

---

### 3️⃣ Authorization Server

👉 Issues tokens

> “I authenticate users and issue access”

Examples:

- Google Accounts
- GitHub OAuth
- Auth0
- Keycloak

---

### 4️⃣ Resource Server

👉 Hosts protected APIs

> “I accept tokens and serve data”

Examples:

- Google Drive API
- GitHub API
- Your backend

⚠️ Authorization Server and Resource Server **may be the same system**, but conceptually they are different.

---

## 4. What OAuth2 is **NOT**

This clears up most confusion.

❌ OAuth2 is **not**:

- a login system
- an authentication protocol
- a token format
- JWT
- a session replacement

OAuth2 **does not tell you who the user is**.

It only says:

> “This client is allowed to do X on resource Y.”

---

## 5. So what does OAuth2 actually define?

OAuth2 defines:

1. **How a client asks for permission**
2. **How a user approves that request**
3. **How the client gets a token**
4. **How the token is used to access resources**

It does **not** define:

- how users log in
- what tokens look like
- how tokens are validated internally

---

## The central idea: tokens

OAuth2 introduces **access tokens**:

> A token represents **delegated authorization**.

Properties:

- Limited scope
- Limited lifetime
- Revocable
- Not a password

The token says:

```text
Client X may perform actions A, B, C on behalf of User U
```

---

## OAuth2 is a framework, not a protocol

This is subtle but important.

OAuth2:

- defines **flows** (called _grant types_)
- defines **roles and endpoints**
- leaves many details intentionally open

That’s why:

- implementations vary
- security pitfalls exist
- standards like **OpenID Connect** were added later

---

## Common OAuth2 grant types (high-level)

| Grant              | Used for               |
| ------------------ | ---------------------- |
| Authorization Code | Web apps, SPAs, mobile |
| Client Credentials | Machine → machine      |
| Device Code        | TVs, CLIs              |
| Refresh Token      | Long-lived access      |

(We’ll zoom into these later.)

---

## Why OAuth2 often _looks_ like login

Because people misuse it for authentication.

Example:

> “Login with Google”

What’s really happening:

- OAuth2 grants access to Google APIs
- Plus **OpenID Connect** adds identity info

OAuth2 alone does **not** say:

> “This is user 123”

That’s OIDC’s job.

---

## Minimal mental model (keep this)

> OAuth2 answers:
> **“Can this app do this action on that resource?”**
>
> It does **not** answer:
> **“Who is the user?”**
