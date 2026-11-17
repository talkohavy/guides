# errors

## 1. How Go handles errors

### - A. No exceptions

Go has no `try` / `catch`. Instead, **errors are regular values** that functions return, usually as the **last** return value:

```go
n, err := strconv.Atoi("42abc")
if err != nil {
    fmt.Println("failed:", err)
    return
}
fmt.Println(n)
```

That `if err != nil` check is the most common line in all of Go. You'll write it a lot.

### - B. What is an `error`?

`error` is a built-in interface with a single method:

```go
type error interface {
    Error() string
}
```

So **any type with an `Error() string` method is an error** (the implicit interface idea from [Classes](../classes.md)). When there's no error, the value is `nil`.

The `errors` package gives you the tools to create errors, and to inspect them:

```go
import "errors"
```

---

## 2. Creating errors

### - A. `errors.New`

Creates an error with a fixed message:

```go
err := errors.New("something went wrong")
```

### - B. `fmt.Errorf`

When the message needs some values in it, use `fmt.Errorf` (it works like `Sprintf`):

```go
err := fmt.Errorf("user %d not found", id)
```

**Convention:** error messages start with a **lowercase** letter, and **don't end with punctuation**. That's because errors often get combined into longer messages, like `loading profile: user 7 not found`.

---

## 3. Sentinel errors: errors you can check for

### - A. The idea

Sometimes the caller needs to know **which** error happened, to react differently. For example, "not found" might mean "show a 404 page", while anything else means "show a 500 page".

For that, packages declare their errors once, as package-level variables, so callers can compare against them:

```go
var ErrNotFound = errors.New("not found")

func findUser(id int) (string, error) {
    if id != 1 {
        return "", ErrNotFound
    }
    return "Tal", nil
}
```

By convention, their names start with `Err`. The standard library is full of them: `os.ErrNotExist`, `io.EOF`, `sql.ErrNoRows`, etc.

### - B. Checking for them

The simple way is `==`:

```go
_, err := findUser(7)
if err == ErrNotFound {
    // ...
}
```

But this breaks as soon as the error gets **wrapped**. Which brings us to the most important part of this guide.

---

## 4. Wrapping errors with `%w`

### - A. Adding context

When an error travels up through several functions, each one can add some context about what it was doing. That's called **wrapping**, and you do it with the `%w` verb in `fmt.Errorf`:

```go
func loadProfile(id int) error {
    _, err := findUser(id)
    if err != nil {
        return fmt.Errorf("loading profile %d: %w", id, err)
    }
    return nil
}

err := loadProfile(7)
fmt.Println(err) // <--- loading profile 7: not found
```

The message now tells the whole story. But the original `ErrNotFound` is still **inside** the new error.

### - B. `errors.Is`: check for an error, even when it's wrapped

Now `==` no longer works, because `err` is a new error that _wraps_ `ErrNotFound`:

```go
err == ErrNotFound          // <--- false ❌
errors.Is(err, ErrNotFound) // <--- true ✅
```

`errors.Is` unwraps the error layer by layer, looking for a match.

**Rule of thumb: always use `errors.Is`** instead of `==` when checking for a specific error.

### - C. `%w` vs `%v`

If you use `%v` instead of `%w`, you get the same message, but the original error is **not** kept inside:

```go
err := fmt.Errorf("loading profile: %v", ErrNotFound)
errors.Is(err, ErrNotFound) // <--- false ❗
```

**Use `%w` when you want callers to be able to check for the original error.**

---

## 5. Custom error types

### - A. When a message isn't enough

Sometimes you want an error to carry extra data, like which field failed validation. For that, create your own type with an `Error()` method:

```go
type ValidationError struct {
    Field string
}

func (e *ValidationError) Error() string {
    return "invalid field: " + e.Field
}
```

### - B. `errors.As`: get the custom error back out

`errors.Is` checks for a specific error **value**. `errors.As` looks for an error of a specific **type**, and if it finds one, it gives it to you, so you can read its fields:

```go
err := fmt.Errorf("signup failed: %w", &ValidationError{Field: "email"})

var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println("bad field:", ve.Field) // <--- bad field: email
}
```

Just like `errors.Is`, it unwraps the layers for you.

### - C. `errors.AsType`: the newer, shorter way

Since Go 1.26, there's a generic version that skips the separate variable declaration:

```go
if ve, ok := errors.AsType[*ValidationError](err); ok {
    fmt.Println("bad field:", ve.Field) // <--- bad field: email
}
```

---

## 6. `errors.Join`: combine multiple errors

When you want to report several errors at once (like all the validation errors in a form), join them:

```go
err := errors.Join(
    errors.New("name is required"),
    errors.New("age must be positive"),
)

fmt.Println(err)
// name is required
// age must be positive
```

`errors.Is` and `errors.As` still work on the joined error, and check each of the errors inside it.

---

## 7. Real-world example: a missing file

Let's see it all with a real standard library error:

```go
_, err := os.Open("/does/not/exist")
fmt.Println(err)                            // <--- open /does/not/exist: no such file or directory
fmt.Println(errors.Is(err, os.ErrNotExist)) // <--- true
```

The message has context (`open /does/not/exist`), and you can still check for the sentinel `os.ErrNotExist`. That's exactly the pattern from this guide.

---

## 8. What about `panic`?

Go does have `panic`, which crashes the program (unless something calls `recover`). But it's **not** for regular errors. It's for bugs that should never happen, like accessing an index that's out of range.

**For anything that can reasonably go wrong** (a missing file, bad user input, a failed network call), **return an error**.

---

## 9. Cheat sheet

| Function                     | What it does                                        |
| ---------------------------- | --------------------------------------------------- |
| `errors.New(msg)`            | Create an error with a fixed message                |
| `fmt.Errorf(format, ...)`    | Create an error with a formatted message            |
| `fmt.Errorf("...: %w", err)` | Wrap an error, adding context                       |
| `errors.Is(err, target)`     | Is `target` anywhere in the chain?                  |
| `errors.As(err, &target)`    | Find an error of a specific type in the chain       |
| `errors.AsType[T](err)`      | Same as `As`, without the extra variable (Go 1.26+) |
| `errors.Join(errs...)`       | Combine multiple errors into one                    |
| `errors.Unwrap(err)`         | Get the error one layer down (rarely needed)        |
