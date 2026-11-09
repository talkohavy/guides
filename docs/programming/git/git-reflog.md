# Git Ref Log

## 1. TLDR;

Run this:

```bash
git reflog
```

---

## 2. Find lost dangling commits

Ever had a situation where you thought a commit of yours was gone forever?

`git reflog` may save you in that situation.

Here is a tree:

```text
Local:                          Remote:
Beginning
   C0                              C0
   |                               |
   C1 <-- o/master                 C1 <-- master
   |
   C2
   |
   C3 <-- master*
```

You thought C3 is already in the remote, so you ran:

```bash
git reset --hard HEAD~2
```

and now you wanna die. Because `git` is telling you "you are up-to-date". You effectively just lost C2 & C3. But wait..... did you know they are not entirely lost? In fact, your tree now looks like this:

```text
Local:                          Remote:
Beginning
   C0                              C0
   |                               |
   C1 <-- master*, o/master        C1 <-- master
   |
   C2
   |
   C3
```

C2 & C3 are what's called **dangling commits**! They are there, but unless you know their commit-hash, you have no way of getting them.

That's where `git reflog` comes in.

By running:

```bash
git reflog
```

You get a list of all recent commit-hashes:

```bash
109cee37a HEAD@{1}: reset: moving to HEAD
109cee37a HEAD@{2}: checkout: moving from newBranch to master
135e757fd HEAD@{3}: commit: test      # <----- this is the one you need!
109cee37a HEAD@{4}: reset: moving to HEAD
109cee37a HEAD@{5}: checkout: moving from master to newBranch
109cee37a HEAD@{6}: rebase (finish): returning to refs/heads/master
109cee37a HEAD@{7}: rebase (pick): Go guide: 6. Pointers
```

Now you can copy its hash, and checkout to it to grab your lost work:

```bash
git ck 135e757fd
```
