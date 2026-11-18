# Day-to-Day Recipes

## 1. Converting between types

### - A. String to number

```go
import "strconv"

n, err := strconv.Atoi("42")          // <--- string to int: 42
f, err := strconv.ParseFloat("3.5", 64) // <--- string to float64: 3.5
```

**JS:** `Number("42")` / `parseInt("42")` / `parseFloat("3.5")`.

Unlike JS, there's no `NaN` when it fails. You get an **error**, and you should always check it:

```go
age, err := strconv.Atoi(input)
if err != nil {
    fmt.Println("not a number:", input)
    return
}
```

**Tip:** user input often has spaces or a newline around it, and `Atoi` rejects those. Clean it first with `strings.TrimSpace(input)`.

More in [strconv](./strconv.md).

### - B. Number to string

```go
i := 42

strconv.Itoa(i)                   // "42" – the usual choice
strconv.FormatInt(int64(i), 10)   // "42" – what Itoa does under the hood
strconv.FormatInt(int64(i), 2)    // "101010" – any base from 2 to 36
strconv.FormatUint(uint64(i), 16) // "2a" – for unsigned types
fmt.Sprint(i)                     // "42" – works on any type, but slower
fmt.Sprintf("%05d", i)            // "00042" – when you need formatting

buf := strconv.AppendInt(nil, int64(i), 10) // []byte("42")
```

**JS:** `String(42)` / `(42).toString()` / `(3.14159).toFixed(2)`.

**Never use `string(42)`.** It compiles, but it treats the number as a character code, and gives you `"*"`, not `"42"`.

### - C. Int to float, and float to int

```go
i := 7
f := float64(i) // <--- 7.0

f = 3.99
int(f)             // <--- 3 ❗ chops off the decimal part, does NOT round
int(math.Round(f)) // <--- 4
```

**Do not use `int()` to floor!** Why? because converting a float to an int always _**truncates toward zero**_!

- Case 1: `3.99` becomes `3`, same as floor.
- Case 2: `-3.99` becomes `-3`, different from floor, where it's `-4`.

### - D. Go never mixes number types for you

In JS, all numbers are the same type. In Go, `int` and `float64` are different types, and **Go won't combine them automatically**:

```go
a := 7
price := 2.5

total := a * price // <--- Error! ❌
```

> invalid operation: a \* price (mismatched types int and float64)

Convert one side yourself:

```go
total := float64(a) * price // <--- 17.5 ✅
```

---

## 2. Building strings with variables

### - A. You can't `+` a number to a string

```go
age := 30
msg := "age: " + age // <--- Error! ❌
```

> invalid operation: "age: " + age (mismatched types untyped string and int)

In JS, `"age: " + 30` silently converts the number. Go doesn't.

### - B. Which way should I use?

```go
first, last, age := "Tal", "Kohavy", 30

// 1. `+`: when everything is already a string
full := first + " " + last // <--- "Tal Kohavy"

// 2. fmt.Sprintf: when you mix types, or need formatting
msg := fmt.Sprintf("%s is %d years old", first, age) // <--- "Tal is 30 years old"

// 3. strings.Join: when you have a slice of strings
csv := strings.Join([]string{"a", "b", "c"}, ",") // <--- "a,b,c"

// 4. strings.Builder: when you build a string inside a loop
var sb strings.Builder
for _, name := range names {
    sb.WriteString(name)
    sb.WriteString("\n")
}
result := sb.String()
```

**The short version:**

- **All strings, a few pieces?** Use `+`. It's the simplest and the fastest.
- **Numbers, or other types mixed in?** Use `fmt.Sprintf`. It's Go's closest thing to JS template strings (`` `${first} is ${age} years old` ``). It's slower than `+`, but that only matters in hot loops.
- **A slice of strings?** Use `strings.Join`.
- **Building in a loop?** Use `strings.Builder`. Using `+=` in a loop creates a new string on every iteration.

More in [fmt](./fmt.md) and [strings](./strings.md).

---

## 3. Math

### - A. Max / min of two numbers

```go
max(3, 9)      // <--- 9
min(3, 9)      // <--- 3
max(3, 9, 7)   // <--- 9 (any number of values)
max(2.5, 1.0)  // <--- 2.5 (works on floats too)
```

**JS:** `Math.max(3, 9)`.

These are [built-in functions](./builtins.md), so there's nothing to import. For the max of a **slice**, use `slices.Max(nums)` (JS: `Math.max(...nums)`).

### - B. Floor, ceil & round

```go
import "math"

math.Floor(2.7)  // <--- 2
math.Ceil(2.1)   // <--- 3
math.Round(2.5)  // <--- 3
math.Trunc(-2.7) // <--- -2
```

| JS              | Go              |
| --------------- | --------------- |
| `Math.floor(x)` | `math.Floor(x)` |
| `Math.ceil(x)`  | `math.Ceil(x)`  |
| `Math.round(x)` | `math.Round(x)` |
| `Math.trunc(x)` | `math.Trunc(x)` |

They all take and return a **`float64`**. To get an `int` out: `int(math.Round(x))`.

**Rounding to 2 decimal places:**

```go
x := 3.14159

fmt.Sprintf("%.2f", x)     // <--- "3.14" (for displaying)
math.Round(x*100) / 100    // <--- 3.14 (when you need the number itself)
```

**Careful with negative halves:** JS's `Math.round(-2.5)` gives `-2`, but Go's `math.Round(-2.5)` gives `-3` (Go rounds halves away from zero).

### - C. Absolute value

```go
math.Abs(-5.5) // <--- 5.5
```

**JS:** `Math.abs(-5.5)`.

`math.Abs` only accepts a `float64`. Passing an `int` doesn't compile:

> cannot use n (variable of type int) as float64 value in argument to math.Abs

There's no `Abs` for integers in the standard library, so for ints, just write it:

```go
if n < 0 {
    n = -n
}
```

### - D. Power (like `r²`)

Go has **no power operator**. There's no `**` like in JS.

```go
r * r           // <--- r²: for squares, just multiply (fastest and simplest)
math.Pow(r, 3)  // <--- r³: for anything else
math.Pow(2, 10) // <--- 1024
```

**JS:** `r ** 2` / `Math.pow(r, 2)`.

`math.Pow` works with `float64`. For an `int` result: `int(math.Pow(2, 10))`.

**Gotcha: `^` is NOT power!** In Go, `^` is the bitwise XOR operator:

```go
2 ^ 3 // <--- 1 ❗ (not 8)
```

It compiles without any warning, so this bug is easy to miss.

### - E. Dividing two ints

**Dividing an `int` by an `int` gives an `int`. The decimal part is dropped**:

```go
a, b := 7, 2

a / b                    // <--- 3 ❗
float64(a) / float64(b)  // <--- 3.5 ✅
float64(a / b)           // <--- 3 ❗ too late, the division already happened between ints
```

**Convert each side before dividing**, not the result after.

A common real-world case, calculating a percentage:

```go
done, total := 3, 8

float64(done) / float64(total) * 100 // <--- 37.5
done * 100 / total                   // <--- 37 (if a whole number is all you need)
```

### - F. Remainder & even / odd

```go
7 % 3      // <--- 1
n%2 == 0   // <--- is n even?
n%2 != 0   // <--- is n odd?
```

**Use `n%2 != 0` for odd, not `n%2 == 1`.** For negative numbers, the remainder is negative: `-7 % 2` is `-1`, so `n%2 == 1` would say that `-7` isn't odd.

### - G. Random number in a range

```go
import "math/rand/v2"

rand.IntN(10)              // <--- 0 to 9
rand.IntN(max-min+1) + min // <--- min to max (both included)
```

**JS:** `Math.floor(Math.random() * 10)`.

More in [math](./math.md).

---

## 4. Strings

### - A. The JS string methods, in Go

In Go, strings have no methods. The functions live in the [strings](./strings.md) package instead:

| JS                       | Go                                |
| ------------------------ | --------------------------------- |
| `s.length`               | `len(s)` (bytes, not characters!) |
| `s.includes("x")`        | `strings.Contains(s, "x")`        |
| `s.startsWith("x")`      | `strings.HasPrefix(s, "x")`       |
| `s.endsWith("x")`        | `strings.HasSuffix(s, "x")`       |
| `s.indexOf("x")`         | `strings.Index(s, "x")`           |
| `s.split(",")`           | `strings.Split(s, ",")`           |
| `arr.join(",")`          | `strings.Join(arr, ",")`          |
| `s.trim()`               | `strings.TrimSpace(s)`            |
| `s.toUpperCase()`        | `strings.ToUpper(s)`              |
| `s.toLowerCase()`        | `strings.ToLower(s)`              |
| `s.replaceAll("a", "b")` | `strings.ReplaceAll(s, "a", "b")` |
| `s.repeat(3)`            | `strings.Repeat(s, 3)`            |

### - B. Looping over the characters of a string

Use `range`. It gives you each **character** (a `rune`), along with its byte position:

```go
for i, ch := range "héllo" {
    fmt.Print(i, ":", string(ch), " ")
}
// 0:h 1:é 3:l 4:l 5:o
```

Notice the index jumps from `1` to `3`, because `é` takes 2 bytes.

**Don't use `s[i]` to get a character.** Indexing a string gives you a single **byte**, which breaks on anything that isn't plain English:

```go
s := "héllo"
s[1]         // <--- 195 (a byte, not a character)
string(s[1]) // <--- "Ã" ❗ (half of the "é")
```

---

## 5. Slices & maps

### - A. The JS array methods, in Go

| JS                  | Go                                 |
| ------------------- | ---------------------------------- |
| `arr.length`        | `len(arr)`                         |
| `arr.push(x)`       | `arr = append(arr, x)`             |
| `arr.includes(x)`   | `slices.Contains(arr, x)`          |
| `arr.indexOf(x)`    | `slices.Index(arr, x)`             |
| `arr.sort()`        | `slices.Sort(arr)`                 |
| `arr.reverse()`     | `slices.Reverse(arr)`              |
| `arr.splice(i, 1)`  | `arr = slices.Delete(arr, i, i+1)` |
| `Math.max(...arr)`  | `slices.Max(arr)`                  |
| `[...arr]` (a copy) | `slices.Clone(arr)`                |

More in [slices & maps](./slices-and-maps.md) and [Built-in Functions](./builtins.md).

### - B. No `map`, `filter` or `reduce`: just write a loop

Go doesn't have `map` / `filter` / `reduce` for slices. The Go way is a plain `for` loop:

```go
// reduce: sum of a slice
sum := 0
for _, n := range nums {
    sum += n
}

// map: transform each item
upper := make([]string, 0, len(names))
for _, name := range names {
    upper = append(upper, strings.ToUpper(name))
}

// filter: keep only some items
var adults []User
for _, u := range users {
    if u.Age >= 18 {
        adults = append(adults, u)
    }
}
```

It's more lines than JS, but there's nothing to remember. (Notice the `make(..., 0, len(names))` in the second loop: we know the final size, so we reserve the room upfront.)

### - C. Looping

```go
for i, v := range nums { }  // <--- index and value
for _, v := range nums { }  // <--- value only (`_` ignores the index)
for i := range nums { }     // <--- index only
for i := range 5 { }        // <--- 0 to 4 (like `for (let i = 0; i < 5; i++)`)
```

### - D. Does a map have a key?

```go
age, ok := ages["Tal"]
if !ok {
    fmt.Println("no such user")
}
```

**JS:** `"Tal" in ages` / `ages.has("Tal")`.

Don't just check `ages["Tal"] == 0`. A missing key returns the zero value (`0`), so you can't tell "missing" apart from "set to 0". More on this "comma ok" pattern in [Data Types](../data-types.md).

---

## 6. Go-isms

### - A. No ternary operator

Go has no `cond ? a : b`. Use `if` / `else`. The most common pattern is setting a default first, and then overriding it:

```go
label := "minor"
if age >= 18 {
    label = "adult"
}
```

### - B. Swapping two variables

```go
a, b = b, a
```

No temp variable needed.

### - C. Debug-printing a value

```go
fmt.Printf("%+v\n", user) // <--- {Name:Tal Age:30} (with field names)
fmt.Printf("%T\n", user)  // <--- main.User (the type)
```

**JS:** `console.log(user)`. More in [Printing](../printing.md).

### - D. Current timestamp & measuring time

```go
time.Now().UnixMilli() // <--- like Date.now() (milliseconds since 1970)
time.Now().Unix()      // <--- seconds since 1970

start := time.Now()
doSomething()
fmt.Println("took:", time.Since(start)) // <--- took: 1.2s
```

More in [time](./time.md).
