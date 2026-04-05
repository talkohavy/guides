# Git Config

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
