# Logical Operators

## 1. The Operators

The usual ones: `&&`, `||`, `!`

```go
if isLoggedIn && !isBanned || isAdmin {
    // ...
}
```

---

## 2. Short-circuit evaluation

Works as you'd expect.

```go
if user != nil && user.IsActive {
    // safe - user.IsActive is never evaluated when user is nil
}
```

---

## 3. Quirk #1: No truthiness

Operands **must** be of type `bool`. `0`, `""`, `nil`, and empty slices are **not** falsy. They're compile errors.

```go
count := 5

if count { }       // ❌ compile error: non-boolean condition
if !count { }      // ❌ compile error
if count > 0 { }   // ✅

if err { }         // ❌
if err != nil { }  // ✅
```

---

## 4. Quirk #2: The result is always a `bool`

The operand `||` **only works on boolean expressions**.

Which means, `a || b` always returns `true`/`false`. It can never return one of the operands, as it would just not compile. So the JavaScript/Python default-value trick doesn't exist:

```go
// Wanting to get either the user `input`,
// and if not defined, set default value of "anonymous":
name := input || "anonymous" // ❌ compile error
```

Do it explicitly:

```go
name := input
if name == "" {
    name = "anonymous"
}
```

---

## 5. Quirk #3: No ternary operator

There's no `cond ? a : b`.

Use an `if`/`else` (same pattern as above). This is a deliberate design choice, not an oversight.

---

## 6. Quirk #4: No logical XOR, no compound assignment

There's no `^^`, and no `&&=` / `||=`.

The get XOR behavior, just use the "not equals" check `!=`:

```go
if hasEmail != hasPhone {
    // exactly one of them is true
}
```

---

## 7. Don't confuse with bitwise operators

`&`, `|`, `^` are bitwise and work on integers only (no non-short-circuiting `&` on bools like in Java/C#).

Two Go-specific ones:

- `^x` (unary) is bitwise NOT. There is no `~`.
- `&^` is AND NOT (bit clear): `a &^ b` clears the bits in `a` that are set in `b`.
