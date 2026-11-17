# os

## 1. What is `os`?

`os` is the package for **talking to the operating system**: reading and writing files, environment variables, command-line arguments, and exiting the program.

```go
import "os"
```

If you're coming from Node.js, it's a mix of `process` (`process.argv`, `process.env`, `process.exit`) and `fs`.

---

## 2. Command-line arguments: `os.Args`

`os.Args` is a slice of strings with the arguments your program was started with:

```bash
./app hello world
```

```go
fmt.Println(os.Args)     // <--- [./app hello world]
fmt.Println(os.Args[1:]) // <--- [hello world]
```

**The first item is always the program itself**, so the actual arguments start at index `1`. Just like `process.argv` in Node (which starts at index `2`).

**Note:** `os.Args` is fine for one or two simple arguments. For real flags (like `--port=8080`), use the `flag` package.

---

## 3. Environment variables

### - A. `Getenv`

```go
port := os.Getenv("APP_PORT")
```

If the variable isn't set, you get an **empty string**, not an error.

### - B. `LookupEnv`: was it set at all?

Sometimes an empty string is a valid value, and you need to know the difference between "set to empty" and "not set". For that, use `LookupEnv`. It uses the same "comma ok" pattern we saw with maps in [Data Types](../data-types.md):

```go
port, ok := os.LookupEnv("APP_PORT")
if !ok {
    port = "3000" // <--- default value
}
```

### - C. `Setenv`

```go
os.Setenv("APP_PORT", "8080")
```

This only affects the current program (and programs it starts), not your terminal.

---

## 4. Reading & writing files

### - A. `ReadFile`: read a whole file

```go
data, err := os.ReadFile("notes.txt")
if err != nil {
    fmt.Println("could not read file:", err)
    return
}

fmt.Println(string(data))
```

`ReadFile` returns a `[]byte` (raw bytes), not a string. Convert it with `string(data)`.

### - B. `WriteFile`: write a whole file

```go
err := os.WriteFile("notes.txt", []byte("hello\nworld\n"), 0o644)
```

It creates the file if it doesn't exist, and **overwrites** it if it does.

That third argument, `0o644`, is the file's **permissions**, in the same octal format as `chmod`. `0o644` means "the owner can read and write, everybody else can only read". It's what you want for regular files.

### - C. Appending to a file

To add to the end of a file instead of overwriting it, open it with `OpenFile` and the right flags:

```go
f, err := os.OpenFile("notes.txt", os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0o644)
if err != nil {
    return err
}
defer f.Close()

fmt.Fprintln(f, "appended line")
```

Notice the `defer f.Close()`. When you open a file yourself, **you're responsible for closing it**. `defer` makes sure that happens when the function returns. (`ReadFile` and `WriteFile` close the file for you.)

Also notice `fmt.Fprintln(f, ...)`. A file is something you can write to, so all the `F` functions from [fmt](./fmt.md) work with it.

### - D. Does a file exist?

```go
_, err := os.Stat("notes.txt")
if errors.Is(err, os.ErrNotExist) {
    fmt.Println("no such file")
}
```

`os.Stat` returns information about a file (size, modification time...). If the file doesn't exist, the error is `os.ErrNotExist`. That's the [sentinel error](./errors.md) pattern.

---

## 5. Directories

```go
os.MkdirAll("data/images", 0o755) // <--- like `mkdir -p`
os.Remove("notes.txt")            // <--- delete a file, or an empty folder
os.RemoveAll("data")              // <--- like `rm -rf` ❗ careful!
wd, err := os.Getwd()             // <--- the current working directory
```

Folders use `0o755` instead of `0o644`, because a folder needs the "execute" permission to be opened.

**Tip:** to build file paths, use `filepath.Join("data", "images", "cat.png")` (from `path/filepath`), instead of gluing strings with `/`. It uses the right separator for the operating system (`\` on Windows).

---

## 6. Standard streams: `Stdin`, `Stdout`, `Stderr`

The three standard streams are available as files:

- `os.Stdin`: the input (what the user types).
- `os.Stdout`: the regular output. This is where `fmt.Println` writes.
- `os.Stderr`: the output for errors and logs.

```go
fmt.Fprintln(os.Stderr, "something went wrong")
```

---

## 7. `os.Exit`: stop the program

```go
os.Exit(1)
```

The number is the **exit code**: `0` means success, anything else means failure. Scripts and CI tools use it to know whether your program worked.

**Gotcha:** `os.Exit` stops the program **immediately**. Deferred functions do **not** run:

```go
defer fmt.Println("this never prints")
os.Exit(1)
```

So don't call `os.Exit` in a function that has cleanup work in a `defer` (like closing a file). A common pattern is to do all the work in a separate function that returns an error, and only call `os.Exit` from `main`:

```go
func main() {
    if err := run(); err != nil {
        fmt.Fprintln(os.Stderr, "error:", err)
        os.Exit(1)
    }
}
```

---

## 8. Cheat sheet

| Function                         | What it does                                 |
| -------------------------------- | -------------------------------------------- |
| `os.Args`                        | Command-line arguments (index 0 is the app)  |
| `os.Getenv(key)`                 | Read an env variable (`""` if not set)       |
| `os.LookupEnv(key)`              | Read an env variable, and whether it was set |
| `os.ReadFile(path)`              | Read a whole file, as `[]byte`               |
| `os.WriteFile(path, data, perm)` | Write (or overwrite) a whole file            |
| `os.OpenFile(path, flags, perm)` | Open a file, e.g. for appending              |
| `os.Stat(path)`                  | File info (check `os.ErrNotExist`)           |
| `os.MkdirAll(path, perm)`        | Create folders, like `mkdir -p`              |
| `os.Remove` / `os.RemoveAll`     | Delete a file / a whole folder               |
| `os.Stdout` / `os.Stderr`        | Standard output / error streams              |
| `os.Exit(code)`                  | Stop immediately (defers don't run!)         |
