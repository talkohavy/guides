# Git Push

`git push` can optionally take arguments in the form of:

```bash
git push <remote> <place>
```

What is a `<place>` parameter you say? We'll dive into the specifics soon, but first an example. Issuing the command:

```bash
git push origin main
```

translates to this in English:

> Go to the branch named "main" in my repository, grab all the commits, and then go to the branch "main" on the remote named "origin". Place whatever commits are missing on that branch and then tell me when you're done.

By specifying main as the "place" argument, we told git where the commits will come from and where the commits will go. It's essentially the "place" or "location" to synchronize between the two repositories.

Keep in mind that since we told git everything it needs to know (by specifying both arguments), it totally ignores where we are checked out!

Now you might then be wondering -- what if we wanted the source and destination to be different? What if you wanted to push commits from the foo branch locally onto the bar branch on remote? Of course it's possible !

In order to specify both the source and the destination of `<place>`, simply join the two together with a colon:

```bash
git push origin <source>:<destination>
```

This is commonly referred to as a colon refspec. Refspec is just a fancy name for a location that git can figure out (like the branch `foo` or even just `HEAD~1`).

Once you are specifying both the source and destination independently, you can get quite fancy and precise with remote commands. Let's see a demo!

Before the push, the local repo has `foo` pointing at `C3` (with `C2` below it), while `main`/`o/main` both point at `C1`. The remote only knows about `C0` and `C1` (`main` on remote points at `C1`):

```
Local:                          Remote:

   C0                              C0
   |                               |
   C1 <-- main, o/main             C1 <-- main
   |
   C2
   |
   C3 <-- foo*
```

Let's run the command:

```bash
git push origin foo^:main
```

```
Local:                          Remote:

   C0                              C0
   |                               |
   C1 <-- main                     C1
   |                               |
   C2 <-- o/main                   |
   |                               |
   C3 <-- foo*                     C1 <-- main
```

Woah! That's a pretty trippy command but it makes sense -- git resolved `foo^` into a location, uploaded whatever commits that weren't present yet on the remote, and then updated destination.

What if the destination you want to push doesn't exist? No problem! Just give a branch name and git will create the branch on the remote for you.

```bash
git push origin main:newBranch
```
