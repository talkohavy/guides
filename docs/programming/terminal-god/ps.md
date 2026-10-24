# Linux `ps`: A Quick Guide

## 1. What is `ps`?

`ps` (process status) displays information about processes running on your system.

Use it when you want to:

- Find a process by name.
- Check a process's PID (process ID).
- Inspect CPU and memory usage.
- Identify a process's parent process.
- Investigate a process that isn't behaving as expected.
- Find a process to terminate with `kill`.

**Important:** `ps` provides a snapshot of processes at the time you run the command. Unlike `top` or `htop`, it doesn't continuously refresh.

---

## 2. The Most Important Commands

### `ps`

```bash
ps
```

Running `ps` alone displays processes associated with the current terminal session.

### `ps aux`

```bash
ps aux
```

A widely used BSD-style syntax that displays processes from all users, including processes without a controlling terminal, in a user-oriented format.

---

## 3. Understanding the Flags

The `ps` command supports several option styles, so not every option follows exactly the same conventions.

| Option    | Meaning                                 | Example                        |
| --------- | --------------------------------------- | ------------------------------ |
| `-e`      | Select all processes                    | `ps -e`                        |
| `-f`      | Full-format listing                     | `ps -f`                        |
| `-l`      | Long-format listing                     | `ps -l`                        |
| `-u USER` | Select processes associated with a user | `ps -u root`                   |
| `-p PID`  | Select a specific process by PID        | `ps -p 1234`                   |
| `-o`      | Choose output columns                   | `ps -eo pid,comm,%cpu,%mem`    |
| `--sort`  | Sort by a column on Linux procps-ng     | `ps -eo pid,%cpu --sort=-%cpu` |

### BSD-style options used by `ps aux`

| Option | Meaning                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------- |
| `a`    | Select processes associated with terminals, subject to BSD selection rules, including terminals other than your own |
| `u`    | Use a user-oriented output format                                                                                   |
| `x`    | Include processes without a controlling terminal                                                                    |

Together, `aux` produces the familiar, broad process listing.

---

## 4. Finding Processes

### Search for a process by name

```bash
ps aux | grep nginx
```

This searches the output for lines containing `nginx`.

### Find a process by PID

```bash
ps -p 1234
```

Replace `1234` with the PID you're investigating.

### Find processes belonging to a user

```bash
ps -u alice
```

To display all processes with their owner information:

```bash
ps -eo user,pid,ppid,comm,%cpu,%mem
```
