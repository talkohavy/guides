# strings

## 1. What is `strings`?

`strings` is the package for **working with text**: searching, splitting, joining, replacing, trimming and changing case.

```go
import "strings"
```

If you're coming from JavaScript, this is where all the string methods went. In JS you write `str.toUpperCase()`. In Go, strings have no methods, so you write `strings.ToUpper(str)` instead.

### - A. Strings are immutable

Every function in this package **returns a new string**. None of them change the original. In fact, you can't change a string in Go at all:

```go
s := "hello"
s[0] = 'H' // <--- Error! ❌ cannot assign to s[0] (neither addressable nor a map index expression)
```

(Notice the single quotes in `'H'`. In Go, single quotes mean a single character, called a **rune**, while double quotes mean a string. See [Data Types](../data-types.md#4-runes-characters).)

So instead, you build a new string:

```go
s = strings.ToUpper(s[:1]) + s[1:] // <--- "Hello"
```

---

## 2. Searching

### - A. `Contains`

Checks whether a string contains another string:

```go
strings.Contains("Hello, World", "World") // <--- true
strings.Contains("Hello, World", "world") // <--- false (case-sensitive!)
```

### - B. `HasPrefix` & `HasSuffix`

Check how a string starts or ends (like JavaScript's `startsWith` and `endsWith`):

```go
strings.HasPrefix("Hello, World", "Hello") // <--- true
strings.HasSuffix("photo.jpg", ".jpg")     // <--- true
```

### - C. `Index`

Returns the position of the first match, or **`-1` if there's no match**:

```go
strings.Index("Hello, World", "o")     // <--- 4
strings.LastIndex("Hello, World", "o") // <--- 8
strings.Index("Hello, World", "z")     // <--- -1
```

### - D. `Count`

Counts how many times a string appears:

```go
strings.Count("cheese", "e") // <--- 3
```

---

## 3. Splitting & joining

### - A. `Split`

Splits a string by a separator, and returns a slice of the parts:

```go
strings.Split("a,b,c", ",") // <--- ["a" "b" "c"]
```

**Watch out for two edge cases:**

```go
strings.Split("a,,b", ",") // <--- ["a" "" "b"] (empty parts are kept)
strings.Split("", ",")     // <--- [""] ❗ a slice with ONE empty string, not an empty slice
```

That second one is a classic bug: `len(strings.Split("", ","))` is `1`, not `0`.

### - B. `Fields`

Splits a string by **whitespace** (spaces, tabs, newlines), and ignores any extra whitespace:

```go
strings.Fields("  Tal   Kohavy \n") // <--- ["Tal" "Kohavy"]
```

**When to use which:** use `Fields` to split words. Use `Split` when you have a specific separator, like a comma in a CSV line.

### - C. `Cut`

Splits a string **in two**, around the first occurrence of a separator. Perfect for `key=value` pairs:

```go
key, value, found := strings.Cut("name=Tal", "=")
fmt.Println(key, value, found) // <--- name Tal true

_, _, found = strings.Cut("nothing here", "=")
fmt.Println(found) // <--- false
```

### - D. `Join`

The opposite of `Split`. Glues a slice of strings together, with a separator between them:

```go
strings.Join([]string{"a", "b", "c"}, "-") // <--- "a-b-c"
```

---

## 4. Replacing

```go
strings.ReplaceAll("oink oink oink", "oink", "moo") // <--- "moo moo moo"
strings.Replace("oink oink oink", "oink", "moo", 2) // <--- "moo moo oink"
```

`Replace` takes one extra argument: **how many** matches to replace. `ReplaceAll` replaces all of them.

---

## 5. Changing case & comparing

```go
strings.ToUpper("hello") // <--- "HELLO"
strings.ToLower("HeLLo") // <--- "hello"
```

To compare two strings **ignoring case**, use `EqualFold`:

```go
strings.EqualFold("Go", "GO") // <--- true
```

It's better than `strings.ToLower(a) == strings.ToLower(b)`, because it doesn't need to create two new strings just to compare them.

---

## 6. Trimming

### - A. `TrimSpace`

Removes whitespace from both ends. **You'll use this all the time**, especially on user input:

```go
strings.TrimSpace("  \t hello \n ") // <--- "hello"
```

### - B. `TrimPrefix` & `TrimSuffix`

Remove a specific string from the start or the end (if it's there):

```go
strings.TrimPrefix("v1.2.3", "v")       // <--- "1.2.3"
strings.TrimSuffix("photo.jpg", ".jpg") // <--- "photo"
```

### - C. Gotcha: `Trim` / `TrimLeft` work on characters, not strings

```go
strings.Trim("!!hello!!", "!") // <--- "hello"
```

That looks fine. But the second argument of `Trim`, `TrimLeft` and `TrimRight` is a **set of characters** to remove, not a string:

```go
strings.TrimLeft("abcabc-x", "abc")   // <--- "-x" ❗ removes every a, b and c from the left
strings.TrimPrefix("abcabc-x", "abc") // <--- "abc-x" (removes "abc" only once)
```

**If you want to remove a specific word, use `TrimPrefix` / `TrimSuffix`**, not `TrimLeft` / `TrimRight`.

---

## 7. `Repeat`

```go
strings.Repeat("-", 10) // <--- "----------"
```

---

## 8. `strings.Builder`: building a string piece by piece

### - A. Why?

Since strings are immutable, every `+` creates a brand new string. Doing that in a loop with many iterations is slow:

```go
result := ""
for i := 0; i < 10000; i++ {
    result += "x" // <--- creates a new string on every iteration
}
```

**How slow?** Each `+` copies **everything built so far** into the new string. So the 1st iteration copies 1 byte, the 2nd copies 2, the 3rd copies 3, and so on. That adds up to O(n²).

Here's a benchmark, joining 10-character names with `str = str + name + "\n"` vs. a `strings.Builder`:

| Names  | `+` in a loop          | `strings.Builder`      |
| ------ | ---------------------- | ---------------------- |
| 10     | 0.27 µs                | 0.10 µs                |
| 100    | 7 µs                   | 0.8 µs                 |
| 1,000  | 559 µs                 | 7.9 µs                 |
| 10,000 | 41.7 ms (582 MB alloc) | 0.08 ms (0.5 MB alloc) |

With 10 items, the difference doesn't matter. With 10,000, `+` is about 500x slower, and allocates over half a gigabyte of throwaway strings to build a 110 KB result.

**Coming from JavaScript?** There, `str += x` in a loop is usually fast, because JS engines secretly optimize it. Go doesn't: every `+` really copies.

### - B. Using a `Builder`

A `strings.Builder` collects the pieces efficiently, and builds the final string once, at the end:

```go
var sb strings.Builder

for i := 0; i < 3; i++ {
    fmt.Fprintf(&sb, "item%d ", i)
}
sb.WriteString("done")

fmt.Println(sb.String()) // <--- item0 item1 item2 done
```

Notice that you can pass a `Builder` to `fmt.Fprintf`, because a `Builder` is something you can write to (see [fmt](./fmt.md)).

**When to use it:** when you build a string inside a loop. For joining a few strings once, plain `+` (or `Sprintf`) is perfectly fine.

---

## 9. Cheat sheet

| Function                        | What it does                                  |
| ------------------------------- | --------------------------------------------- |
| `Contains(s, sub)`              | Does `s` contain `sub`?                       |
| `HasPrefix(s, p)` / `HasSuffix` | Does `s` start / end with it?                 |
| `Index(s, sub)`                 | Position of `sub`, or `-1`                    |
| `Count(s, sub)`                 | How many times `sub` appears                  |
| `Split(s, sep)`                 | Split by a separator                          |
| `Fields(s)`                     | Split by whitespace                           |
| `Cut(s, sep)`                   | Split in two around the first `sep`           |
| `Join(parts, sep)`              | Glue a slice of strings together              |
| `Replace` / `ReplaceAll`        | Replace some / all matches                    |
| `ToUpper` / `ToLower`           | Change case                                   |
| `EqualFold(a, b)`               | Compare, ignoring case                        |
| `TrimSpace(s)`                  | Remove whitespace from both ends              |
| `TrimPrefix` / `TrimSuffix`     | Remove a specific string from the start / end |
| `Repeat(s, n)`                  | Repeat `s` n times                            |
| `strings.Builder`               | Build a string efficiently, piece by piece    |
