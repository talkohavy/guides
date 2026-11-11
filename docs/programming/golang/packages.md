# Packages

## 1. Motivation

Why do we need packages?

Well, up until now we've been working a one single file. But what will happen as our application grows? When writing a complex application, you need a way to modularize your code, and encapsulate parts into small modules.

- `Go` **programs are organized into packages**.
- A package is a **collection of Go files**.
- In a `Go` program, you already have (MUST have) a package called `main`.

So you can:

- ✅ Organize your app
- ✅ logically group your code

---

## 2. Two files, same package

### - A. Same package, same folder

Consider this scenario:

```go title="src/helper.go"
package main

import "fmt";

func sayHi(){
    fmt.Println("Hello!");
}
```

```go title="src/main.go"
package main

func main(){
    sayHi();
}
```

This works! ✅  
The `main` file would correctly identify the `sayHi` function.

Why it works:

1. Both files have the **same package name**
2. Both files live **under the same folder** (IMPORTANT!)

If `helper.go` file would be nested deeper in a different folder, `main.go` wouldn't recognize the say `sayHi`.

<!-- since `main.go` & `helper.go` specify the same package, the `main` function already knows about `sayHi` function. -->

### - B. How to run it

The only thing now is to **understand how to run it!**

Up until now you ran:

```bash
go run main.go
```

But that wouldn't work now ❌

You can run (not recommended) this:

```bash
go run ./src/main.go ./src/helper.go
```

and that would work, but it's impractical. Because what if you have 10+ files?

The correct answer is: **specify the path of the folder containing the package files, and not just 1 specific file.**

So, for example, instead of saying: `./src/main.go`, we say `./src`

```bash
go run ./src
```

**Go is strict about it! It does not allow files belonging to the same package to be spread across different directories.**

---

## 3. Two files, different package

### - A. Different package name

Let's take the scenario from above, and all we do is **change "main" in helper.go into "helper"**:

```go title="helper.go"
package helper

import "fmt";

func sayHi(){
    fmt.Println("Hello!");
}
```

```go title="main.go"
package main

func main(){
    sayHi(); // <--- Error! undefined: sayHi compilerUndeclaredName
}
```

Now we will see an error under `sayHi`, as Go tells us it doesn't know this function.

**So how do we import it?**

### - B. Pro & Cons to a different package name

Pros:

- When selecting different package names, **the two files can now live under different directories**.
- We could make some functions hidden, and some functions visible (concept of _exporting_).

Cons:

- We now need to add an _import_ statement, whereas before we didn't.
- We need to explicitly mention the path to the imported package

### - C. Exporting

In Go, **the concept of exporting** is very strict, and **is tightly coupled with how the function / variable is named**.

Functions beginning in a lowercased letter, are hidden! They stay internal within the package. Same goes to variables and their names.

To **_export_ a function**, simply **make it's first letter a Capital letter**.

And if you notice, `fmt` follows this rule as well (`fmt.Print()`, `fmt.Println()`, `fmt.Printf()`, etc.).

### - D. Importing

When talking about a function located in a different package inside our project, we have to import it using an `import` statement.

We need to:

1. Use an `import` statement at the top of the file.
2. Provide the _full path_ to the file.
3. Add as _prefix_ the **project name**, to the full path.

Adding **the project name is how we differentiate between a built-in package and a custom package**.

### - E. What is the project name?

That **project name** is the **value/name you gave** the `module` key within the `go.mod` file.

Remember the `go.mod` file? From the root folder?

Its contents looked like this:

```go
module nameofproject

go 1.17
```

So the name is "nameofproject", which means `main.go` should import `sayHi` like so:

```go title="main.go"
package main

import "nameofproject/helper"

func main(){
    sayHi(); // <--- Error! undefined: sayHi compilerUndeclaredName
}
```

:::info
NOTE! Standard library import paths **take precedence** over module paths when they collide.

For example, if you try to override `fmt`, and then import it, the built-in `fmt` would win, and be imported.

In code that would be trying to:

```go title="go.mod"
module fmt

go 1.26.5
```

and then inside `main.go` trying to import:

```go title="main.go"
package main

import fmt;

func main(){
    fmt.Print("hello");
}
```

:::
