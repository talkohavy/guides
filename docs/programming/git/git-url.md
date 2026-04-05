# Git origin URL

## - Command 1: List all remote urls

```bash
git remote -v
```

**Description**

List all remote urls

---

## - Command 2: Get current origin URL

```bash
git config --get remote.origin.url
```

**Description**

Get the current remote origin URL.

---

## - Command 3: Add origin

```bash
git remote add origin PASTE
```

**Description**

The `add` command fails when `name` already exists.

`origin` is the default name of your remote git, and is selected by default when you run a `git push` or `git pull`. This means you're basically running `git push origin` behind the scenes.

---

## - Command 4: Remove origin

```bash
git remote remove origin
```

Or...

```bash
git remote rm origin
```

**Description**

Remove remote git by name.

---

## - Command 5: Update origin

```bash
git remote set-url origin PASTE
```

**Description**

Update current existing remote.

The `set-url` command fails when `name` doesn't exist.

The `set-url` command is useful in cases you made a typo on the `URL` of some existing `name`.

You'll need to provide 2 things:

- a `name`
- a new `URL`.
