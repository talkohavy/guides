---
sidebar_label: 'Git'
sidebar_position: 3
---

# Guide for Git

## 1. Most Used Commands

### `Command 1: Squashing 2 commits into 1 commit`
```bash
git reset HEAD~2
git commit -am 'newMessage'
```

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 2: amend wrong message (a typo)`
```bash
git commit --amend -m 'newMessage'
```

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 3: Branch out from an old commit`

```bash
git checkout -B <branch-name> <sha-of-commit>
# or...
git checkout -B <branch-name> HEAD~3
```

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 4: Reset 1 file`

```bash
git checkout HEAD -- src/client.js
```

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 5: Change git user name & email – Project level`  
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

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 6: Upload local git to remote repo`  
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

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />


## 2. All Commands – The Full List

### `Command 1: Show status`

```bash
git status
```
Effect: Tells you: on what branch you are on, new files, modified files, staged & unstaged files.

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

### `Command 2: add all files to staging`
```bash
git add .
```
Effect: adds all modified/new/deleted files into staging.

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />

## 3. Set User Name & Email on gitconfig

### **A. Story Time**  
_There are 3 levels of git config:_  
- 1st priority – project  
- 2nd priority – global  
- 3rd priority – system  

Question: Why would you care about the gitconfig?  
Answer: When you push to remote repo, you'll see there the details of the user that pushed the work; username, email, image. Now, if that's the case, you don't want to have some default settings making a mess out of things.  
Also, it's important to know that without a user's email you cannot perform commits!  
So in addition to adding a name, you'll also need to add an email.  
When you commit, git's first priority is the Project configs.  
The gitconfig of a project is stored at .git/config of the project's directory.  
The project configs are only available for the current project.  
When you commit, git's second priority is the Global configs.  
The global gitconfig is stored at 'C:\Users\tal\.gitconfig'.  
The global configs are available for all projects of the current user that don't use a config locally inside the project.  
When you commit, git's third priority is the System configs.  
The System gitconfig is stored at '/etc/gitconfig'.  
The System configs are available for all users/projects that don't use a config locally inside the project, nor have a global config.  

### B. Practical Use  

#### Level 1: Project level  
Check what the current values for the user & email:  

```bash
git config --get user.name
git config --get user.email
```

To create a user & email in the project's config use this:

```bash
git config user.name "Tal Kohavy"
git config user.email "talkohavy@gmail.com"
```

#### Level 2: Global level  
Check what the current values for the user & email:  

```bash
git config --global --get user.name
git config --global --get user.email
```

To create a user & email in the global config use this:  

```bash
git config --global user.name "Tal Kohavy"
git config --global user.email "talkohavy@gmail.com"
```

#### Level 3: System level
Check what the current values for the user & email:  
git config --system --get user.name  
git config --system --get user.email  
To create a user & email in the project's config use this:  

```bash
git config user.name "Tal Kohavy"
git config user.email "talkohavy@gmail.com"
```


## 4. Upload local git to remote repo  
This is for when you have a local git project, and one day you decided to put it out there on a remote repository. Here are the steps to do so:  

### • Step 1: Add a remote origin to the local project
First check that you don't already have a remote origin by:

```bash
git config --get remote.origin.url
```

Now, add a remote origin to the local project using this command:

```bash
git remote add origin <url-here>
```

Some Examples:

```bash
# - Bitbucket Example:
git remote add origin https://talkohavy@bitbucket.org/talkohavy/frontend.git  
# - GitHub Example:**_  
git remote add origin https://github.com/talkohavy/autocomplete.git
```
If you made a typo, use this:  

```bash
git remote remove origin// or just do this to overwrite:
git remote set-url origin git://new.url.here
```

You'd be asked to put in your remote credentials (meaning, password).  

### • Step 2: push your work to remote  

The Code:

```bash
git push --force -u origin master
```


:::danger PLEASE NOTE !
Without the `--force` you'll get an error.
:::

