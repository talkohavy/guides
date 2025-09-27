# Cache-Control Headers

The `Cache-Control` HTTP header is the primary mechanism for controlling caching behavior in browsers and intermediate caches (proxies, CDNs). It can be used in both requests and responses to specify exactly how caching should work.

## Table of Contents

- [Basic Syntax](#basic-syntax)
- [Key Concepts](#key-concepts)
- [Response Directives](#response-directives)
- [Request Directives](#request-directives)
- [Practical Examples](#practical-examples)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)

## Basic Syntax

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

## Key Concepts

### Cache Types

- **Private Cache**: Browser cache, stores content for a single user
- **Shared Cache**: Proxy/CDN cache, stores content for multiple users
- **Origin Server**: The original source of the content

### Response States

- **Fresh**: Response can be used without validation
- **Stale**: Response is outdated and should be validated
- **Age**: Time since response was generated on origin server

### Cache Operations

- **Store**: Save response in cache
- **Reuse**: Serve cached response without contacting origin
- **Revalidate**: Check with origin if cached response is still valid

## Response Directives

These directives are sent by the server to control how responses are cached.

### Freshness Control

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

### Storage Control

#### `no-store`

Prevents any caching whatsoever. Response is not stored anywhere.

```http
Cache-Control: no-store  # Never cache this response
```

**Use for:** Sensitive data, personal information, payment details

#### `no-cache`

⚠️ **Common misconception**: This does NOT mean "don't cache"!

Actually means: "Cache it, but always validate with origin before reuse"

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

### Validation Control

**⚠️ Important: Directive Conflicts and Interactions**

Before diving into validation directives, it's crucial to understand how they interact with storage control directives. Mixing incompatible directives can lead to unexpected behavior or the most restrictive directive taking precedence.

**Common Problematic Combinations:**

```http
# ❌ CONFLICTING: Can't validate what you can't store
Cache-Control: no-store, must-revalidate

# ❌ MEANINGLESS: Can't revalidate if you always validate
Cache-Control: no-cache, must-revalidate

# ❌ REDUNDANT: Private already prevents proxy caching
Cache-Control: private, proxy-revalidate
```

**What Actually Happens:**

1. **`no-store` with any validation directive** → `no-store` wins, response is never cached, validation directives are ignored
2. **`no-cache` with `must-revalidate`** → Redundant, `no-cache` already forces validation
3. **`private` with `proxy-revalidate`** → `proxy-revalidate` is ignored since proxies can't cache private responses
4. **Conflicting max-age values** → Most restrictive (lowest) value is typically honored

**Correct Combinations:**

```http
# ✅ GOOD: Cache privately, re-use when fresh, validate when stale
Cache-Control: private, max-age=3600, must-revalidate

# ✅ GOOD: re-use when fresh, re-use when stale, and validate when convenient
Cache-Control: max-age=300, stale-while-revalidate=3600

# ✅ GOOD: Public caching with proxy validation
Cache-Control: public, max-age=300, s-maxage=3600, proxy-revalidate
```

**Best Practice:** Always think about the complete caching lifecycle when combining directives. Ask yourself: "Can this response be stored? How long is it fresh? What happens when it becomes stale?"

#### `must-revalidate`

When response becomes stale, it MUST be validated before reuse. Prevents serving stale content when disconnected.  
As mentioned above, **never** use if you already used one of: `no-cache` | `no-store`.  
Why?  
In case of `no-cache`, you're always validating already, even when fresh, so there's nothing to re-validate.
And in case of `no-store`, it should be pretty obvious, that if you don't store anything, what is there to re-validate? Nothing.

```http
Cache-Control: max-age=3600, must-revalidate
```

#### `proxy-revalidate`

Like `must-revalidate` but only applies to shared caches.

### Advanced Directives

#### `immutable`

Response will never change while fresh. Prevents unnecessary revalidation on browser refresh.

```http
Cache-Control: max-age=31536000, immutable  # Perfect for static assets with versioning
```

**Use for:** Versioned static assets (`app.v1.2.3.js`, `image.abc123.png`)

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

## Request Directives

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

## Practical Examples

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

## Common Patterns

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

## Best Practices

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
