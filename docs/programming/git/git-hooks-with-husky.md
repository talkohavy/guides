# Git hooks with Husky

This is for when you just installed husky.

## - Command 1: Check if husky got configured properly

```bash
git config --get core.hooksPath
```

You should see: `.husky/_` as an output.

---

## - Command 2: Set husky as a git hook

```bash
git config core.hooksPath .husky/_
```

**Description**

Set git hooks to point to husky.

---

## - Note: don't put your hooks in `.husky/_`

`.husky/_` is an internal, auto-generated folder — it's just the plumbing Husky uses to dispatch to your actual hook scripts. Don't create or edit files inside it manually.

Your actual hook files (`pre-commit`, `commit-msg`, etc.) go **one level up**, directly in `.husky/`:

```bash
.husky/pre-commit
.husky/commit-msg
```

`core.hooksPath` points at `.husky/_`, but that's only where Husky's internal linking script lives.

---

## - `pre-commit` vs `commit-msg`

These two run at different points of the commit process and receive different input:

**`pre-commit`**

- Runs first, right after you type `git commit` but **before** the commit message editor even opens.
- Has no access to the commit message (it doesn't exist yet).
- Typically used to check/fix the code you're about to commit: linting, formatting, running tests, blocking commits with debug statements, etc.
- If it exits with a non-zero status, the commit is aborted before you ever see the message prompt.

**`commit-msg`**

- Runs **after** you've written the commit message, but **before** the commit is finalized.
- Receives one argument: the path to a temp file containing the commit message you just wrote.
- Typically used to validate/enforce the commit message itself: conventional commit format, ticket number references, minimum length, banned words, etc.
- If it exits with a non-zero status, the commit is aborted and you keep your typed message so you can fix it.

**Order in the flow:** `pre-commit` → (you write the message) → `commit-msg` → commit is created.
