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

### - A. **REQUIRED** keys within your `package.json`

- name
- version
- main

Your `package.json` MUST include a `name`, a `version`, and a `main`.  
While the lack of `name`, a `version` would fail the _publish_ process, the lack of main would not. However, you would not be able to import _anything_ from the end result package! You would even get a runtime error if you try.

### - B. **IMPORTANT** keys inside your `package.json`

- exports
- files

The `exports` field in package.json is a relatively new addition to the npm ecosystem. It allows you as the package's author to explicitly define which modules are available for consumption when the package is imported. This helps in providing a more controlled and secure interface, limiting access to internal files that shouldn't be exposed to end-users.  
The `exports` field **OVERRIDES** whatever that is written under the `main` key, and can replace it entirely.

```json
{
  // "main": "lib/index.js", // <--- not needed now that exports exists. Has no affect.
  "exports": {
    ".": {
      "import": "./lib/index.js",
      "require": "./lib/index.cjs"
    }
  },
}
```

The `files` key is mean for whitelisting. Only files specified under files will end up in the end-result output of the publish.

### - C. **Nice to have** keys inside your `package.json`

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
import fs from 'fs';

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

When you involve typescript, everything changes. New behaviors are introduced, and subtle differences are brought to the table.

### - A. Emitting Pure Javascript

If your package emits a plain javascript, without so much as a declaration file (.d.ts file) then nothing changes for you. Everything will work as expected.

### - B. Emitting .js & .d.ts files

This is the most common use-case.

When writing a package in typescript, you'll end up needing to compile it down to javascript. Doesn't matter which tool you use, under the hood they all use **tsc**, so I'll be using it directly.

The end result of the compilation process will create a `dist` folder, along with some js files, and a main declaration file - `index.d.ts`. There can be other declaration files emitted during the process, which will be sibling to that `index.d.ts`.

In this setting, where there are .d.ts files in the final output, there are some subtle differences.

**The difference between "exports" and "main"**

### - C. Using ONLY .ts files

Let's compare 3 cases:

1. Having an only js package with `"main": "lib/index.js"`,
2. Having an only js package with `"exports": {".": { "import": "./lib/index.js" }}`
3. Having Case 1 with `"types": "index.d.ts"`
4. Having Case 2 with `"types": "index.d.ts"`

First of all, it is important to know - not including a `"types": "index.d.ts"`, in your `package.json`, doesn't mean that it defaults to nothing. In fact, the defaults _is_ `"types": "index.d.ts"`!

The "types" field only exists for when you have a root .d.ts file with a name that's outside the convention on `index.d.ts`, or that it is located deeper in some nested folder, and not on the root.

By default, using the `exports` key sets every possible key that can be added under it to null.

"."

---

## 11. Auto-Completion & Auto-Suggestion

---

## 12. Versioning Helper - Changesets/cli

While you can use `npm version patch/minor/major`, it's impractical.

The flow of versioning is made easy with the help of a tool called `changesets/cli`.

### - A. Getting Started

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

### - B. Add new scripts to package.json

Add these new scripts to your package.json:

```json
{
  "scripts:" {
    "cs-add": "pnpm changeset add",
    "cs-bump": "pnpm changeset version",
    "cs-status": "pnpm changeset status --verbose",
    "cs-publish": "cd dist && pnpm changeset publish"
  }
}
```

### - C. Add copy changeset to your copy flow

```js {11-12,18-26} showLineNumbers
import { execSync } from 'child_process';
import fs, { cpSync } from 'fs';

const outDirName = 'dist';

buildPackageConfig();

async function buildPackageConfig() {
  cleanDistDirectory();
  // ...
  copyChangesetDirectory();
  copyNpmIgnore();
  // ...

  console.log('DONE !!!');
}

function copyChangesetDirectory() {
  console.log('- Step 5: copy the .changeset directory');
  cpSync('.changeset', `${outDirName}/.changeset`, { recursive: true });
}

function copyNpmIgnore() {
  console.log('- Step 6: copy the .npmignore file');
  cpSync('.npmignore', `${outDirName}/.npmignore`);
}
```

### - D. Versioning Flow - How to use

Once you've completed the initial setup, the flow is very simple:

#### Step 1: Make changes & commit them

Adding a new feature, fixing a bug, or having breaking changes are the only time that this flow is valid. Needless to say that usually when doing either one of these you are standing on a `side-branch`, away from `master`.

:::note
You DO NOT publish a new version of your package simply because you added eslint, or prettier! Theses aren't bugs, or feature that affect the end result package!
:::

#### Step 2: Run the changeset ADD command

When all commits are done, it's then time to log what has been done.

Run the newly created script:

```bash
pnpm run cs-add
```

Choose the semver, and give a short description of what has been done.

You _can_, and sometimes _should_, run the "cs-add" command several times, once for each change that has been made for this current release.

Each time you run the "cs-add" command, an md file with some weird name will be created under the `.changesets` directory.

#### Step 3: Run the changeset STATUS command

To view everything that's going to be added to this release using the ADD command, you can use the STATUS command:

```bash
pnpm run cs-status
```

#### Step 4: Run the changeset VERSION command

When you're ready to bump the version, with all the logs you've made, run the BUMP script we've added earlier:

```bash
pnpm run cs-bump
```

This action will take all those md files with weird names, calculate the version number, create or update the CHANGELOG.md file with everything you wrote as notes, and then delete all those weird named files, as they've already served their purpose. These files are meant to be temporary. Their only role is to serve as information guide to the VERSION command.

#### Step 5: Run the changeset PUBLISH command

The **PUBLISH** command of changesets looks at the `config.json` file under `.changesets`, and makes a publish based on the instruction given to it there.

---

## 13. Finalize Process - test & build

In order to have the flow easy, let's make sure we are running as few script as possible, in a way that makes sense.

Look at the following snippet from my package.json:

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "test": "node --test",
    "build-full": "node build.config.js",
    "cs-add": "pnpm changeset add",
    "cs-bump": "npm test && pnpm changeset version",
    "cs-status": "pnpm changeset status --verbose",
    "cs-publish": "pnpm run build-full && cd dist && pnpm changeset publish"
  },
}
```

Notice that right before running the "bump" command, that's when I'm running my tests, so there can never be a version upgrade when tests are failing.

Notice that right before running the "publish" command, that's when I'm running the full-build process that creates the dist folder, along with everything needed for its publish. Since the publish itself is tightly coupled with the output of the build process, it made sense to chain them together.

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
