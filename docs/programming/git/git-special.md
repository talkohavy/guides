# Git Special Commands

## - Command 1: Force a branch to move 3 commits down

```bash
git branch -f master HEAD~3
```

<br/>

## - Command 2: Set branch X to track o/main

```bash
git checkout -b totallyNotMain o/main
```

**Demo case:**

3 branches exist: `main`, `foo`, and `o/main`.  
Both `main` & `foo` are tracking `o/main`.  
You are checked out on `foo*`.  
`r/main` contains 1 commit ahead.  
You now run: `git pull`  
Result: `foo` would download the commit, and advance/move fast forward to that commit.  
Note! `main` would stay in its place!

<br/>

## - Command 3: Change branch remote tracking

```bash
git branch -u o/main foo
```

This command will set the `foo` branch to track `o/main`.  
If `foo` is currently checked out you can even leave it off:

```bash
git branch -u o/main
```

<br/>

## - Command 4: Move to second parent

```bash
git checkout -b totallyNotMain o/main
```
