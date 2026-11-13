# Processes & Servers

## 1. A forgotten sudo

You ran a command, but forgot to add `sudo`. Instead of retyping the whole thing, just run:

```bash
sudo !!
```

You would see the entire command appear inline with `sudo` in front. It's not being executed, it just appears.

---

## 2. Jump to start/end of line

You have a long command

```bash
docker run -d -p 8080:8080 --name wen nginx
```

Hit <kbd>Ctrl</kbd>+<kbd>A</kbd> to go to the **start of the line**.  
Hit <kbd>Ctrl</kbd>+<kbd>E</kbd> to go to the **end of the line**.

---

## 3. Delete a word

Hit <kbd>Ctrl</kbd>+<kbd>w</kbd> to delete a word.

```bash
docker run -d -p 8080:8080 --name wen nginx
```

---

## 4. Avoid permission denied on append to file

This:

```bash
echo "127.0.0.1 luckylove.co.il" >> /etc/hosts
```

won't work. Not even if you add sudo at the beginning (try doing `sudo !!`).

That's because the >> sign is not part of `echo`. Your shell opens the file before `sudo` even runs. And your shell is running as YOU, not as `root`. So `sudo` only applied to `echo`, which never needed it.

The fix is a command called `tee`.

Run this:

```bash
echo "127.0.0.1 luckylove.co.il" | sudo tee -a /etc/hosts
```

`tee` **reads standard input and writes it** simultaneously to both standard output (your terminal screen) and one or more files. And since `tee` is running with `sudo`, it is allowed to write there. The `-a` means _append_. Without it, `tee` replaces the whole file.

---

## 5. Half way through a command

You wrote a very complex command:

```bash
docker run -d -p 8080:8080 --name wen nginx
```

The you realize you need to run something else first.

Instead of deleting it:

1.  Press <kbd>Ctrl</kbd>+<kbd>u</kbd>.
2.  Run your important command.
3.  Press <kbd>Ctrl</kbd>+<kbd>y</kbd>.

ctrl+u cuts everything in the line, and `bash` holds on to it. Then you can run whatever you need, and when you're done press ctrl+y and your stored command comes back.

---

## 6. Pause a program

1. To pause: hit <kbd>Ctrl</kbd>+<kbd>z</kbd>
2. To resume: run `fg`

This if for when a program is taking over your terminal, like a live server, or `tail -f`, and you need your terminal for real quick.

Hit press <kbd>Ctrl</kbd>+<kbd>z</kbd>

That pauses the program, and gives you your prompt back, without closing anything.

Run what you need, then when you're done run: `fg`

If you've pause several things, run `jobs` to see all of them:

```bash
jobs
```

If you try to exit a terminal with paused programs, bash will warn you:

```
~ exit
There are stopped jobs.
```
