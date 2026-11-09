# Git Push

## 1. git push's full form

`git push` can optionally take arguments in the form of:

```bash
git push <remote> <place>
```

To really understand `git push`, we need to talk about its full form:

```bash
git push origin <source>:<destination>
```

For example:

```bash
git push origin foo:master
```

When issuing the above command, it translates to:

> **Go to the branch named `foo` within my local repository**, grab all the commits, and then **go to a branch named `master` on a remote named `origin`**, place whatever commits are missing on that branch and then tell me when you're done.

By specifying `foo` as the **source place** argument, and `master` as the **target destination place**, we essentially told git everything it needs to know. We told it **where the commits are coming from** and **where the commits are going to**. And it's job is now to synchronize between them.

Keep in mind that **since we told git everything it needs to know** (by specifying both the _source_ & the _target_), **it totally ignores the place of where we're checked out**!

---

## 2. What can we do with this full form?

When you are specifying both the _source and destination explicitly_ like so `source:destination`, it opens the door to some interesting options.

Let's see a demo!

Here is a tree:

```
Local:                          Remote:
Beginning
   C0                              C0
   |                               |
   C1 <-- master, o/master         C1 <-- master
   |
   C2
   |
   C3 <-- foo*
```

Let's run the command:

```bash
git push origin foo^:master
```

The outcome would be:

```
Local:                          Remote:

   C0                              C0
   |                               |
   C1 <-- master                   C1
   |                               |
   C2 <-- o/master                 |
   |                               |
   C3 <-- foo*                     C2 <-- master
```

Git resolved `foo^` into a location (C2), uploaded whatever commits that weren't present yet on the remote, and then updated destination.

:::note
This colon (i.e. `:`) as a separator is commonly referred to as a **colon refspec**. Refspec is just a fancy name for a location that git can figure out (like the branch `foo` or even just `HEAD~1`).
:::

---

## 3. Creating a new branch

What if the destination you want to push doesn't exist?

No problem! Just give a branch name and git will create the branch on the remote for you.

```bash
git push origin master:newBranch
```

---

## 4. Git Push's short form

Now that you understand `git push`'s full form, it's time to talk about its short form:

```bash
# Short form:
git push <remote> <place>

# Full form:
git push origin <source>:<destination>
```

When you say:

```bash
git push origin master
```

You essentially say: "Listen git, both my source and my target are `master`, so instead of me writing the same place twice as `master:master`, I'm gonna write it once".

And that's it basically! The rest is same. The meaning is still:

> **Go to the branch named `master` within my local repository**, grab all the commits, and then **go to a branch named `master` on a remote named `origin`**, place whatever commits are missing on that branch and then tell me when you're done.
