# Printing

## 1. All the ways to Print something

In Go, we have various way to print stuff.

```go
package main

import "fmt"

func main() {
    const age = 28;

    fmt.Print("Hello World"); // <--- print
    fmt.Println("Hello World"); // <--- print and go down one line
    fmt.Println("I am", age, "years old"); // <--- comma separated (like JavaScript)

    // And then there's `Printf`:

    fmt.Printf("Hello, %s!\n", name); // <--- %s prints a string, or a []byte, as raw text.
    fmt.Printf("Hello, %d!\n", age); // <--- %d prints any integer (int, int64, uint, ...) in base 10.
    fmt.Printf("Hello, %t!\n", bool); // <--- %t prints a bool as true or false.
    fmt.Printf("Hello, %f!\n", float); // <--- %f prints a float32 or float64 with a decimal point (default 6 digits after it).
    fmt.Printf("Hello, %v!\n", any); // <--- %v prints any value in its default format.
    fmt.Printf("Hello, %q!\n", string); // <--- %q prints a string in double quotes, escaped like a Go string literal. A rune is printed in single quotes.
    fmt.Printf("Hello, %#v!\n", any); // <--- %#v prints the value in Go syntax, including the type and struct field names.
    fmt.Printf("Hello, %d from %s and %t\n", num, str, myBool) // <--- you can use multiple verbs with a matching amount of values. The order matters.

    // Print the type of a variable:

    fmt.Printf("my type is, %T", name); // <--- %T prints the type of the variable
}
```

---

## 2. Print the type

This one's so useful it get its own section:

```go
package main

import "fmt"

func main() {
    const age = 28;

    fmt.Printf("my type is, %T", age); // <--- %T prints the type of the variable
}
```
