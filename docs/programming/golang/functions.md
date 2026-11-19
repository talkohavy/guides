# Functions

## 1. Characteristics of a Go Function

- Go functions are hoisted

---

## 2. Defining a function

```go
func greetUser() {
    fmt.Println("Hello user!");
}
```

---

## 3. Parameters

```go
func greetUser(username string) {
    fmt.Printf("Hello %s\n", username);
}
```

---

## 4. Returning a value from a function

Notice! **Functions in Go that return something, MUST explicitly write a RETURN TYPE**! It cannot stay implicit, or else you'll get a compile error under the `return someValue;` line.

```go
func greetUser(username string) bool {
    fmt.Printf("Hello %s\n", username);

    return true;
}
```

---

## 5. Return multiple values

Unlike many other programming languages, a `Go` function can return multiple values.

**Notice the return type below**! When returning multiple values, **you have to enclose the return types in parenthesis**.

```go
func getTalName() (string, string) {
    firstName := "tal";
    lastName := "tal";

    return firstName, lastName;
}

firstName, lastName = getTalName();
```

---

## 6. The `defer` keyword

### - A. What does `defer` do?

The `defer` keyword **postpones the execution of a function call until the surrounding function returns**.

The deferred call is scheduled at the line where `defer` appears, but it only runs right before the surrounding function exits - no matter **how** it exits (a normal `return`, reaching the end of the function, or even a `panic`).

```go
func greetUser() {
    defer fmt.Println("Goodbye user!");

    fmt.Println("Hello user!");
}

// Output:
// Hello user!
// Goodbye user!
```

### - B. Why is it useful?

`defer` is mostly used for **cleanup**: closing files, closing database connections, unlocking a mutex, etc.

The idea is to write the cleanup line **right next to** the line that acquired the resource, so you can't forget it, even if the function has many `return` statements.

```go
func readConfig(path string) error {
    file, err := os.Open(path);
    if err != nil {
        return err;
    }
    defer file.Close(); // <--- will run whenever readConfig returns

    // ... read from the file ...
    // any `return` from here on will still close the file

    return nil;
}
```

### - C. Multiple defers run in reverse order (LIFO)

When a function has several `defer` statements, they are pushed onto a stack. When the function returns, they run **Last-In-First-Out** - the last one deferred runs first.

```go
func countDown() {
    defer fmt.Println(1);
    defer fmt.Println(2);
    defer fmt.Println(3);

    fmt.Println("Starting...");
}

// Output:
// Starting...
// 3
// 2
// 1
```

This makes sense for cleanup: resources are released in the opposite order to how they were acquired.

### - D. Arguments are evaluated immediately

Notice! **The arguments of a deferred call are evaluated at the moment the `defer` line runs, NOT when the deferred call actually executes.**

```go
func example() {
    count := 1;
    defer fmt.Println("deferred count:", count); // <--- `count` is captured as 1 right now

    count = 2;
    fmt.Println("current count:", count);
}

// Output:
// current count: 2
// deferred count: 1
```

If you want the deferred code to see the **latest** value, defer an anonymous function instead. The function body is only executed at the end, so it reads the variable at that time:

```go
func example() {
    count := 1;
    defer func() {
        fmt.Println("deferred count:", count);
    }();

    count = 2;
}

// Output:
// deferred count: 2
```

### - E. Deferred functions can modify named return values

If a function uses **named return values**, a deferred anonymous function can read and change them - even after the `return` statement has set them.

```go
func double() (result int) {
    defer func() {
        result = result * 2;
    }();

    return 5; // <--- sets result to 5, then the deferred function doubles it
}

fmt.Println(double()); // <--- 10
```

### - F. `defer` with `panic` and `recover`

Deferred calls still run when a function panics. This is the only place where `recover()` is useful - it lets you catch a panic and stop it from crashing the program:

```go
func safeDivide(a int, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered from panic: %v", r);
        }
    }();

    return a / b, nil; // <--- panics if b is 0
}

result, err := safeDivide(10, 0);
fmt.Println(result, err); // <--- 0 recovered from panic: runtime error: integer divide by zero
```

### - G. Common pitfall: `defer` inside a loop

A deferred call runs when the **function** returns, not when the current loop iteration ends. Deferring inside a loop means nothing gets cleaned up until the whole function finishes:

```go
func processFiles(paths []string) {
    for _, path := range paths {
        file, _ := os.Open(path);
        defer file.Close(); // <--- BAD! all files stay open until processFiles returns
        // ...
    }
}
```

The fix is to move the body of the loop into its own function, so each `defer` runs at the end of each call:

```go
func processFile(path string) {
    file, _ := os.Open(path);
    defer file.Close(); // <--- closed at the end of every call
    // ...
}

func processFiles(paths []string) {
    for _, path := range paths {
        processFile(path);
    }
}
```
