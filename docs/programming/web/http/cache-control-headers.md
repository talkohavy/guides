# Cache-Control Headers

The `Cache-Control` HTTP header is the primary mechanism for controlling caching behavior in browsers and intermediate caches (proxies, CDNs). It can be used in both requests and responses to specify exactly how caching should work.

## 1. Basic Syntax

```http
Cache-Control: <directive>, <directive>, ...
```

**Rules:**

- Directives are case-insensitive (but lowercase is recommended)
- Multiple directives are comma-separated
- Some directives take arguments separated by `=`
- Arguments are typically integers without quotes

```http
Cache-Control: max-age=3600, public
Cache-Control: no-cache, must-revalidate
Cache-Control: private, max-age=0
```

## 2. Key Concepts

### A. Cache Types

- **Private Cache**: Browser cache, stores content for a single user
- **Shared Cache**: Proxy/CDN cache, stores content for multiple users
- **Origin Server**: The original source of the content

### B. Response States

- **Fresh**: Response can be used without validation
- **Stale**: Response is outdated and should be validated
- **Age**: Time since response was generated on origin server

### C. Cache Operations

- **Store**: Save response in cache
- **Reuse**: Serve cached response without contacting origin
- **Revalidate**: Check with origin if cached response is still valid

## 3. Response Directives

These directives are sent by the server to control how responses are cached.

### A. Freshness Control

#### `max-age=<seconds>`

Sets how long the response remains fresh.

```http
Cache-Control: max-age=3600  # Fresh for 1 hour
```

**Key points:**

- Most important caching directive
- If not set, defaults to browser's heuristics
- Time is calculated from when response was generated, not received
- Value is in seconds
- Negative values or non-integers are treated as `0`

#### `s-maxage=<seconds>`

Like `max-age` but only for shared caches. Overrides `max-age` for proxies/CDNs.

```http
Cache-Control: max-age=300, s-maxage=3600  # 5 min for browsers, 1 hour for CDNs
```

### B. Storage Control

#### `no-store`

Prevents any caching whatsoever. Response is not stored anywhere.

```http
Cache-Control: no-store  # Never cache this response
```

**Use for:** Sensitive data, personal information, payment details

#### `no-cache`

⚠️ **Common misconception**: This does NOT mean "don't cache"!

Actually means: "Cache it, but always validate with origin before reuse"  
Another phrase: "Never serve **fresh** response without first validating it with the server"

```http
Cache-Control: no-cache  # Cache but always revalidate
```

#### `private`

Response can only be cached by private caches (browsers), not shared caches.

```http
Cache-Control: private  # Only browsers can cache this
```

**Use for:** User-specific content, personalized responses

#### `public`

Response can be cached by any cache, even when normally it wouldn't be (e.g., with `Authorization` header).

```http
Cache-Control: public, max-age=3600
```

### C. Validation Control

**⚠️ Common Misconception: When Do Browsers Actually Validate?**

Many developers believe that browsers never revalidate fresh responses unless explicitly told to with `no-cache`. This is not entirely accurate. **Browsers may choose to validate even fresh responses** in several scenarios:

- **User-initiated refresh** (F5) - Browser often validates regardless of freshness
- **Force refresh** (Ctrl+F5/Cmd+Shift+R) - Always validates with `no-cache` or `max-age=0`
- **Navigation from address bar** - Some browsers validate more aggressively
- **Heuristic decisions** - Based on resource type, user patterns, or browser policies
- **Memory pressure** - When cache is full, browsers may validate before serving

The key difference is that validation directives like `must-revalidate` **only** control what happens to **stale** responses (they must be validated before reuse), while fresh responses can still be served directly from cache. However, browsers may still choose to validate fresh responses in certain user-initiated scenarios regardless of cache directives.

#### `must-revalidate`

When a response is considered stale, and only when a response is considered stale, adding the `must-revalidate` header tells the browser the response MUST be validated before reuse. Without `must-revalidate`, HTTP caches are allowed to serve stale responses in certain situations (like when disconnected from the origin server).
**Never** use `must-revalidate` together with one of: `no-cache`, `no-store`.  
Why?  
In case of `no-cache`, you're always validating already, even when fresh, so there's nothing to re-validate.
And in case of `no-store`, it should be pretty obvious, that if you don't store anything, what is there to re-validate? Nothing.

```http
# ❌ CONFLICTING: Can't validate what you can't store
Cache-Control: no-store, must-revalidate

# ❌ MEANINGLESS: Can't revalidate if you always validate
Cache-Control: no-cache, must-revalidate
```

#### `proxy-revalidate`

Like `must-revalidate` but only applies to shared caches.  
**Never** use it together with: `private`, since it's contradicting. You're telling shared caches "Don't store any responses, and revalidate the one you do".

```http
# ❌ REDUNDANT: Private already prevents proxy caching
Cache-Control: private, proxy-revalidate
```

### D. Advanced Directives

#### `immutable`

Adding this header to a response tells the browser: "Never validate this response while it's fresh". When is it useful? If your resources include cache busting in their name already, there's (near) zero chance that they'll produce the same cache busting id. This header prevents unnecessary revalidation on browser refresh.

**When to use:** Only for resources where the URL guarantees the content will never change - typically achieved through cache busting in the filename:

1. versioning
2. hashing
3. timestamps

```http
Cache-Control: max-age=31536000, immutable  # Perfect for static assets with versioning
```

**Examples of good candidates:**

- `app.v1.2.3.js` (semantic versioning)
- `bundle.abc123def.js` (content hash)
- `styles.20240928.css` (build timestamp)

**⚠️ Never use on non-versioned resources** like `main.js`, `remoteEntry.js`, or `app.css` - these filenames might serve different content after deployments, and users would be stuck with outdated cached versions until the cache expires.

#### `stale-while-revalidate=<seconds>`

Allows serving stale content while fetching fresh content in background.

```http
Cache-Control: max-age=3600, stale-while-revalidate=86400
# Fresh for 1 hour, can serve stale for 24 hours while revalidating
```

#### `stale-if-error=<seconds>`

Allows serving stale content when origin server returns an error (500, 502, 503, 504).

```http
Cache-Control: max-age=3600, stale-if-error=86400
# If server errors, can serve stale content for 24 hours
```

#### `no-transform`

Prevents intermediaries from modifying the response content.

```http
Cache-Control: no-transform  # Don't compress, convert, or modify
```

## 4. Request Directives

These directives are sent by clients to control caching behavior for their requests.

#### `no-cache`

Client wants the freshest possible response, bypass cache.

```http
Cache-Control: no-cache  # Force revalidation
```

**Used by:** Browser force-refresh (Ctrl+F5)

#### `no-store`

Client doesn't want request/response to be stored in any cache.

#### `max-age=<seconds>`

Client will accept cached response up to this age.

```http
Cache-Control: max-age=0  # Equivalent to no-cache for older proxies
```

#### `max-stale=<seconds>`

Client will accept stale responses up to this additional time.

```http
Cache-Control: max-stale=3600  # Accept responses stale up to 1 hour
```

#### `min-fresh=<seconds>`

Client wants responses that will remain fresh for at least this long.

```http
Cache-Control: min-fresh=600  # Must be fresh for at least 10 more minutes
```

#### `only-if-cached`

Client only wants cached responses, return 504 if nothing cached.

## 5. Practical Examples

### Static Assets (CSS, JS, Images)

```http
# For versioned static assets
Cache-Control: public, max-age=31536000, immutable

# For non-versioned static assets
Cache-Control: public, max-age=3600
```

### API Responses

```http
# Public API data that changes infrequently
Cache-Control: public, max-age=300

# Private user data
Cache-Control: private, max-age=300

# Real-time data
Cache-Control: no-cache

# Sensitive data
Cache-Control: no-store
```

### HTML Pages

```http
# Static pages
Cache-Control: public, max-age=3600

# Dynamic pages with cache busting
Cache-Control: no-cache

# Personalized pages
Cache-Control: private, max-age=0, must-revalidate
```

## 6. Common Patterns

### Cache Busting Pattern

For static assets, use versioning in URLs:

```html
<!-- HTML (always revalidate) -->
<script src="/app.v1.2.3.js"></script>
<link rel="stylesheet" href="/styles.abc123.css">
```

```http
# HTML response
Cache-Control: no-cache

# Static assets response
Cache-Control: public, max-age=31536000, immutable
```

### Progressive Enhancement

```http
# Serve stale while updating
Cache-Control: max-age=300, stale-while-revalidate=3600

# Fallback to stale on errors
Cache-Control: max-age=300, stale-if-error=3600
```

### CDN Optimization

```http
# Different TTLs for browser vs CDN
Cache-Control: max-age=300, s-maxage=3600
```

## 7. Best Practices

### ✅ Do's

1. **Always specify Cache-Control** - Don't rely on heuristic caching
2. **Use versioning for static assets** - Enables aggressive caching with `immutable`
3. **Use appropriate TTLs** - Balance freshness vs performance
4. **Consider user experience** - Use `stale-while-revalidate` for better UX
5. **Secure sensitive data** - Use `no-store` for private information

### ❌ Don'ts

1. **Don't use `no-cache` when you mean `no-store`**
2. **Don't cache personalized content in shared caches**
3. **Don't use long TTLs without versioning**
4. **Don't ignore mobile users** - Consider data usage
5. **Don't forget about intermediate caches**

### Quick Reference

| Use Case          | Directive                                          |
| ----------------- | -------------------------------------------------- |
| Never cache       | `no-store`                                         |
| Always revalidate | `no-cache`                                         |
| Cache for 1 hour  | `max-age=3600`                                     |
| Private only      | `private, max-age=3600`                            |
| Static assets     | `public, max-age=31536000, immutable`              |
| API responses     | `public, max-age=300, stale-while-revalidate=3600` |
| CDN optimization  | `max-age=300, s-maxage=3600`                       |
| Error resilience  | `max-age=300, stale-if-error=3600`                 |

### Testing Your Cache Headers

```bash
# Check headers with curl
curl -I https://example.com/api/data

# Check with browser dev tools
# Network tab → Response Headers → Cache-Control
```

Remember: Caching is about finding the right balance between performance and freshness for your specific use case!

## 8. Use Cases

**Correct Combinations:**

```http
# ✅ GOOD: Cache privately, re-use when fresh, validate when stale
Cache-Control: private, max-age=3600, must-revalidate

# ✅ GOOD: re-use when fresh, re-use when stale, and validate when convenient
Cache-Control: max-age=300, stale-while-revalidate=3600

# ✅ GOOD: Public caching with proxy validation
Cache-Control: public, max-age=300, s-maxage=3600, proxy-revalidate
```

## 999. Directive Conflicts

**⚠️ Important: Directive Conflicts and Interactions**

Before diving into validation directives, it's crucial to understand how they interact with storage control directives. Mixing incompatible directives can lead to unexpected behavior or the most restrictive directive taking precedence.

**Common Problematic Combinations:**

**What Actually Happens:**

1. **`no-store` with any validation directive** → `no-store` wins, response is never cached, validation directives are ignored
2. **`no-cache` with `must-revalidate`** → Redundant, `no-cache` already forces validation
3. **`private` with `proxy-revalidate`** → `proxy-revalidate` is ignored since proxies can't cache private responses
4. **Conflicting max-age values** → Most restrictive (lowest) value is typically honored

**Best Practice:** Always think about the complete caching lifecycle when combining directives. Ask yourself: "Can this response be stored? How long is it fresh? What happens when it becomes stale?"
