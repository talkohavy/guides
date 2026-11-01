# JWT

What is a JWT? and how does it work?

Let's say John logs in to your application. He sends his email and password, the server checks them, and John is in.

Now John clicks on "My Orders". That's a brand new request. **HTTP doesn't remember anything**, so how does the server know this request is coming from John?

## 1. Sessions

The classic way is a **session**. When John logs in, the server creates a random id, like `a8f3k2`, and saves it in a database together with John's user id. Then it sends this id back to John's browser in a cookie.

On every request, the browser sends the cookie, and the server looks up `a8f3k2` in the database to find out who it belongs to.

It works, but... John is not alone. Thousands of users are clicking around at the same time, and **every single request is one more lookup in the session store**. And if you have servers A, B, C and D behind a load balancer, all of them need access to the same session store, so it becomes one more thing that every request depends on.

So, what if the server didn't have to remember anything at all?

## 2. The idea behind JWT

Instead of giving John an id and saving the data on the server, **the server writes the data itself into the token** and gives it to John:

> "This is user 42, his name is John, his role is user."

Now on every request, John sends this note back, and the server just reads it. No lookup!

But wait... if the data is inside the token, what stops John from changing "role: user" to "role: admin"?

**The signature.** The server signs the note with a secret key that only the server knows. If John changes even one letter, the signature won't match anymore, and the server rejects the token.

This signed note is a **JWT** - **JSON Web Token**.

## 3. What does a JWT look like?

A JWT is just a long string, with 3 parts separated by dots:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJKb2huIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3OTM1NzA0MDAsImV4cCI6MTc5MzU3MTMwMH0.XMCk3v0RQBzvBPK4qZI8Jsi425qDhAS3m2ba2UJYSoU
```

**header.payload.signature**

### - A. Header

The first part is JSON, encoded in **Base64Url**. If you decode it, you get:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

It tells the server **which algorithm was used to sign the token**. You can check it with:

```bash
echo -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" | base64 -d | jq
```

And:

```bash
echo -n "eyJzdWIiOiI0MiIsIm5hbWUiOiJKb2huIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3OTM1NzA0MDAsImV4cCI6MTc5MzU3MTMwMH0=" | base64 -d | jq
```

### - B. Payload

The second part is also Base64Url encoded JSON. This is the actual data, and every field in it is called a **claim**:

```json
{
  "sub": "42",
  "name": "John",
  "role": "user",
  "iat": 1793570400,
  "exp": 1793571300
}
```

- `sub` (subject) - who the token is about, usually the user id
- `iat` (issued at) - when the token was created
- `exp` (expiration) - when the token stops being valid

`name` and `role` are custom claims. You can put anything you want there.

### - C. Signature

The third part is the signature. The server takes the header and the payload, and runs them through **HMAC SHA-256** with its secret key:

```text
signature = HMAC_SHA256(header + "." + payload, secret)
```

## 4. How does the server verify it?

When John sends the token, the server does the exact same calculation again. It takes the header and payload that John sent, signs them with its own secret, and **compares the result with the signature inside the token**.

If they match, the token is legit. If they don't, someone changed something.

Now let's say John decodes the payload, changes `"role": "user"` to `"role": "admin"`, and encodes it back. The payload part of the token now looks different, so when the server recalculates the signature, it gets a completely different value. **And John can't produce the correct signature himself, because he doesn't know the secret.** Rejected ❌.

After making sure the signature is valid, the server also checks that `exp` didn't pass yet. And that's it. **No database, no session store**, just some math on the server's own CPU. That's why JWTs are called **stateless**.

In Node.js, it looks like this:

```js
import jwt from 'jsonwebtoken';

// on login
const token = jwt.sign({ sub: '42', name: 'John', role: 'user' }, SECRET, {
  expiresIn: '15m',
});

// on every request
const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
```

`jwt.verify` throws an error if the signature is wrong, or if the token has expired.

## 5. Signed is not encrypted

Here's the part most people get wrong. **Base64Url is an encoding, not an encryption.** Anyone who has the token can decode the header and the payload, and read everything inside. Go paste any JWT into [jwt.io](https://jwt.io) and you'll see.

The signature only guarantees that **nobody changed the data**. It does not hide the data.

So the mental model is: **a JWT is like a postcard with a wax seal on it**. Everybody can read it, but nobody can change it without breaking the seal.

Therefore, **never put passwords, credit card numbers, or any secret inside the payload**.

## 6. HS256 vs RS256

Now let's say your application grows. You have an auth service that creates the tokens, and also an orders service, a payments service, and a notifications service that all need to verify them.

With **HS256**, the same secret is used to sign **and** to verify. So every service needs a copy of the secret. But this means every service can also **create** tokens. If the notifications service gets hacked, the attacker can now sign a token for any user, with any role.

This is why there's **RS256**. It uses a pair of keys:

- **Private key** - used to **sign**. Only the auth service has it.
- **Public key** - used to **verify**. Anyone can have it, even the whole world.

Now the orders service, the payments service and the notifications service only get the public key. They can check that a token is real, but **they can't create new tokens**. If one of them gets hacked, the attacker only steals a public key, which was public anyway.

Usually the auth service publishes its public keys on a known URL, called **JWKS** (JSON Web Key Set), like `https://auth.example.com/.well-known/jwks.json`, and the other services download the keys from there.

## 7. The catch: you can't take it back

Being stateless is the biggest strength of JWT, but it's also its biggest problem.

Let's say John's token gets stolen, or John gets banned. With sessions, you just delete `a8f3k2` from the database, and John is out on the very next request.

But with a JWT, the server doesn't store anything. **There is nothing to delete.** The token is valid until `exp`, and every server will keep accepting it until then.

So, how do we deal with this?

### - A. Short expiration

**Keep the token alive for a short time**, like 15 minutes. If it gets stolen, it's useless pretty quickly. But now John has to log in again every 15 minutes, which is terrible. That's why we pair it with a **refresh token**, which lets the client get a new JWT without asking John for his password. You can read all about it in [How to use a refresh token?](./how-to-use-a-refresh-token.md).

### - B. Deny list

Keep a list of revoked token ids (the `jti` claim) in Redis, and check it on every request. This works, **but notice what just happened**: we're back to a lookup on every request, which is exactly what JWT was supposed to save us from. So usually you keep this only for rare cases, like a banned user, and rely on short expiration for everything else.

## 8. Common mistakes

### - A. Trusting the "alg" header

The header tells the server which algorithm was used. But the header comes from the client! An attacker can send a token with `"alg": "none"`, and no signature at all. **A badly written server reads the header, sees "none", and skips the verification.**

That's why you should **always tell the library which algorithm you expect**, like `algorithms: ['HS256']` in the example above, and never let the token decide for you.

### - B. Weak secrets

If your HS256 secret is something like `"secret"` or `"123456"`, an attacker can take one token and try millions of secrets per second offline, until the signature matches. Use a long random secret, at least 32 bytes.

### - C. Storing it in localStorage

Any JavaScript running on your page can read localStorage. So if your site has one XSS bug, the attacker's script can read the token and send it to their server. Where to store the token is a whole topic by itself, and it's covered in the [refresh token](./how-to-use-a-refresh-token.md) guide as well.

## 9. Full Mental Model

So here's the full mental model:

**Sessions**: the server keeps the data, and gives you an id. Every request is a lookup.

**JWT**: the server gives you the data itself, with a signature on it. Every request is just a signature check, no lookup.

**The payload is readable by anyone**, the signature only proves nobody changed it.

**HS256** uses one shared secret to sign and verify. **RS256** signs with a private key, and verifies with a public key, so only one service can create tokens.

**You can't revoke a JWT**, so keep it short-lived, and use a refresh token to get a new one.

JWT doesn't make authentication more secure than sessions. What it gives you is the ability to **verify a user anywhere, without asking anyone**.
