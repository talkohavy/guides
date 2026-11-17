# math

## 1. What is `math`?

`math` is the package for **mathematical functions and constants**: rounding, powers, square roots, absolute values, and the limits of each number type.

```go
import "math"
```

### - A. Everything works with `float64`

Almost every function in `math` takes and returns a **`float64`**. Go never converts number types automatically, so passing an `int` doesn't compile:

```go
x := 5
math.Sqrt(x) // <--- Error! ❌
```

> cannot use x (variable of type int) as float64 value in argument to math.Sqrt

Convert it first, and convert the result back if you need an `int`:

```go
math.Sqrt(float64(x))   // <--- 2.23606797749979
int(math.Round(2.6))    // <--- 3
```

---

## 2. Rounding

```go
math.Round(2.5)  // <--- 3 (to the nearest whole number)
math.Round(-2.5) // <--- -3 (halves round away from zero)
math.Floor(2.7)  // <--- 2 (always down)
math.Ceil(2.1)   // <--- 3 (always up)
math.Trunc(-2.7) // <--- -2 (just chop off the decimal part)
```

**Want to round to 2 decimal places?** For **displaying** a number, don't round it, just format it: `fmt.Sprintf("%.2f", 3.14159)` gives `"3.14"`.

---

## 3. Common functions

```go
math.Abs(-3.5)  // <--- 3.5 (absolute value)
math.Pow(2, 10) // <--- 1024 (2 to the power of 10)
math.Sqrt(16)   // <--- 4 (square root)
math.Cbrt(27)   // <--- 3 (cube root)
math.Mod(7, 3)  // <--- 1 (remainder, for floats)
```

### - A. `math.Max` & `math.Min` vs. built-in `min` & `max`

`math.Max` and `math.Min` only work with `float64`, and take exactly two values. Since Go 1.21, the [built-in](./builtins.md) `min` and `max` work with any number type, and take as many values as you want:

```go
math.Max(3, 7) // <--- 7 (float64 only)
max(3, 7, 2)   // <--- 7 (any number type) ✅
```

**In new code, use the built-in ones.** You'll still see `math.Max` / `math.Min` in code written before Go 1.21.

---

## 4. Constants

```go
math.Pi       // <--- 3.141592653589793

math.MaxInt   // <--- 9223372036854775807 (on a 64-bit machine)
math.MaxInt32 // <--- 2147483647
math.MaxUint8 // <--- 255
```

There's a `Max` (and `Min`) constant for every integer type: `math.MaxInt8`, `math.MinInt64`, `math.MaxUint32`, etc. They're useful for checking that a value fits before converting it to a smaller type, or as a starting value when looking for the smallest number in a loop.

---

## 5. Integer math (no package needed)

For whole numbers, the regular operators are all you need. But integer division has a surprise if you're coming from JavaScript:

```go
7 / 2          // <--- 3 ❗ (int divided by int is an int, the decimal part is dropped)
7.0 / 2        // <--- 3.5
float64(7) / 2 // <--- 3.5

7 % 3          // <--- 1 (remainder)
-7 % 3         // <--- -1 (the sign follows the left side)
```

---

## 6. Infinity and NaN

Float math doesn't crash when something goes wrong. Instead, you get special values:

```go
var zero float64
1 / zero      // <--- +Inf
math.Sqrt(-1) // <--- NaN ("not a number")
```

You can check for them with `math.IsInf(x, 0)` and `math.IsNaN(x)`.

**Gotcha:** `NaN` is not equal to anything, **not even to itself**. So you can't check for it with `==`:

```go
math.NaN() == math.NaN() // <--- false ❗
math.IsNaN(math.NaN())   // <--- true ✅
```

**Note:** this only applies to floats. Dividing an **integer** by zero crashes the program with a panic.

---

## 7. Random numbers: `math/rand/v2`

Random numbers live in a sub-package:

```go
import "math/rand/v2"
```

```go
rand.IntN(10)   // <--- a random int from 0 to 9
rand.Float64()  // <--- a random float from 0.0 up to (not including) 1.0
rand.Perm(5)    // <--- the numbers 0 to 4, in random order. e.g. [3 0 4 1 2]
```

Picking a random item from a slice, and shuffling one:

```go
colors := []string{"red", "green", "blue"}

pick := colors[rand.IntN(len(colors))]

rand.Shuffle(len(colors), func(i, j int) {
    colors[i], colors[j] = colors[j], colors[i]
})
```

**Notice the `/v2`.** There's an older `math/rand` package too, which you'll see in older tutorials. Prefer `v2` in new code.

**Never use `math/rand` for anything security-related** (passwords, tokens, keys). Its numbers are random enough for games and simulations, but not unpredictable enough for security. For that, use `crypto/rand`.

---

## 8. Cheat sheet

| Function                          | What it does                       |
| --------------------------------- | ---------------------------------- |
| `math.Round(x)`                   | Round to the nearest whole number  |
| `math.Floor(x)` / `math.Ceil(x)`  | Round down / up                    |
| `math.Abs(x)`                     | Absolute value                     |
| `math.Pow(x, y)`                  | `x` to the power of `y`            |
| `math.Sqrt(x)`                    | Square root                        |
| `math.Pi`                         | π                                  |
| `math.MaxInt`, `math.MaxInt64`... | Largest value of each integer type |
| `math.IsNaN(x)`                   | Is `x` NaN? (`==` doesn't work)    |
| `rand.IntN(n)`                    | Random int from `0` to `n-1`       |
| `rand.Shuffle(n, swap)`           | Shuffle a slice                    |
