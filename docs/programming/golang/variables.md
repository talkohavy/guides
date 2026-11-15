# Variables

## 1. Introduction

Go has several ways to define a variable.

```go
var defaultString string;
var name1 string = "John1";
const name2 string = "John2";
name3 := "John3";
```

---

## 2. using `const`

Once a variable is defined using `const` keyword, it can no longer be changed later, and **if you try to change it, you'll get a compile error**. A variable set with `const` requires a value! It cannot be defined without one.

**`const` does not allow for function call assignments!**

This is invalid ❌:

```go
const hello string = sayHi() // <--- ❌ const hello string = sayHi() (value of type string) is not constant compiler InvalidConstInit


func sayHi() string {
    return "hi"
}
```

A few **built-in** calls are the exception, `len` is one of them:

```go
const n = len("hello"); // OK, n is 5
```

But a function you wrote is never allowed.

Rules when using const:

- a value is required
- that value must be known at compile time (a function call is not allowed)
- a type is optional
- cannot re-assign to it

Good ✅: define and never re-assign

```go
package main

import "fmt"

func main(){
    const name string = "John";
	fmt.Println(name);
}
```

Bad ❌: define and then try to re-assign

```go
package main

import "fmt"

func main(){
    const name string = "John";
    name = "Kenny"; // <--- Error! cannot assign to name (neither addressable nor a map index expression)
    fmt.Println(name);
}
```

Bad ❌: initialize a const from a function call

```go
package main

func main(){
    const name string = getName(); // <--- Error! getName() (value of type string) is not constant

}
func getName() string {
    return "John";
}
```

---

## 3. Using `var`

When you think your variable might change, use `var` keyword.

Rules when using `var`:

- a value is optional
- a type is required when omitting a value, and optional when mentioning one
- can always re-assign to it

```go
package main

import "fmt"

func main(){
    var name string = "John";
    name = "Kenny";
    fmt.Println(name);
}
```

var has two way of defining a variable:

- explicitly saying the type
- omitting the type, letting Go infer it

For number types, that may be critical, because `32` can be `int`, `int8`, `int32`, `int64`, but omitting the type causes go to say "Ok, so for numbers, the default inferred type is `int`".

---

## 4. Using `:=`

In Go, `:=` is called a _short variable declaration_. It's specifically designed for introducing new variables inside function bodies, where variables are typically declared close to where they're used. [Package-level variables](./package-level-variables.md) on the other hand, belong to the package's declaration scope, so Go requires the explicit `var` keyword.

Similar to `var`, you can define a variable that may change using `:=`.

Rules when using `:=`:

- No prefix. No `const` or `var` in front of the variable name.
- You cannot explicitly define a type.
- The type will always be inferred from the value.
- Can always re-assign to it.

In case of assigning from a function call, the type will be inferred from the return type of the function. This is allowed here, and it is exactly what `const` rejects.

```go
package main

import "fmt"

func getName() string {
    return "John";
}

func main(){
    name := "John";
    fmt.Println(name);

    fromFunction := getName(); // type is string, inferred from getName
    fmt.Println(fromFunction);
}
```
