# A Watch Server

## 1. Introduction

Go **doesn't have** a watch mode. `go run` compiles and runs your program once, and that's it: every time you change a file you have to stop the server and run it again.

[Air](https://github.com/air-verse/air) fixes that. It watches your files, and on every save it:

1. Rebuilds the binary
2. Kills the running server
3. Starts the new binary

It's the Go equivalent of `nodemon` / `tsx watch`.

---

## 2. Install

```bash
go install github.com/air-verse/air@latest
```

`go install` puts the binary in `$(go env GOPATH)/bin` (usually `~/go/bin`). Make sure that folder is on your `PATH`, otherwise your shell won't find `air`:

```bash
# ~/.zshrc
export PATH="$PATH:$(go env GOPATH)/bin"
```

Verify:

```bash
air -v
```

---

## 3. Create the config file

From the project root:

```bash
air init
```

This creates a `.air.toml` file with all the defaults.

You _can_ run `air` without one, but it's better to have one.

---

## 4. Point the build command at your main package

The default value for `cmd` is:

```toml
[build]
  cmd = "go build -o ./tmp/main ."
```

That only works if `main.go` sits at the root of the project.

If you move it inside `src/`, you need to change it to:

```toml
[build]
  cmd = "go build -o ./tmp/main ./src"
```

---

## 5. Run

```bash
air
```

Save any `.go` file and you'll see Air rebuild and restart the server in the terminal.

---

## 6. The settings worth knowing

Everything lives under `[build]` in `.air.toml`:

| Setting          | Default                          | What it does                                                       |
| ---------------- | -------------------------------- | ------------------------------------------------------------------ |
| `cmd`            | `go build -o ./tmp/main .`       | The build command. Runs on every change.                           |
| `entrypoint`     | `["./tmp/main"]`                 | The binary to run after a successful build. Must match `-o` above. |
| `args_bin`       | `[]`                             | Extra arguments passed to your binary, e.g. `["--port", "8000"]`.  |
| `include_ext`    | `["go", "tpl", "tmpl", "html"]`  | File extensions that trigger a rebuild.                            |
| `exclude_dir`    | `["assets", "tmp", "vendor", …]` | Folders to ignore. `tmp` **must** stay here, or you get a loop.    |
| `exclude_regex`  | `["_test.go"]`                   | Files to ignore. Editing tests doesn't restart the server.         |
| `delay`          | `1000`                           | Milliseconds to wait after a change before rebuilding.             |
| `stop_on_error`  | `false`                          | If `false`, a failed build keeps the old server running.           |
| `send_interrupt` | `false`                          | Send `SIGINT` before killing, so the server can shut down cleanly. |
