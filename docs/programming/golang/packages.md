# Packages

## 1. Motivation

Why do we need packages?

Well, up until now we've been working a one single file. But what will happen as our application grows? When writing a complex application, you need a way to modularize your code, and encapsulate parts into small modules.

- `Go` **programs are organized into packages**.
- A package is a **collection of Go files**.
- In a `Go` program, you already have (MUST have) a package called `main` ([why?](./getting-started.md#does-the-package-name-have-to-be-main)).

So you can:

- ✅ Organize your app
- ✅ logically group your code

---

## 2. Two files, same package

### - A. Same package, same folder

Consider this scenario. You have two files.

One file is:

```go title="src/helper.go"
package main

import "fmt";

func sayHi(){
    fmt.Println("Hello!");
}
```

And the second file is:

```go title="src/main.go"
package main

func main(){
    sayHi();
}
```

The `helper` file defines a function named `sayHi`, and the `main` file uses that function.

This works! ✅ The `main` file correctly identifies the `sayHi` function.

Why it works:

1. Both files have the **same package name**
2. Both files live **under the same folder** (IMPORTANT! Go's rule is [one package per folder](./getting-started.md#one-package-per-folder))

If `helper.go` file would be nested deeper in a different folder, `main.go` wouldn't recognize the say `sayHi`.

<!-- since `main.go` & `helper.go` specify the same package, the `main` function already knows about `sayHi` function. -->

### - B. How to run it

The correct way is to run it like so:

```bash
go run ./path-to-package
```

If you were using to running by explicitly mentioning the file name, that wouldn't work now!

Would NOT work ❌:

```bash
go run main.go
```

You _can_ run this (not recommended):

```bash
go run ./src/main.go ./src/helper.go
```

and that would work, but it's impractical. Because what if you have 10+ files?

The correct answer is: **specify the path of the folder containing the package files, and not just 1 specific file.**

**Go is strict about it! One folder is one package.** Files belonging to the same package can't be spread across different directories, and a single directory can't hold two different packages.

---

## 3. Two files, different package

### - A. Different package name

Let's take the scenario from above, and all we do is **change "main" in helper.go into "helper"**:

```go title="src/helper.go"
package helper

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

Try to run it, and Go refuses to even compile:

> found packages helper (helper.go) and main (main.go) in /path/to/nameofproject/src

Remember, **one folder is one package**. Two different package names means two different folders. So let's move `helper.go` into its own folder, named after its package:

```
nameofproject/
├── go.mod
├── helper/
│   └── helper.go   // package helper
└── src/
    └── main.go     // package main
```

Now the folder problem is solved, but we see a new error under `sayHi`:

> undefined: sayHi

Go tells us it doesn't know this function. `main` and `helper` are two separate packages now, so `main` can't see what's inside `helper` anymore.

**So how do we import it?**

### - B. Pro & Cons to a different package name

Pros:

- Each package **lives in its own folder**, which keeps the app organized.
- We could make some functions hidden, and some functions visible (concept of _exporting_).

Cons:

- We now need to add an _import_ statement, whereas before we didn't.
- We need to explicitly mention the path to the imported package.
- We need to prefix every use with the package name (`helper.SayHi()`).

### - C. Exporting

In Go, **the concept of exporting** is very strict, and **is tightly coupled with how the function / variable is named**.

Functions beginning in a lowercased letter, are hidden! They stay internal within the package. Same goes to variables and their names.

To **_export_ a function**, simply **make it's first letter a Capital letter**.

And if you notice, `fmt` follows this rule as well (`fmt.Print()`, `fmt.Println()`, `fmt.Printf()`, etc.).

### - D. Importing

When talking about a function located in a different package inside our project, we have to import it using an `import` statement.

We need to:

1. Use an `import` statement at the top of the file.
2. Provide the _full path_ to the **folder** of the package (not to a file! remember, one folder is one package).
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

So the name is "nameofproject", and the folder is `helper`, which means `main.go` should import it like so:

```go title="src/main.go"
package main

import "nameofproject/helper"

func main(){
    sayHi(); // <--- Error! undefined: sayHi
}
```

But we still have an error. Two things are missing:

1. `sayHi` starts with a lowercase letter, so it's **not exported**. It's hidden inside the `helper` package.
2. We're calling it as if it lived in our own package.

### - F. Using the imported package

First, export the function by renaming it to `SayHi`:

```go title="helper/helper.go"
package helper

import "fmt";

func SayHi(){
    fmt.Println("Hello!");
}
```

Then, call it with the **package name as a prefix**, just like we do with `fmt.Print`:

```go title="src/main.go"
package main

import "nameofproject/helper"

func main(){
    helper.SayHi(); // <--- Works! ✅
}
```

Notice there are two different names at play here:

- The `import` path uses the **folder** name (`nameofproject/helper`).
- The prefix uses the **package** name (the `package helper` line inside the file).

Go doesn't force the two to be the same. Go imports by folder path. If the folder name is `utils` but the package name is `helper`, the import would be `import "nameofproject/utils"` and then the call would be `helper.SayHi()`. **That's extremely confusing!** which is why the convention is that the package name matches its folder name.
