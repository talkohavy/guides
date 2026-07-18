# Git Branch

## - Command 1: Rename a local branch

```bash
git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME
```

Or just...

```bash
git branch -m NEW_BRANCH_NAME
```

**Description**

Rename a local branch.

Short version let's you rename the branch you're currently on.

---

## - Command 2: Delete a local branch

```bash
git branch --delete NAME_OF_BRANCH
```

**Description**

Delete a local branch.

Use `-D` instead of `--delete` to force.

:::caution

You **can't** delete the branch on which you're current standing on!  
Check out from it first if so.
:::

---

## - Command 3: Delete a remote branch

```bash
git push origin :REMOTE_BRANCH_NAME
```

**Description**

Delete a remote branch.

---

## - Command 4: Create a new branch

```bash
git branch SIDE [ref:-HEAD]
```

**Description**

Create a new branch, without checking out to it.  
If branch with that name already exists, the command fails.

Example:

```bash
git branch bugWork HEAD~1^2~2
```

If your goal is to move the existing branch to the current commit:

```bash
git branch -f bugWork HEAD~1^2~2
```

The `-f` (force) flag updates my-branch to point to `HEAD~1^2~2`, even if it already exists.
