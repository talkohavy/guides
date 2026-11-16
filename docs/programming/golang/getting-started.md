# Getting Started

## 1. Download Go Compiler

Go to:

https://go.dev/doc/install

And follow instruction as per OS.

Check that it worked:

```bash
go version
```

---

## 2. Init a project

Run this:

```bash
go mod init nameofproject
```

This command initiates our go application into a **module**, or a **project**.

What this command actually does in the background is it creates a file called `go.mod` at the root of your project, with the following contents:

```go
module nameofproject

go 1.17
```

---

## 3. Creating our First File

Create a file at the root of the project, and call it `main.go`.

**Is there a naming restriction?**

Not really. **The only hard requirement is the `.go` extension.** Go doesn't care what the file is called, so `main.go`, `app.go` or `hello.go` would all work just the same. That said, **calling the file that is meant to be your entrypoint `main.go` is the common convention**, and you'll see it in almost every Go project.

---

## 4. Defining a Package

In Go, everything is organized into packages, and every `.go` file must belong to one.

**At the top of each file, you must declare which package the file belongs to.**

That's done using the `package` keyword followed by the package's name:

```go
package main
```

---

## 5. Go Entrypoint

When creating a _runnable go program_, go expects to see a _function_ named `main`. That is its entrypoint.

If we try to write this code:

```go
package main

Print("Hello World");
```

**You'd see an error saying**.

> expected declaration, found Print syntax

**The error is saying "I don't know where to start"**.

`Go` requires a `main` function! It is telling you "I don't know where to start executing this application. What is the first line? Give me the _main_ entrypoint".

Rules:

1.  We have to declare a function.
2.  It has to be named `main`.

```go
package main

func main() {
    Print("Hello World");
}
```

Now Go will know where to start executing our application.

**For one Go application you're going to have one `main`!**

Because you only have one entrypoint to your application.

Alright, we solved the entrypoint error, but now we encounter a new error.

---

## 6. Importing our first package

So now we've come to a point where:

1.  Our application belongs to a package.
2.  We have an entrypoint `main`, so Go knows where to start execution.

And it see that `Print` is the first line of code it needs to execute.

But again, **we see an error for `Print`**.

The problem now is that Go doesn't know where `Print` is coming from.

`Print` is a function that comes from a Go package, a **built-in package**, called `fmt`.

In order to use it, we have to explicitly import it.

Importing syntax: use the `import` keyword, then stringified name of the package:

```go
package main

import "fmt"

func main() {
    fmt.Print("Hello World");
}
```

---

## 7. Compile a program

Basic form:

```bash
go build src/main.go
```

**This produces a binary file named the same as the input file**, at the directory inside which you ran the command.

To **change the destination** and the **output file name**, use the `-o` flag:

```bash
go build -o dist/index src/main.go
```

Notice that **flags come before the path of the input file**! Reverse order would result with an error.

---

## 8. Run a program

Just execute the file:

```bash
./dist/index
```

depending on the compile output's destination and the filename.

---

## 9. Compile & Run in a single command

Run this:

```bash
go run src/main.go
```

Using the `run` command, the project is compiled in memory, which means **no output file is created!** as opposed to `go build`, which generates an output file.

---

## 10. Using `.`

As you'll see in later stages when we discuss `packages`, the proper way to run a project is by using `.`.

Run this command:

```go
go run .
```

Or if your main file is inside an `src` folder:

```go
go run ./src
```

---

## 11. About the rules

Now that we have a program that runs, let's go back over the steps we took and look at the rules behind them.

### - A. File names

#### Naming conventions

- Use **lowercase** names: `server.go`, not `Server.go`.
- For multiple words, the convention is to use **snake_case**.
  - Careful: **some underscore suffixes have a special meaning!** (see the table below).

#### Special file names

A few file name patterns have a special meaning for the Go tool, so don't use them by accident:

| Pattern                         | Meaning                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `*_test.go`                     | A test file. Only compiled when running `go test`.                        |
| `*_linux.go`, `*_windows.go`... | Only compiled for that operating system.                                  |
| `*_amd64.go`, `*_arm64.go`...   | Only compiled for that CPU architecture.                                  |
| `_*.go` or `.*.go`              | Files starting with `_` or `.` are **ignored** completely by the Go tool. |

### - B. Packages

#### Does the package name have to be `main`?

**For an executable program, YES!** The package name `main` is special: it tells Go "this package is a program that can be run, not a library".

- `package main` means Go builds an **executable binary**, and it looks for the `main()` function we wrote as its starting point.
- Any other name (`package utils`, `package hello`...) means Go treats the package as a **library**, meant to be imported by other packages. Library packages can't be run on their own. Try `go run` on one and you'll get:

> package nameofproject is not a main package

So for our first application, the package name **must** be `main`.

#### Package name vs. file name

**The package name has nothing to do with the file name!** `main.go` could declare `package main`, and so could `app.go`. What matters is the `package` line inside the file.

#### One package per folder

All `.go` files inside the same folder **must declare the same package name**. If `main.go` says `package main` and another file in the same folder says `package utils`, Go will refuse to compile.

#### Naming conventions for packages

For packages other than `main`:

- Use **short, lowercase, single-word** names: `http`, `strings`, `auth`.
- No underscores and no camelCase: `userservice`, not `user_service` or `userService`.
- By convention, the package name **matches the name of its folder**.

To see these rules in action, with code split across multiple packages, check out [Packages](./packages.md).

### - C. Imports

#### Importing multiple packages

Let's say you also need to import the "errors" package.

You can write 2 `import` statements:

```go
package main

import "fmt"
import "errors"

func main() {
    fmt.Print("Hello World");
    err := errors.New("error message")
    fmt.Println(err)
}
```

Or you can combine them under one `import` call:

```go
package main

import (
    "fmt"
    "errors"
)

func main() {
    fmt.Print("Hello World");
    err := errors.New("error message")
    fmt.Println(err)
}
```

They both work!
