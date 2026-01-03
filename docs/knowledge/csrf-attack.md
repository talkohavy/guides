# What is a CSRF attack?

**CSRF** initials are **Cross-Site Request Forgery**.  
It is a web security attack where a malicious website tricks a **logged-in user's browser** into performing an **unintended action** on another website **where the user is already authenticated**.

The **weakness** that is being exploited is in the definition **of how browsers treat cookies**:

> **The browser automatically includes cookies (session/auth cookies) with requests**, even if the request was triggered by a different site.

---

## Example 1: bank transfer (Classic example)

### 1️⃣ Normal behavior

You are logged into your bank:

```
https://bank.com
```

You are authenticated via a cookie:

```
Cookie: session=abc123
```

The bank has an API endpoint called `/transfer`:

```http
POST /transfer
amount=1000&toAccount=9876
```

---

### 2️⃣ Attacker's website

You visit a malicious website:

```
https://evil.com
```

It contains hidden HTML:

```html
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="toAccount" value="9876">
</form>

<script>
  document.forms[0].submit();
</script>
```

---

### 3️⃣ What happens in your browser

- Your browser **automatically includes bank.com cookies**
- The request looks legitimate to the bank
- The transfer happens
- You never clicked “Transfer”

💥 **Attack succeeds**

---

## Why CSRF works

CSRF works because:

- Cookies are **automatically sent**
- The server **cannot tell** whether:
  - the request came from its own UI
  - or from a malicious site

---

## Example 2: changing email/password (also common)

Same idea: let's say facebook has an endpoint `/change-email`:

```http
POST /change-email
email=attacker@example.com
```

If unprotected, an attacker can:

- Change your email
- Reset your password
- Take over your account

---

## When CSRF is possible

CSRF attacks are possible when:

- Authentication uses **cookies** (which it often does)
- The action has **no CSRF protection**
- The browser can send the request automatically

---

## How to prevent a CSRF attack?

### ✅ 1. SameSite cookies

The setting that allows or disallows 3rd-party websites to send cookies on your behalf, is called `SameSite`. And the default setting for `SameSite` is "lax".

By simply changing the value to "Strict", you can prevent CSRF attacks.

```http
Set-Cookie: session=abc123; SameSite=Strict
```

- Browser **won't send cookies** on cross-site requests
- Very effective modern defense

---

### ✅ 2. CSRF tokens (most common)

- Server generates a random token
- Token is embedded in forms / headers
- Server verifies token on every state-changing request

Example:

```html
<input type="hidden" name="csrfToken" value="random123">
```

If the attacker doesn't know the token → request fails.

---

### ✅ 3. Check Origin / Referer headers

Server verifies:

```
Origin: https://bank.com
```

Less reliable, but useful as an extra layer.

They are less reliable because browsers may omit them, and servers must decide what to do then. There could be **legitimate requests** without `referrer`. For example, Opening a link from bookmarks.

Can an attacker fake these headers? ❌ From a normal browser: **NO**

A malicious website cannot arbitrarily set or modify:

- `Origin`
- `Referrer`

Browsers forbid JavaScript from controlling these headers.
