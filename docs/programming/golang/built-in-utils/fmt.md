# fmt

## 1. What is `fmt`?

`fmt` (short for "format") is the package for **formatting text**: printing it, building strings with it, and reading input.

```go
import "fmt"
```

We already met its printing functions (`Print`, `Println`, `Printf`) and the formatting verbs (`%s`, `%d`, `%v`...) in [Printing](../printing.md). This guide covers everything else you'll use from `fmt`.

The function names follow a simple pattern, so once you get it, you know them all:

| Prefix   | Where the output goes          | Examples                        |
| -------- | ------------------------------ | ------------------------------- |
| _(none)_ | Printed to the terminal        | `Print`, `Println`, `Printf`    |
| `S`      | **Returned** as a string       | `Sprint`, `Sprintln`, `Sprintf` |
| `F`      | Written to a file, or a stream | `Fprint`, `Fprintln`, `Fprintf` |

And the suffix tells you how it formats:

- No suffix (`Print`): just glue the values together.
- `ln` (`Println`): put spaces between the values, and a newline at the end.
- `f` (`Printf`): use a format string with verbs, like `%s` and `%d`.

---

## 2. `Sprintf`: build a string

### - A. Basic usage

`Sprintf` works exactly like `Printf`, but instead of printing the result, it **returns it** as a string:

```go
name, count := "Tal", 3

msg := fmt.Sprintf("%s bought %d tickets", name, count)
fmt.Println(msg) // <--- Tal bought 3 tickets
```

**When to use it:** whenever you need to build a string out of values of different types. It's the closest thing Go has to JavaScript's template strings (`` `${name} bought ${count} tickets` ``).

### - B. Useful formatting tricks

```go
fmt.Sprintf("%.2f", 3.14159) // <--- "3.14" (2 digits after the decimal point)
fmt.Sprintf("[%5d]", 42)     // <--- "[   42]" (pad to 5 characters)
fmt.Sprintf("[%-5d]", 42)    // <--- "[42   ]" (pad, aligned to the left)
fmt.Sprintf("[%05d]", 42)    // <--- "[00042]" (pad with zeros)
```

### - C. Printing structs

Three verbs, three levels of detail:

```go
u := User{Name: "Tal", Age: 30}

fmt.Printf("%v\n", u)  // <--- {Tal 30}
fmt.Printf("%+v\n", u) // <--- {Name:Tal Age:30}
fmt.Printf("%#v\n", u) // <--- main.User{Name:"Tal", Age:30}
```

**`%+v` is the one you want for debugging**, because it shows the field names.

---

## 3. `Sprint` & `Sprintln`

These are the "no format string" versions of `Sprintf`:

```go
fmt.Sprintln("a", "b", 1) // <--- "a b 1\n"
fmt.Sprint("a", "b", 1, 2, "c") // <--- "ab1 2c" ❗
```

Notice `Sprint`'s weird output. It only adds a space **between two values that are both not strings**. That's why `1` and `2` got a space, but nothing else did.

**In practice:** use `Sprintf` when you want control over the result, and `Sprint` for quickly converting a single value to a string (`fmt.Sprint(42)` gives `"42"`).

---

## 4. `Errorf`: create an error with a message

`Errorf` is like `Sprintf`, but it returns an **error** instead of a string:

```go
err := fmt.Errorf("user %q not found", "bob")
fmt.Println(err) // <--- user "bob" not found
```

It's the most common way to create errors in Go, and it has one more superpower: wrapping other errors with `%w`. We cover that in [errors](./errors.md).

---

## 5. `Fprintln` & `Fprintf`: write somewhere else

The `F` functions take an extra first argument: **where to write**. That can be a file, a network connection, an HTTP response, or anything else that you can write to (in Go terms: anything that implements the `io.Writer` interface).

The most common use is printing errors to **standard error** instead of standard output:

```go
fmt.Fprintln(os.Stderr, "something went wrong")
```

**When to use it:** error messages and logs should go to `os.Stderr`. That way, if someone pipes your program's output into a file (`./app > out.txt`), the errors still show up in the terminal, and don't pollute the file.

---

## 6. `Scan`: read input from the user

`Scan` reads space-separated values that the user types into the terminal, and stores them in the variables you give it:

```go
var name string
var age int

fmt.Print("Enter your name and age: ")
n, err := fmt.Scan(&name, &age)
```

If the user types `Tal 30`, then `name` is `"Tal"`, `age` is `30`, and `n` (the number of values it read) is `2`.

Notice the `&` before each variable. `Scan` needs to **change** your variables, so you pass it [pointers](../pointers.md) to them.

There's also `Scanln`, which stops reading at the end of the line.

**Note:** `Scan` is fine for simple programs and exercises. For reading full lines of text (with spaces in them), use `bufio.Scanner` instead.

---

## 7. The `Stringer` interface: control how your type is printed

If your type has a method called `String() string`, `fmt` uses it automatically whenever it prints a value of that type:

```go
type Money struct {
    Cents int
}

func (m Money) String() string {
    return fmt.Sprintf("$%d.%02d", m.Cents/100, m.Cents%100)
}

fmt.Println(Money{Cents: 1999}) // <--- $19.99
```

This works because `fmt` checks whether the value satisfies the `fmt.Stringer` interface. It's the same implicit interface idea we saw in [Classes](../classes.md): `Money` never says it implements `Stringer`, it just has the right method.

---

## 8. Gotcha: wrong verbs don't crash

If you use the wrong verb for a value, Go doesn't fail. It prints a strange-looking message instead:

```go
fmt.Printf("%d\n", "oops") // <--- %!d(string=oops)
```

The good news: `go vet` catches it before you even run the code:

> fmt.Printf format %d has arg "oops" of wrong type string

`go vet` runs automatically as part of `go test`, and most editors run it for you as you type.

---

## 9. Cheat sheet

| Function                  | What it does                                    |
| ------------------------- | ----------------------------------------------- |
| `Sprintf(format, ...)`    | Returns a formatted string                      |
| `Sprint(...)`             | Returns the values glued together as a string   |
| `Errorf(format, ...)`     | Returns a formatted error (supports `%w`)       |
| `Fprintln(w, ...)`        | Writes to `w` (like `os.Stderr`) with a newline |
| `Fprintf(w, format, ...)` | Writes a formatted string to `w`                |
| `Scan(&a, &b, ...)`       | Reads space-separated input into variables      |
| `String() string` method  | Controls how your type is printed               |
