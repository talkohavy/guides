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

## 3. Defining a Package

In Go, everything is organized into packages. When we create out own application, we also have to include it in a package. And doing that is actually very very simple. At the top of our file, we use the `package` keyword, and then name of the package, which our application be part of. It looks like this:

```go
package main
```

The standard name for the _main_ application is "main".

## 3. Go Entrypoint

If we try to write this code:

```go
package main

Print("Hello World");
```

**We would get an error for `Print`**.

The error says:

> expected declaration, found Print syntax

Now you may think "Well that's because I did not say where `Print` is coming from!". That's also true, but we'll tackle that later.

**The error is saying "I don't know where to start"**.

That's `Go`'s way of saying: "I don't know where to start executing this application. Give me an entrypoint". And we have to declare that entrypoint of our application. Because when we run Go applications, we need the main starting point for the execution. So Go needs to know where does it start executing the code.

**In Go, that entrypoint is a function called `main`!**

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

## 4. Importing Packages

### - A. Import a package

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

### - B. Import multiple packages

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

Or you can combine them under on `import` call:

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

---

## 5. Compile a program

Basic form:

```bash
go build src/main.go
```

This **produces a binary file** named the same as the input file, at the directory inside which you ran the command.

To **change the destination** and the **output file name**, use the `-o` flag:

```bash
go build -o dist/index src/main.go
```

Notice that **flags come before the path of the input file**! Reverse order would result with an error.

---

## 6. Run a program

Just execute the file:

```bash
./dist/index
```

depending on the compile output's destination and the filename.

---

## 7. Compile & Run in a single command

Run this:

```bash
go run src/main.go
```

Using the `run` command, the project is compiled in memory, which means **no output file is created!** as opposed to `go build`, which generates an output file.

---

## 8. Using `.`

As you'll see in later stages when we discuss `packages`, the proper way to run a project is by using `.`.

Run this command:

```go
go run .
```

Or if your main file is inside an `src` folder:

```go
go run ./src
```

**The `./` prefix is a MUST! Go doesn't understand absolute paths.**
