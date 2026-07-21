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

## - Command 3: Change remote tracking of a branch

```bash
git branch -u o/main foo
```

For this command to work, `foo` must initially exist!  
This command will set the `foo` branch to track `o/main`.  
If `foo` is currently checked out you can even leave it off:

```bash
git branch -u o/main
```

<br/>

## - Command 4: Create a new branch that is tracking o/main

```bash
git checkout -b totallyNotMain o/main
```

## - Command 5: Go to second parent

Use the `^2` to go to the second parent of a ref:

```bash
git branch -f bugWork HEAD~1^2~2
```

Translation: Go 1 commit before `HEAD`, from there go the second parent, then go 2 commits backwards from there.
