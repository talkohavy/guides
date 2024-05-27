---
sidebar_label: '8. npm publish a package'
sidebar_position: 7
---

# How to publish your NPM Package

## 1. Init a project package.json

Create a new folder, and init a git project (Give it a meaningful name).

```bash
npm init
```

You can prefix your packages, just like @redux-toolkit or @babel did, with @some-name at the beginning.  
If you wish to _prefix_ your package, you can do so manually _post_ initialization, or you can do so _during_ the init process, using the `scope` flag:

```bash
npm init --scope=talkohavy
```

This will have your package scoped.  
For example, the above package would get a prefix of "@talkohavy/" added to its name.

---

## 2. Connect project to GitHub

This step is mandatory. Every npm package needs to be connected to a remote git repo.

```
git init
git add .
git commit -m 'first commit'
git remote add origin git@github.com:talkohavy/<name>.git
git push -u origin master
```

---

## 3. Add some content to the Package

Create the following structure:

- An `src` directory with an `index.js`
- A **\_test\_** folder
- A README.md file

And later on:

- build.config.js
- jsconfig.json
- .npmrc
- Changesets-cli
- Eslint
- Prettier
- Husky

---

## 4. Develop a build process

While you _can_ serve the root of the project as the package itself, it is not recommended. There are a lot of things you'll need to blacklist from ending up in the final output being packaged up and be published to npm.

Even if you'll go with the whitelist approach, instead of the blacklist approach, by using the "files" within the package.json, it is still recommended to avoid serving the root directory (whether its the src or some dist folder). This is because whitelisting is something you need to maintain, and every time you'll add a new feature you'll need to go inside the package.json and update it there.

Instead, we will go with the `divide & conquer` approach.

The `divide & conquer` approach dictates that the repo used to develop the package will be separated from the package that will be shipped to npm.

Any package that is designed to be published will have the following steps:

1. Clear the dist folder (`rm -rf dist`).
2. Build the project (minify/compile/transpile, i.e. `tsc -p tsconfig.json`).
3. Copy & manipulate the `package.json`.

The benefits of the `divide & conquer` approach:

1. You don't have to whitelist anything.
2. You don't have to blacklist anything.
3. package.json include ONLY what it needs to thanks to the act of manipulation.
4. Complete control of the package's structure - the output's end result.
5. Complete separation between structures (the root and the package).

The name `divide & conquer` isn't an industry term, rather than a name I gave to this approach.

---

## 5. npm login, npm logout, .npmrc & .npmignore

### - A. npm login & .npmrc

Publishing a package to npm requires you to be logged into npm.

You can log into npm by running:

```bash
npm login
```

After running this command you'll be asked to hit enter, and a browser will open up. There, you'll have to enter a 6-digit otp, which appears on an authenticator up you have connected to your npm account beforehand.

But what about CI/CD?

A CI/CD process can't run `npm login`.  
This is where `.npmrc` comes into the picture.  
A configuration file for npm.

The `.npmrc` file can be:

- per project (found at the project's root directory)
- per user (found at the ~/.npmrc)
- global config file (found at $PREFIX/etc/npmrc)

The `.npmrc` file will contain a _token_ which will be used to publish our package without having to log in using the `npm login` command.

```bash
registry=https://registry.example.com/
//registry.npmjs.org/:_authToken=npm_some-long-hash
```

You'll of course need to create an **access token** on npm's website, under your profile. The token always starts with "npm\_", so it's easy to recognize.

:::danger
Make sure to NOT commit the `.npmrc` file! The token is highly sensitive!  
You must add it to your `.gitignore`!
:::

### - B. npm logout

Just as there is a command of `npm login` to get you logged in, there's also a command to logout:

```bash
npm logout
```

It is **SUPER** important to know this command and understand what it does under the hood, because it's not so straightforward.

Not only that `npm logout` logs you out, it also **DELETES** the .npmrc file. So if you find yourself asking "where did my npmrc file go?", it could very much be that you ran `npm logout`, which deleted your file.

Another important piece of information is: if you had a token that should last a year, and you just commit an `npm logout`, you have invalidated your token permanently! And it can no longer be used!

To sum it up, npm logout does 2 things:

1. It deleted the line which includes the token from your .npmrc file.
   - If your `.npmrc` file contains only that 1 line with the token, the .npmrc file is deleted for good.
2. It in validates the token.

### - C. .npmignore

You can use the `.npmignore` to blacklist files and folders from getting to the final package output that'll be published on npm.

However, since we'll be using the `divide & conquer` approach, the use of `.npmignore` will be minimal, if any.

### - D. npm login Deep Dive

When you run `npm login`, an `.npmrc` file is created, or is being updated with a fresh new token. This means that if a previous existing (either by `npm login` or by copy-pasting a generated _Access Token_ from npm), it is now gone. Erased.

---

## 6. Versioning

A common error you'll bump into is when you'll try to re-publish a package using the same version already registered on npm.

Before running the `publish` command, you'll need to bump the version.  
In fact, that's the _only_ change that's required by npm in order to be able to publish a new release.

To bump a version there are 3 commands ou can use:

When doing a bug fix:

```bash
npm version patch -m 'Upgrade to %s: some-message'
```

When adding a new feature:

```bash
npm version minor -m 'Upgrade to %s: some-message'
```

When doing a breaking-change:

```bash
npm version major -m 'Upgrade to %s: some-message'
```

In order to run either one of these, your git tree must be clean. If it's not, you'll get an error telling you to stash your changes and then try again.

---

## 7. The role of package.json

The `package.json` file plays a huge role when it comes to publishing a package on npm.

It contains keys/fields, that could make or break the publish's output.

**REQUIRED** keys within your `package.json`:

- name
- version
- main

Your `package.json` MUST include a `name`, a `version`, and a `main`.  
While the lack of `name`, a `version` would fail the _publish_ process, the lack of main would not. However, you would not be able to import _anything_ from the end result package! You would even get a runtime error if you try.

**IMPORTANT** keys inside your `package.json`:

- exports
- files

The `exports` field in package.json is a relatively new addition to the npm ecosystem. It allows you as the package's author to explicitly define which modules are available for consumption when the package is imported. This helps in providing a more controlled and secure interface, limiting access to internal files that shouldn't be exposed to end-users.

The `files` key is mean for whitelisting. Only files specified under files will end up in the end-result output of the publish.

**Nice to have** keys inside your `package.json`:

- repository
- publishConfig
  - registry
  - access
- license (MIT, ISC, etc.)

---

## 8. Publishing a package to an npm registry

Now that everything is set, it's time we upload/publish our package to our npm registry.

You can publish the package by running the command:

```bash
npm publish
```

To help you visualize what exactly is going to be publish, you can run a dry-run publish command:

```bash
npm publish --dry-run
```

This will spit out all sorts of useful information.

By default, scoped packages are published with private visibility. To publish a scoped package with public visibility, use npm publish --access public.

:::note
Note: You cannot change the visibility of an unscoped package. Only scoped packages with a paid subscription may be private.
:::

If your package is prefixed (i.e. scoped with @talkohavy), you'll have to add the access public flag:

```bash
npm publish --access=public
```

Without the access public flag, you'll get an error saying you must sign up for private packages, and the the publish command will fail.  
This is because when trying to publish, by default, npm thinks you're trying to publish a private package. You can fix this by adding the `access` flag to the publish command, and setting it to _public_, telling npm that this package is in fact public.

---

## 9. A publish's output - Deep Dive Strategy

Earlier in this guide we talked about the `divide & conquer` approach, where separate the package's output to be published from the repo itself.

Let's take a deep-dive into what it actually means.

### - A. A second package.json

In the build process, we create a `dist` folder. If we were to use the the `main` key within our package.json that resides in our root directory, to point to an index.js file within our `dist` folder, it would result in that `dist` folder appearing in our end result output. But what if we don't to see a `dist` folder as part of our end result? What if we wanted to see just a single file in there?

To that goal, and in order to achieve maximum control over our final structure, we would have ourselves a second `package.json`. This is what we called earlier as "Copy & manipulate the package.json".

In this step, we take the package.json found in our root directory, and copy it into our dist folder. Not before we manipulate it a bit though. The manipulation can have multiple benefits:

1. **We can remove scripts** - stuff like "test" or "lint". They are no longer needed.
2. **We can change access** - We can have the initial package.json start off as "restricted", thus ensuring one can't accidentally publish the root as a package, and only during manipulation change it to "public".
3. **We can change the private boolean** - We can have the initial package.json start off as `"private": true`, which is another way to ensure that no one can publish the root as a package, and only during manipulation, we remove this key entirely.

### - B. A README.md file

Copy the readme.md file _as-is_ to the `dist` folder. This readme file will appear on npm main page of the package, serving as a Getting-Started information on how-to-use the package to other developers.

### - C. main, types & exports pointing

Since I know that there's going to be another package.json generated within the dist folder, the pointing on the keys "main", "types", and "exports" should be in relation to _that_ package.json.

Let's say you have this project structure:

```
|-- src/
|-- dist/
|    |
|    |-- lib/
|    |    |
|    |    |-- index.js
|    |-- index.d.js
|    |-- package.json (copied & manipulated)
|    |-- README.md (copied)
|-- package.json
|-- README.md
```

In the example case above, the pointing of "main" should NOT be "dist/lib/index.js", but rather "lib/index.js". Same for "types", it should be "index.d.js". Same goes for exports:

```json
"exports": {
  ".": {
    "import": "./lib/index.js",
    "require": "./lib/index.cjs"
  }
},
```

### - D. A complete build process

What I like to do is create a `build.config.js` at the root of the project, and have it look like so:

```js
import { execSync } from 'child_process';
import fs, { cpSync } from 'fs';

const outDirName = 'dist';

buildPackageConfig();

async function buildPackageConfig() {
  cleanDistDirectory();

  buildWithTsc();

  copyReadmeFile();

  copyAndManipulatePackageJsonFile();

  console.log('DONE !!!');
}

function cleanDistDirectory() {
  console.log('- Step 1: clear the dist directory');
  execSync('rm -rf dist');
}

function buildWithTsc() {
  console.log('- Step 2: build with tsc');
  execSync('tsc -p jsconfig.json');
}

function copyReadmeFile() {
  console.log('- Step 3: copy the README.md file');
  const readStreamReadmeMd = fs.createReadStream('./README.md');
  const writeStreamReadmeMd = fs.createWriteStream(`./${outDirName}/README.md`);
  readStreamReadmeMd.pipe(writeStreamReadmeMd);
}

function copyAndManipulatePackageJsonFile() {
  console.log('- Step 4: copy & manipulate the package.json file');
  // Step 1: get the original package.json file
  const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

  // Step 2: Remove all scripts
  delete packageJson.scripts;
  console.log('-- deleted `scripts` key');

  // Step 3: Change from private to public
  delete packageJson.private;
  packageJson.publishConfig.access = 'public';
  console.log('-- changed from private to public');
  console.log('-- changed publishConfig access to public');

  // Step 4: create new package.json file in the output folder
  fs.writeFileSync(`./${outDirName}/package.json`, JSON.stringify(packageJson));
  console.log('-- package.json file written successfully!');
}
```

And now i'm just adding the following script:

```json
{
  "scripts": {
    "build": "node build.config.js",
  }
}
```

### - E. The publish command as a script

And finally, i'll create a script that looks like:

```json
{
  "scripts": {
    // ...
    "pub": "npm run build && cd dist && npm publish",
  }
}
```

---

## 10. Typescript Types

If you are using plain javascript, you can skip this section.

When writing a project in typescript, you'll end up needing to compile it to javascript. Doesn't matter which tool you use, they all use **tsc** under the hood. The end result will create a `dist` folder, along with some js files, and a main declaration file - `index.d.ts`. There can be other declaration files emitted during the process, which will be sibling to that `index.d.ts`.

Their location within the end result package output matters!!!

Typically, aim to have all them declaration files at the root of the `dist` folder.

---

## 11. Auto-Completion & Auto-Suggestion

---

## 12. Versioning Helper - Changesets/cli

While you can use `npm version patch/minor/major`, it's impractical.

The flow of versioning is made easy with the help of a tool called `changesets/cli`.

```bash
npm install -D @changesets/cli
```

Or...

```bash
pnpm add -D @changesets/cli
```

If this is your first time using changesets in this project, run this:

```bash
pnpm changeset init
```

This will create a `.changeset` folder with 2 files inside:

- config.json
- README.md

The config file is filled with all sorts of helpful configurations and tooltips explaining what each one does.

Two things you'll most definitely want/need to change are:

1. "baseBranch": "main", which determines the branch that Changesets uses when finding what packages have changed. If you set a branch name that doesn't exists, the process will fail.
2. "commit": false, set it to `true` instead.

Once you've completed the initial setup, the flow is very simple:

1. run `pnpm changeset add`

---

## 999. Check locally using `pnpm link --global`

Before publishing a package to npm, you can test it locally by importing it to a side-project, and check that it works.  
For that we use the command `pnpm link --global` (original command is `npm link`).

### • Step 1: Run `pnpm link` on the to-be-published package

Inside the to-be-published package folder, run the following command:

```bash
pnpm link --global
```

Or:

```bash
npm link
```

depending on what you're going to use on the tester project.

Running `npm link` symlinks a package folder. This is handy for installing your own stuff, so that you can work on it and test iteratively without having to continually rebuild.

### • Step 2: Run `pnpm link pkg-name` on the tester project

Create a dummy project somewhere on your machine, and do:

```bash
pnpm init -y
pnpm link <pkg-name>
```

Or...

```bash
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

---
