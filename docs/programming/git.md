# Guide for Git

## Git Commands

### - Command 1: remote

#### Description

The `remote` sub-command has 3 useful sub-commands:

1. `add`
2. `remove`
3. `set-url`

The `add` command fails when `name` already exists.
The `set-url` command fails when `name` doesn't exist.

The `set-url` command is useful in cases you made a typo on the `URL` of some existing `name`.

`origin` is the default name of your remote git, and is selected by default when you run a `git push` or `git pull`. This means you're basically running `git push origin` behind the scenes.

#### Use Cases

List all remote urls:

```bash
git remote -v
```

Remove a remote by `name`:

```bash
git remote rm origin
```

Or...

```bash
git remote remove origin
```

Add new remote origin url:  
(provide a `name` & a `URL`. If `name` already exists, throws an error)

```bash
git remote add origin PASTE_URL_HERE
```

Update current existing remote origin by name url:  
(provide a `name` & a `URL`. If `name` doesn't exist, throws an error)

```bash
git remote set-url origin PASTE_URL_HERE
```

### - Command 2: config

#### Description

You can use the config command to set up things like the `user.name`, `user.email`. And why should you care about the user & email? Because without a user & an email **you cannot perform commits**!

#### Use Cases

Get current remote origin url:

```bash
git config --get remote.origin.url
```

Get git user `name` & `email`:

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

Update git user name & email at the project:

```bash
git config user.name "Tal Kohavy"
git config user.email talkohavy@gmail.com
```

In order to set new values use:

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

Create an alias for a git command:

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

### - Command 3: branch

#### Use Cases

Delete a local branch:

```bash
git branch --delete NAME_OF_BRANCH
```

:::caution

You **can't** delete the branch on which you're current standing on!  
Check out from it if necessary.
:::

Delete a remote branch:

```bash
git push origin :REMOTE_BRANCH_NAME
```

Rename a local branch:

```bash
git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME
```

Or just...

```bash
git branch -m NEW_BRANCH_NAME
```

Rename a remote branch:

Renaming a remote branch is actually a 2-step process. While you _can_ actually rename a remote branch using Github Browser in a 1-step, this is probably not what you want. Because, here is what I'm assuming that happened:

- You gave a wrong name to a local branch.
- You pushed that branch with the wrong name to the remote repo.
- You now want to renamed in both places.

The easiest & fastest way to do that is:

- rename the local branch.
- delete the remote branch.
- push the newly-named local branch to the remote.

Step 1: rename the local branch

```bash
git branch -m NEW_BRANCH_NAME
```

Step 2: delete the remote branch

```bash
git push origin :OLD_BRANCH_NAME
```

Step 3: push the newly-named branch to the remote branch

```bash
git push origin NEW_BRANCH_NAME
```

### - Command 4: checkout

#### Description

`checkout` has many actions attached to it. Use it carefully.

#### Use Cases

Reset 1 file:

```bash
git checkout HEAD -- src/client.js
```

Branch out from an old commit

```bash
git checkout -B <branch-name> <sha-of-commit>
```

or...

```bash
git checkout -B <branch-name> HEAD~3
```

### - Command 5: clean

#### Use Cases

Clean reset for all changes:

```bash
git clean -df
```

### - Command 6: commit

#### Use Cases

amend wrong author:

```bash
git commit --amend --author "Tal Kohavy <talkohavy@gmail.com>"
```

### - Command 7: filter-branch

#### Use Cases

amend wrong author on all commits:

```bash
git filter-branch --env-filter '
OLD_EMAIL="wrong@mail.com"
NEW_EMAIL="talkohavy@gmail.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

---

## All paths to .gitconfig

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

## Cool diff tool `git-split-diffs`

Get the the most powerful syntax highlighting git-diff in your terminal.
It is GitHub style, with split view (side by side).

```bash
npm install -g git-split-diffs

git config --global core.pager "git-split-diffs --color | less -RFX"
```

Enable scrolling in the terminal:

```bash
git config --global core.pager "git-split-diffs --color | less -+LFX"
```

Narrow terminals:

Split diffs can be hard to read on narrow terminals, so we revert to unified diffs if we cannot fit two lines of `min-line-width` on screen. This value is configurable:

```bash
git config --global split-diffs.min-line-width 40
```

This defaults to `80`, so screens below `160` characters will display unified diffs. Set it to `0` to always show split diffs.
