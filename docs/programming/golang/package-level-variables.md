# Package Level Variable

## What are they?

Package level Variables are what you call "global variables".

**They cannot be defined using `=:`!**

Why?

Because in Go, `:=` was specifically designed for introducing new variables inside function bodies, where variables are typically declared close to where they're used. Package-level variables on the other hand, belong to the package's declaration scope, so Go requires the explicit `var` keyword.

```go
package main

// Package-level declaration
var name = "Tal"

func main() {
    // Short variable declaration
    age := 30

    // Assignment to an existing variable
    name = "John"
}
```
