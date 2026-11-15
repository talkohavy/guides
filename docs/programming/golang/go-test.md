# Tests

## 1. Introduction

Testing is built into Go. You don't need an external test runner, framework, or config file: the `testing` package plus the `go test` command is everything.

Go decides what counts as a test **by naming convention alone**:

- **The file** must end with `_test.go`
- **The function** must be named `TestXxx` and accept a `*testing.T` parameter

---

## 2. Test files

```
math/
├── add.go
└── add_test.go   // <--- test file sits right next to the code it tests
```

- Files ending with `_test.go` are **excluded from regular builds**. They're only compiled by `go test`.
- Tests live **next to the code**. There's no separate `tests/` folder.

### Package name: white-box vs. black-box

A test file can declare one of two packages:

```go
package math       // white-box: same package, can access unexported (lowercase) identifiers
```

```go
package math_test  // black-box: separate package, must import "math" like any consumer would
```

The `_test` suffix is the **only exception** to Go's "one package per directory" rule.

---

## 3. Test functions

```go
package math

// Rule 1: import "testing" is required
import "testing"

/**
 * Rule 2+3:
 * - func name starts with TestXxx
 * - takes exactly one parameter of type `testing.T`
 */
func TestAdd(t *testing.T) {
    actualResult := Add(2, 3)
    expectedResult := 5

    if got != want {
        // Rule 4: use t.Errorf in case of an error. (No built-in `expect`!)
        t.Errorf("Add(2, 3) = %d, want %d", actualResult, expectedResult)
    }

    // Rule 5: function returns nothing
}
```

What makes a function a test:

- The name starts with `Test`, and the next character is **not lowercase**. `TestAdd` and `Test_add` work ✅. `Testadd` is **an error** ❌.
- It takes exactly one parameter, `t *testing.T`.
- It returns nothing.

---

## 4. t has Errorf & Fatalf

There are _no assertions_ in Go. It has no `assert` or `expect`. You write a plain `if` and report the failure yourself:

| Method               | Marks as failed | Stops the test |
| -------------------- | --------------- | -------------- |
| `t.Error / t.Errorf` | ✅              | ❌             |
| `t.Fatal / t.Fatalf` | ✅              | ✅             |
| `t.Log / t.Logf`     | ❌              | ❌             |

- Use `Errorf` by default, so a single run reports every failure.
- Use `Fatalf` when continuing makes no sense, for example after a failed setup step or when the next line would hit a nil pointer.
- The convention for failure messages is `got X, want Y`.

> `testify` is a popular third-party assertion library, but plain `if` checks are the idiomatic choice, and the standard library uses them.

---

## 5. Running tests

```bash
go test                      # current package
go test ./src                # all packages, recursively
go test -v                   # verbose: print every test name + t.Log output
go test -run TestAdd         # only tests matching a regex
go test -run 'TestAdd/neg'   # a specific subtest (see next section)
go test -count=1             # `go test` caches results. `-count=1` forces a real run, and bypasses cache.
go test -race                # enable the race detector
go test -cover               # show coverage percentage
go test -failfast            # stop at the first failure
```

---

## 6. Table-driven tests + subtests

This is **the** idiomatic Go testing pattern. You define a slice of cases and loop over it, with each case running as a named subtest via `t.Run`:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -2, -3, -5},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
```

- Each subtest passes or fails on its own, and you can run a single one with `-run 'TestAdd/negative'`.
- A `t.Fatal` inside a subtest stops **only that subtest**.

---

## 7. Useful `t` methods

```go
t.Helper()                // mark a function as a helper, so failures report the caller's line
t.Cleanup(func() { ... }) // teardown, runs after the test (and its subtests) finish
t.TempDir()               // temp directory, deleted automatically
t.Setenv("KEY", "value")  // set an env var for this test only, restored afterwards
t.Skip("reason")          // skip the test
t.Parallel()              // run in parallel with other parallel tests
```

Tests in the same package run **sequentially** by default, while different packages run in parallel. Call `t.Parallel()` to opt a test in.

Example helper:

```go
func assertEqual(t *testing.T, got, want int) {
    t.Helper() // <--- without this, failures would point to THIS line instead of the caller's
    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}
```

---

## 8. Package-level setup/teardown: `TestMain`

If a test file defines `TestMain`, Go calls it **instead of** running the tests directly:

```go
func TestMain(m *testing.M) {
    // setup (e.g. start a DB container)
    code := m.Run() // <--- runs all the tests
    // teardown
    os.Exit(code)
}
```

A package can have only one `TestMain`.

---

## 9. Other special functions in `_test.go` files

Naming conventions also cover benchmarks, fuzz tests, and examples:

| Prefix         | Signature            | Run with                |
| -------------- | -------------------- | ----------------------- |
| `TestXxx`      | `func(t *testing.T)` | `go test`               |
| `BenchmarkXxx` | `func(b *testing.B)` | `go test -bench=.`      |
| `FuzzXxx`      | `func(f *testing.F)` | `go test -fuzz=FuzzXxx` |
| `ExampleXxx`   | `func()`             | `go test`               |

### Benchmark

```go
func BenchmarkAdd(b *testing.B) {
    for b.Loop() { // Go 1.24+. Older code: for i := 0; i < b.N; i++
        Add(2, 3)
    }
}
```

### Example

Example functions serve as **documentation and tests at the same time**. They show up in `go doc` / pkg.go.dev, and the `// Output:` comment is checked against what the function actually prints:

```go
func ExampleAdd() {
    fmt.Println(Add(2, 3))
    // Output: 5
}
```

If there's no `// Output:` comment, the example is compiled but not run.

---

## 10. Test fixtures: `testdata/`

The Go tool ignores any directory named `testdata`, so it's the conventional place for fixture files (JSON, golden files, etc.):

```go
data, err := os.ReadFile("testdata/input.json") // paths are relative to the package directory
```

While tests run, the working directory is always the **package's directory**, so relative paths like the one above work reliably.
