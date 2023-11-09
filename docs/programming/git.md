---
sidebar_label: 'Git'
sidebar_position: 3
---

# Guide for Git

## 1. Path of .gitconfig

The gitconfig, on all operating machines, is found at:

```bash
code ~/.gitconfig
```

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


### `Command 4: Branch out from an old commit`

```bash
git checkout -B <branch-name> <sha-of-commit>
# or...
git checkout -B <branch-name> HEAD~3
```


### `Command 5: Reset 1 file`

```bash
git checkout HEAD -- src/client.js
```


### `Command 6: Change git user name & email – Project level`  
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


### `Command 7: Upload local git to remote repo`  
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


### `Command 8: Delete a local branch`

```bash
git branch --delete "name-of-branch"
```

:::caution

You **can't** delete the branch on which you're current standing on!  
Check out from it if necessary.
:::


### `Command 9: create an alias for a git command`  

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
git config split-diffs.min-line-width 40
```

This defaults to `80`, so screens below `160` characters will display unified diffs. Set it to `0` to always show split diffs.
