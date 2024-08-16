# Guide for Git

## 1. Path of .gitconfig

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

## 2. Most Used Commands

### `Command 1: Squashing 2 commits into 1 commit`

```bash
git reset HEAD~2
git commit -am 'newMessage'
```

### `Command 2: amend - wrong message (a typo)`

```bash
git commit --amend -m 'newMessage'
```

### `Command 3: amend - wrong author`

```bash
git commit --amend --author "Tal Kohavy <talkohavy@gmail.com>"
```

### `Command 4: amend - wrong author on all commits`

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

### `Command 5: Branch out from an old commit`

```bash
git checkout -B <branch-name> <sha-of-commit>
# or...
git checkout -B <branch-name> HEAD~3
```

### `Command 6: Reset 1 file`

```bash
git checkout HEAD -- src/client.js
```

### `Command 7: Change git user name & email – Project level`

Get email & user in Project level (lvl 1).  
Use this to check who is the current user:

```bash
git config --get user.name
git config --get user.email
```

Use this to change the values:

```bash
git config user.name "Tal Kohavy"
git config user.email talkohavy@gmail.com
or…
git config user.name "Tal Kochavi"
git config user.email "tal@seadata.co.il"
```

### `Command 8: Upload local git to remote repo`

First check that you don't already have a remote origin by:

```bash
git config --get remote.origin.url
```

Copy the repository's url, and add it to your remote origin:

```bash
git remote add origin yourRemoteUrlHereUsernameIncluded
```

Now push force your code to remote:

```bash
git push --force -u origin master
```

### `Command 9: Delete a local branch`

```bash
git branch --delete "name-of-branch"
```

:::caution

You **can't** delete the branch on which you're current standing on!  
Check out from it if necessary.
:::

### `Command 10: Rename a local branch`

Renaming a local branch is easy:

```bash
git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME
```

### `Command 11: Rename a remote branch`

Renaming a remote branch is actually a 2-step process. While you _can_ actually rename a remote branch using Github Browser in a 1-step, this is probably not what you want. Because, here is what I'm assuming that happened:

- You gave a wrong name to a local branch
- You pushed that branch with the wrong name to the remote
  That's the most common scenario.

So, first you need to rename the local branch, then delete the remote branch, and then push the newly-named local branch to the remote.

Step 1: rename the local branch

```bash
git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME
```

Step 2: delete the remote branch

```bash
git push origin :OLD_BRANCH_NAME
```

Step 3: push the newly-named branch to the remote branch

```bash
git push origin NEW_BRANCH_NAME
```

### `Command 11: create an alias for a git command`

Here are my personal favorites:

```bash
git config --global alias.logs "log --graph --oneline --decorate"
git logs

git config --global alias.df "diff HEAD"
git df

git config --global alias.ck "checkout"
git ck

git config --global alias.pop "stash pop"
git pop

git config --global alias.pop "stash apply"
git apply

git config --global alias.name "rev-parse --abbrev-ref HEAD"
git name

git config --global alias.unstage "restore --staged ."
git unstage
```

### `Command 10: clean reset for all changes`

The best way to reset all changes is:

```bash
git clean -df
```

---

## 3. git-split-diffs

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

---

## 4. How to set User & Email on git config

In order to check what your current email & username are use:

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

Why would you care about the user & email?

**Without a user & an email you cannot perform commits!**

---

## 5. Upload a local git repo to a remote repo

Follow these 3 simple steps:

### - Step 1: Create a remote repo on some git providers

Choose either Github or Bitbucket or whatever, and create a remote git repo.  
Get the **URL**!

### - Step 2: Add a remote origin to the local project

Now, we need to add a `remote` repository to our local project.  
The remote repository is represented by `name` and a `url`.  
When you do a git push, the default name taken is `origin`.

Use this command to add a new remote repository url named `origin`:

```bash
git remote add origin PASTE_URL_HERE
```

Check that it's been added successfully using:

```bash
git config --get remote.origin.url
```

To watch all remote urls that are defined on a project use:

```bash
git remote -v
```

To remove a remote repository you need to provide its name:

```bash
git remote rm origin
# Or...
git remote remove origin
```

They are the same command! _rm_ is short for _remove_.

The `remote` sub-command has 3 useful sub-commands:

1. `add`
2. `remove`
3. `set-url`

We've already seen the `add` and `remove`.  
But there's also `set-url`.

```bash
git remote set-url origin git://new.url.here
```

With `set-url` you can edit just the `url` part of the remote repo.  
It's useful in cases you made a typo.

### - Step 3: push your work to remote

Run this code:

```bash
git push --force -u origin master
```

:::caution
Note! Without the force you'll get an error!
:::
