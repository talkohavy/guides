---
sidebar_label: '8. npm publish a package'
sidebar_position: 7
---

# How to publish your NPM Package

## 1. Getting started

Create a new folder, and init a git project (Give it a meaningful name).

```bash
npm init
```

You can prefix your packages, just @redux-toolkit or @babel did, with @someName at the beginning.  
If you wish to _prefix_ your package, you can do manually post initiation, or you can do so during the init process, using the `scope` flag:

```bash
npm init --scope=talkohavy
```

This will have your package scoped.  
For example, the above package would get a prefix of "@talkohavy/" added to its name.

## 2. Connect project to GitHub

This step isn't mandatory I guess, ...  
i'll need to check.
Make a commit and connect the project to a remote git repo.

```
git init
git add .
git commit -m 'first commit'
git remote add origin git@github.com:talkohavy/<name>.git
git push -u origin master
```

## 3. Package Contents

Create the following structure:

- An index.js
- A lib directory
- A **test** folder

## 4. Use `npm link` to import package locally

Before publishing a package to npm, you can test it locally by importing it to a side-project, and check that it works.  
For that we use the command `npm link`.

### • Step 1: npm link

Go into the package folder, and run the command:

```bash
npm link
```

Running `npm link` symlinks a package folder. This is handy for installing your own stuff, so that you can work on it and test iteratively without having to continually rebuild.

### • Step 2: npm link pkg-name

Create a dummy project somewhere on your machine, and do:

```
npm init -y
npm link <pkg-name>
```

In the dummy project, create a quick script which imports the to-be-published package, and test it.

:::info

**HOW DOES `NPM LINK` WORK?**

Package linking is a two-step process:

1. Run `npm link` inside the package you wish to publish
2. Run `npm link <pkg-name>` inside the test package which imports the package.

The first step will create a symlink in the global folder < prefix>/lib/node_modules/< name-of-package> that links to the package where the `npm link` command was executed.

The second step will create a symbolic link from globally-installed package-name to node_modules/ of the current folder.

:::tip
Note that package-name is taken from package.json, not from the directory name.
:::

## 5. Publish package to npm registry

Now that we've verified that our package works locally, it;s time we upload it to our personal npm registry.  
uploading is called publish in npm, and the command is `npm publish`.
Before you can publish, you need to login to npm.

To login run the `npm login` command:

```bash
npm login
```

You'll be asked to input your username (talkohavy), your password (a9...), and your email (ta\*\*\*@gmail.com). You'll also be sent a one-time password to your email.

Now that we've logged in successfully, it's time to publish our package:

```bash
npm publish
```

If your package is prefixed (i.e. @talkohavy/lodash), you'll have to add the access public flag:

```bash
npm publish --access=public
```

Without the access public flag, you'll get an error saying you must sign up for private packages, and the the publish command will fail.  
This is because when trying to publish, by default, npm thinks you're trying to publish a private package. You can fix this by adding the `access` flag to the publish command, and setting it to _public_, telling npm that this package is in fact public.
