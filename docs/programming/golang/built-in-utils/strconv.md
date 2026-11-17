# strconv

## 1. What is `strconv`?

`strconv` (short for "string conversion") is the package for **converting between strings and other types**: numbers and booleans.

```go
import "strconv"
```

**When do you need it?** All the time. Anything that comes from the outside world arrives as a string: user input, command-line arguments, environment variables, URL query params, CSV files. To do math with `"42"`, you first have to turn it into the number `42`.

The naming is easy to remember:

- `Parse...` / `Atoi`: string **to** something.
- `Format...` / `Itoa`: something **to** string.

---

## 2. `Itoa` & `Atoi`: the everyday ones

### - A. `Itoa`: int to string

```go
s := strconv.Itoa(42) // <--- "42"
```

### - B. `Atoi`: string to int

```go
n, err := strconv.Atoi("42")
fmt.Println(n, err) // <--- 42 <nil>
```

Notice that `Atoi` returns **two values**: the number, and an error. Converting a string to a number can fail, because not every string is a number:

```go
n, err := strconv.Atoi("42abc")
fmt.Println(n, err) // <--- 0 strconv.Atoi: parsing "42abc": invalid syntax
```

**Always check the error!** It's also strict about whitespace: `strconv.Atoi(" 42")` fails too, so use `strings.TrimSpace` on user input first.

```go
age, err := strconv.Atoi(input)
if err != nil {
    fmt.Println("Please enter a valid number")
    return
}
```

**What do the names mean?** They come from the C language: `Atoi` = "ASCII to integer", `Itoa` = "integer to ASCII".

---

## 3. `Parse...`: string to other types

When you need more than a plain `int`, use the `Parse` functions. They all return a value and an error.

### - A. `ParseFloat`

```go
f, err := strconv.ParseFloat("3.14", 64) // <--- 3.14 <nil>
```

The second argument is the bit size: `64` for a `float64` (which is what you want 99% of the time).

### - B. `ParseBool`

```go
b, err := strconv.ParseBool("true") // <--- true <nil>
b, err = strconv.ParseBool("yes")   // <--- false strconv.ParseBool: parsing "yes": invalid syntax
```

It accepts `1`, `t`, `T`, `TRUE`, `true`, `True` (and the same for false). Not `yes` / `no`.

### - C. `ParseInt` & `ParseUint`

`ParseInt` takes two extra arguments:

```go
strconv.ParseInt(s, base, bitSize)
```

- `base`: the number system. `10` for regular numbers, `16` for hex, `2` for binary.
- `bitSize`: the size of the integer type you want to fit the result in (`8`, `16`, `32`, `64`).

```go
strconv.ParseInt("-ff", 16, 64) // <--- -255 <nil>
strconv.ParseInt("300", 10, 8)  // <--- 127 strconv.ParseInt: parsing "300": value out of range
```

The second example fails because `300` doesn't fit in an `int8` (max `127`). That's a free range validation.

`ParseUint` is the same, for unsigned numbers (`uint64`), which can't be negative.

**Note:** `ParseInt` always returns an `int64`, even if you ask for bit size `8`. The bit size only controls the range check. Convert it yourself if you need a smaller type: `int8(n)`.

---

## 4. `Format...`: other types to string

```go
strconv.FormatInt(255, 2)                 // <--- "11111111" (binary)
strconv.FormatInt(255, 16)                // <--- "ff" (hex)
strconv.FormatUint(42, 10)                // <--- "42"
strconv.FormatFloat(3.14159, 'f', 2, 64)  // <--- "3.14"
strconv.FormatFloat(3.14159, 'f', -1, 64) // <--- "3.14159"
strconv.FormatBool(true)                  // <--- "true"
```

`FormatFloat` takes a format (`'f'` means a regular decimal number), the number of digits after the decimal point (`-1` means "as many as needed"), and the bit size.

**In practice:** for simple conversions, `fmt.Sprint(x)` or `fmt.Sprintf("%.2f", x)` also work, and are easier to read. Use `strconv` when you need a specific base, or when performance matters (it's faster than `fmt`).

---

## 5. Gotcha: `string(65)` is NOT `"65"`

Coming from other languages, you might try converting a number to a string like this:

```go
x := 65
fmt.Println(string(x)) // <--- "A" ❗
```

`string(x)` treats the number as a **character code**, and `65` is the code for `"A"`. It compiles, but `go vet` warns about it:

> conversion from int to string yields a string of one rune, not a string of digits

The correct ways:

```go
strconv.Itoa(x)  // <--- "65"
fmt.Sprint(x)    // <--- "65"
string(rune(x))  // <--- "A" (if you really did want the character)
```

---

## 6. Cheat sheet

| Function                          | Converts            | Can fail? |
| --------------------------------- | ------------------- | --------- |
| `Itoa(n)`                         | `int` to string     | No        |
| `Atoi(s)`                         | string to `int`     | Yes       |
| `ParseInt(s, base, bits)`         | string to `int64`   | Yes       |
| `ParseUint(s, base, bits)`        | string to `uint64`  | Yes       |
| `ParseFloat(s, bits)`             | string to `float64` | Yes       |
| `ParseBool(s)`                    | string to `bool`    | Yes       |
| `FormatInt(n, base)`              | `int64` to string   | No        |
| `FormatUint(n, base)`             | `uint64` to string  | No        |
| `FormatFloat(f, fmt, prec, bits)` | `float64` to string | No        |
| `FormatBool(b)`                   | `bool` to string    | No        |
