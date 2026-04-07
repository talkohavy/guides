# Git Tags

## - Command 1: List tags

```bash
git tag
```

**Description**

List all tags

---

## - Command 2: Add new tag

```bash
git tag NAME
```

**Description**

Adds a new tag to a commit.

Fails if tag already exists.

---

## - Command 3: Delete a local tag

```bash
git tag -d NAME
```

**Description**

Delete a tag locally.

Fails if tag doesn't exist.

---

## - Command 4: Delete a remote tag

```bash
git push origin --delete NAME
```

**Description**

Delete tag from remote.

---

## - Command 5: Push tags to remote

```bash
git push --tags
```

**Description**

Pushes tags to remote.

Without flag, tags are not pushed to remote.
