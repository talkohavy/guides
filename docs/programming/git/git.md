# Guide for Git

## - All paths to .gitconfig

There are 3 Levels of `.gitconfig`: `project`, `global` & `system`.  
The .gitconfig, on all operating machines, is found at:

```bash
# - Project Level
code .git/config

# - Global Level
code ~/.gitconfig

# - System Level (What about windows?)
code /etc/gitconfig
```

I always use the gitconfig in the `global` level.  
That's where I usually put my "globally" configs.  
So like `user.name`, `user.email`, all of my `aliases`, the `git-split-diffs`, etc.

As of today, here's how my .gitconfig looks:

```bash
[alias]
	logs = log --graph --oneline --decorate
	df = diff HEAD
	ck = checkout
	pop = stash pop
	apply = stash apply
	name = rev-parse --abbrev-ref HEAD
	unstage = restore --staged .
	s = status
	comit = commit
	amend = commit --amend --no-edit
[user]
	name = Tal Kohavy
	email = talkohavy@gmail.com
[core]
	pager = git-split-diffs --color | less -RF
```

---

## - Command 1: remote

**Description**

The `remote` sub-command has 3 useful sub-commands:

1. `add`
2. `remove`
3. `set-url`

The `add` command fails when `name` already exists.
The `set-url` command fails when `name` doesn't exist.

The `set-url` command is useful in cases you made a typo on the `URL` of some existing `name`.

`origin` is the default name of your remote git, and is selected by default when you run a `git push` or `git pull`. This means you're basically running `git push origin` behind the scenes.

I will demonstrate some useful use-cases with it down below.

---

## - `remote`: List all remote urls

```bash
git remote -v
```

## - `remote`: Remove a remote by `name`

```bash
git remote rm origin
```

Or...

```bash
git remote remove origin
```

## - `remote`: Add new remote origin url

(provide a `name` & a `URL`. If `name` already exists, throws an error)

```bash
git remote add origin PASTE_URL_HERE
```

## - `remote`: Update current existing remote

You'll need to provide 2 things:

- a `name`
- a new `URL`.

If `name` doesn't exist, it throws an error.

```bash
git remote set-url origin PASTE_URL_HERE
```

---

## - Command 2: config

**Description**

You can use the config command to set up things like the `user.name`, `user.email`. And why should you care about the user & email? Because without a user & an email **you cannot perform commits**!

## - `config`: Get current remote origin url

```bash
git config --get remote.origin.url
```

## - `config`: Get/Set git user `name` & `email`

Get:

```bash
# - Level 1: Project Level
git config --get user.name
git config --get user.email

# - Level 2: Global Level
git config --global --get user.name
git config --global --get user.email

# - Level 3: System Level
git config --system --get user.name
git config --system --get user.email
```

Set:

```bash
# - Level 1: Project Level
git config user.name "Tal Kohavy"
git config user.email "talkohavy@gmail.com"

# - Level 2: Global Level
git config --global user.name "Tal Kohavy"
git config --global user.email "talkohavy@gmail.com"

# - Level 3: System Level
git config --system user.name "Tal Kohavy"
git config --system user.email "talkohavy@gmail.com"
```

## - `config`: Create an alias

```bash
git config --global alias.logs "log --graph --oneline --decorate"
git logs

git config --global alias.ck "checkout"
git ck

git config --global alias.pop "stash pop"
git pop

git config --global alias.pop "stash apply"
git apply

git config --global alias.name "rev-parse --abbrev-ref HEAD"
git name
```

---

## - `branch`: Rename a local branch

```bash
git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME
```

Or just...

```bash
git branch -m NEW_BRANCH_NAME
```

if you want to rename the branch you are currently on.

## - `branch`: Delete a local branch

```bash
git branch --delete NAME_OF_BRANCH
```

:::caution

You **can't** delete the branch on which you're current standing on!  
Check out from it if necessary.
:::

## - `push`: Delete a remote branch

```bash
git push origin :REMOTE_BRANCH_NAME
```

---

## - `checkout`: Reset 1 file

```bash
git checkout HEAD -- src/client.js
```

## - `checkout`: Branch out from an old commit

```bash
git checkout -B BRANCH_NAME SHA_OF_COMMIT
```

or...

```bash
git checkout -B BRANCH_NAME HEAD~3
```

---

## - `clean`: delete new files

```bash
git clean -df
```

---

## - `commit`: amend wrong author

```bash
git commit --amend --author "Tal Kohavy <talkohavy@gmail.com>"
```
