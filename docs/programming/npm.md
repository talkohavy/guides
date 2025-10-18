# How to publish your NPM Package

## 0. TLDR

### - A. Init a project

Open terminal, create a folder, give it a meaningful name, and then run:

```bash
npm init
```

Or if it should be scoped:

```bash
npm init --scope=talkohavy
```

### - B. Connect project to GitHub

This step is mandatory. Every npm package needs to be connected to a remote git repo.

Do a:

```bash
git init
```

```bash
git remote add origin git@github.com:talkohavy/<name>.git
git push -u origin master
```

### - C. Add some content to

Here are some good options:

- An `src` folder with an `index.js`
- A README.md file

### - D. Create an .npmrc file

Create an `.npmrc` file in the root project.

Its contents should be:

```bash
registry=https://registry.example.com/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

You'll of course need to create an **access token** on npm's website, under your profile. The token always starts with "npm\_", so it's easy to recognize.

:::info
You **can commit** the `.npmrc` file, since it doesn't include any sensitive information.
:::

### - E. create an .npmignore

At the root of your project create am `.npmignore` file.  
Inside it put:

```
node_modules
dist
```

:::info
When we'll create a `dist` folder, we will cd into it, and run the publish command from there. When we do, we will use `lvlup`'s publish command.
:::

### - F. Development kit

Install these packages:

```bash
p add -D @eslint/js @types/node globals eslint-plugin-react-compiler eslint-plugin-perfectionist eslint husky prettier typescript-eslint typescript
```

And add these files:

**Eslint:**

```js title="eslint.config.js"
import pluginJs from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    // when an `ignores` key is used without any other keys in the configuration object, then it acts as global `ignores`.
    ignores: ['dist'],
  },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'react-compiler/recommended',
    plugins: {
      'react-compiler': pluginCompiler,
      perfectionist,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '(^_|^req$|^res$|^next$)',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: false,
          varsIgnorePattern: '^React$',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-debugger': 'warn',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
          specialCharacters: 'keep',
          internalPattern: ['^~/.+'],
          partitionByComment: false,
          partitionByNewLine: false,
          newlinesBetween: 'never', // <--- 'always' | 'never' | 'ignore'
          maxLineLength: undefined,
          groups: [
            'react',
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          customGroups: {
            value: { react: ['^react$', '^react-.+'] },
            type: { react: ['^react$', '^react-.+'] },
          },
          environment: 'node', // <--- Possible Options: 'node' | 'bun'
        },
      ],
      // 'sort-imports': [ <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
      //   'error',
      //   {
      //     ignoreCase: false,
      //     ignoreDeclarationSort: false,
      //     ignoreMemberSort: false,
      //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      //     allowSeparatedGroups: false,
      //   },
      // ],
      // 'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false, minKeys: 2 }], <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
    },
  },
];
```

**Prettier:**

```js
// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

const config = {
  useTabs: false,
  tabWidth: 2, // <--- indent tab is 2 spaces worth
  trailingComma: 'all', // <--- Options are: all | es5 | none. Should it add trailing commas on last items? es5 is just for Object keys & Array members. All is also for function parameters.
  semi: true, // <--- prints semi-colons at the ends of statements
  singleQuote: true, // <--- turns this " into '
  jsxSingleQuote: true, // <--- turns this " into ' in JSX
  bracketSameLine: false, // <--- This is for an HTML file. if true, puts the closing of an opening tag on the last line instead of on a new line.
  bracketSpacing: true, // turns this {foo: bar} into this { foo: bar }
  arrowParens: 'always', // WARNING!!! Leave it on "always"! turns this x => x into this (x) => x. This rule MUST stay on "always"! Otherwise it would collide with the "prefer-arrow-callback" & "arrow-body-style" combo from eslint.
  endOfLine: 'auto',
  printWidth: 120, // <--- must match the value stated in eslint config. Defaults to 80.
  proseWrap: 'preserve', // <--- This is relevant for markdown file. "always" creates a line break when line exceeds the amount of allowed characters. "preserve" wraps the text, but remembers that it's a single line. "never" keeps that text in a single line and doesn't wrap at all; text will be kept as a very long one-liner.
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'off',
  quoteProps: 'as-needed', // only add quotes around object properties where required
  overrides: [
    {
      files: ['*.mts', '*.cts', '*.ts', '*.d.ts', '*.js', '*.jsx'],
      options: { parser: 'typescript' },
    },
    {
      files: ['*.json'],
      options: { parser: 'json' },
    },
  ],
};

export default config;
```

**Typescript:**

```json title="tsconfig.json"
{
  "compilerOptions": {
    // -------------------
    // Section 1: Projects
    // -------------------
    // "composite": true, // Enable constraints that allow a TypeScript project to be used with project references.
    // "incremental": true, // Save .tsbuildinfo files to allow for incremental compilation of projects.
    // "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo", // Specify the path to .tsbuildinfo incremental compilation file.
    // "disableSourceOfProjectReferenceRedirect": true,  // Disable preferring source files instead of declaration files when referencing composite projects.
    // "disableSolutionSearching": true,                 // Opt a project out of multi-project reference checking when editing.
    // "disableReferencedProjectLoad": true,             // Reduce the number of projects loaded automatically by TypeScript.

    // -----------------------------------
    // Section 2: Language and Environment
    // -----------------------------------
    "target": "ESNext", // <--- defaults to "ES3"
    "jsx": "react-jsx", // Specify what JSX code is generated.
    "lib": ["ESNext"], // adding the "DOM" library helps vs-code to recognize the window & document objects. Specify a set of bundled library declaration files that describe the target runtime environment.
    "useDefineForClassFields": true, // Emit ECMAScript-standard-compliant class fields.
    "moduleDetection": "force", // <--- defaults to `auto`. Control what method is used to detect module-format JS files.
    // "experimentalDecorators": true,                   // Enable experimental support for legacy experimental decorators.
    // "emitDecoratorMetadata": true,                    // Emit design-type metadata for decorated declarations in source files.
    // "jsxFactory": "",                                 // Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'.
    // "jsxFragmentFactory": "",                         // Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.
    // "jsxImportSource": "",                            // Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'.
    // "reactNamespace": "",                             // Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit.
    // "noLib": true,                                    // Disable including any library files, including the default lib.d.ts.

    // ------------------
    // Section 3: Modules
    // ------------------
    "module": "ESNext", // <--- defaults to `commonjs`. Specify what module code is generated.
    "moduleResolution": "Bundler", // Specify how TypeScript looks up a file from a given module specifier.
    "resolveJsonModule": true,
    "baseUrl": "./", // Specify the base directory to resolve non-relative module names.
    "typeRoots": ["node_modules/@types"], // Specify multiple folders that act like './node_modules/@types'.
    "paths": {
      "@src/*": ["src/*"]
    },
    // "allowImportingTsExtensions": true,
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
    // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
    // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
    // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    // -----------------------------
    // Section 4: JavaScript Support
    // -----------------------------
    "checkJs": true, // without it? this config file would not apply to js/jsx files. Enable error reporting in type-checked JavaScript files.
    "maxNodeModuleJsDepth": 0, // Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'.
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */

    // ---------------
    // Section 5: Emit
    // ---------------
    "noEmit": false, // Disable emitting files from a compilation.
    "declaration": true, // Generate .d.ts files from TypeScript and JavaScript files in your project.
    "sourceMap": true, // defaults to `false`. Create source map files for emitted JavaScript files.
    "outDir": "dist", // Specify an output folder for all emitted files.
    "noEmitOnError": true, // Disable emitting files if any type checking errors are reported.
    "removeComments": false, // Disable emitting comments.
    "emitDeclarationOnly": true /* Only output d.ts files and not JavaScript files. */,
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */

    // ------------------------------
    // Section 6: Interop Constraints
    // ------------------------------
    "isolatedModules": true, // <--- Setting to `true` tells TypeScript to warn you if you write certain code that can't be correctly interpreted by a single-file transpilation process. Ensure that each file can be safely transpiled without relying on other imports.
    "esModuleInterop": true, // Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility.
    "allowSyntheticDefaultImports": true, // Allow 'import x from y' when a module doesn't have a default export.
    "forceConsistentCasingInFileNames": true, // Ensure that casing is correct in imports.
    "verbatimModuleSyntax": true, // Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting.
    // "preserveSymlinks": true, // <--- Solved being redirected to node_modules/.pnpm symlink all the time! Disable resolving symlinks to their realpath. This correlates to the same flag in node. But on the other-hand, I wasn't able to import Page as type from playwright in jsdoc. Disable resolving symlinks to their realpath. This correlates to the same flag in node.
    // "isolatedDeclarations": true,                     /* Require sufficient annotation on exports so other tools can trivially generate declaration files. */

    // ------------------------
    // Section 7: Type Checking
    // ------------------------
    /* Linting */
    "strict": true, // <--- Enable all strict type-checking options.
    "noImplicitAny": true, // <--- Enable error reporting for expressions and declarations with an implied 'any' type.
    "noImplicitThis": true, // <---Enable error reporting when 'this' is given the type 'any'.
    "useUnknownInCatchVariables": true, // <--- Default catch clause variables as 'unknown' instead of 'any'.
    "alwaysStrict": true, // <--- Ensure 'use strict' is always emitted.
    "noUnusedLocals": true, // <--- Enable error reporting when local variables aren't read.
    "noUnusedParameters": true, // <--- Raise an error when a function parameter isn't read.
    "exactOptionalPropertyTypes": false, // <--- Interpret optional property types as written, rather than adding 'undefined'.
    "noImplicitReturns": true, // <--- Enable error reporting for codepaths that do not explicitly return in a function.
    "noFallthroughCasesInSwitch": true, // <--- Enable error reporting for fallthrough cases in switch statements.
    "noUncheckedIndexedAccess": true, // <--- Add 'undefined' to a type when accessed using an index.
    "noImplicitOverride": true, // <--- Ensure overriding members in derived classes are marked with an override modifier.
    "noPropertyAccessFromIndexSignature": false, // <--- settings this to true marks obj['firstName'] as an error, and recommends obj.firstName instead. Enforces using indexed accessors for keys declared using an indexed type.
    "allowUnusedLabels": false, // <--- Disable error reporting for unused labels.
    // "allowUnreachableCode": true,                     // <--- Disable error reporting for unreachable code.
    // "strictNullChecks": true,                         // <--- When type checking, take into account 'null' and 'undefined'.
    // "strictFunctionTypes": true,                      // <--- When assigning functions, check to ensure parameters and the return values are subtype-compatible.
    // "strictBindCallApply": true,                      // <--- Check that the arguments for 'bind', 'call', and 'apply' methods match the original function.
    // "strictPropertyInitialization": true,             // <--- Check for class properties that are declared but not set in the constructor.

    // -----------------------
    // Section 8: Completeness
    // -----------------------
    "skipLibCheck": false // Skip type checking all .d.ts files.
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
  },
  "compileOnSave": true,
  "exclude": ["node_modules"],
  "include": ["src/index.ts"]
}
```

### - G. package.json script

Add these scripts:

```json
{
  "scripts": {
    "clean": "rm -rf node_modules",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "tsc": "tsc -p tsconfig.json",
    "build": "node ./build.config.mjs",
    "test": "node --test"
  },
}
```

### - H. Create a build.config.mjs file

This fil will serve as your `build` script.
At the root of your project, create a `build.config.mjs` file:

```js
import { execSync } from 'child_process';
import { build } from 'esbuild';
import fs, { cpSync } from 'fs';
import path from 'path';

/**
 * @typedef {{
 *   version: string,
 *   private?: string | boolean,
 *   main: string,
 *   type: 'module' | 'commonjs'
 *   types: string,
 *   scripts?: Record<string, string>,
 *   publishConfig: {
 *     access: string
 *   },
 *   devDependencies?: Record<string, string>,
 * }} PackageJson
 */

const ROOT_PROJECT = process.cwd();
const mode = process.env.NODE_ENV;
const isProd = mode === 'production';
const outDirName = 'dist';
const COLORS = {
  green: '[32m',
  blue: '[34m',
  stop: '[39m',
};

buildPackageConfig();

async function buildPackageConfig() {
  cleanDistDirectory();

  await runBuild();

  copyStaticFiles();

  manipulatePackageJsonFile();

  console.log('DONE !!!');
}

function cleanDistDirectory() {
  console.log(`${COLORS.green}- Step 1:${COLORS.stop} clear the ${outDirName} directory`);
  execSync(`rm -rf ${outDirName}`);
}

async function runBuild() {
  console.log(`${COLORS.green}- Step 2:${COLORS.stop} build the output dir`);

  await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: `${outDirName}/index.js`,
    sourcemap: !isProd, // <--- defaults to `false`. for 'node', create sourcemaps is for development only.
    minify: isProd, // <--- defaults to `false`. should be `true` only in production.
    platform: 'node', // <--- defaults to 'browser'. If you're creating a CLI tool, use 'node' value. Setting platform to 'node' is beneficial when for example, all packages that are built-in to node such as fs are automatically marked as external so esbuild doesn't try to bundle them.
    format: 'esm', // <--- When platform is set to 'node', this defaults to 'cjs'.
    tsconfig: 'tsconfig.json', // <--- Normally the build API automatically discovers tsconfig.json files and reads their contents during a build. However, you can also configure a custom tsconfig.json file to use instead. This can be useful if you need to do multiple builds of the same code with different settings.
    treeShaking: true, // <--- defaults to `true`. Removes dead code.
    mainFields: ['main', 'module'], // <--- When platform is set to 'node', this defaults to 'module','main'. When platform is set to 'browser', this defaults to 'browser','module','main'. IMPORTANT! The order matters! 'main', 'module' is not the same as 'module', 'main'! I chose the more risky one, that attempts to tree-shake, but could potentially fail.
    packages: 'external', // <--- You also may not want to bundle your dependencies with esbuild. There are many node-specific features that esbuild doesn't support while bundling such as __dirname, import.meta.url, fs.readFileSync, and *.node native binary modules. You can exclude all of your dependencies from the bundle by setting packages to external. If you do this, your dependencies must still be present on the file system at run-time since they are no longer included in the bundle.
    conditions: [], // <--- If no custom conditions are configured, the Webpack-specific module condition is also included. The module condition is used by package authors to provide a tree-shakable ESM alternative to a CommonJS file without creating a dual package hazard. You can prevent the module condition from being included by explicitly configuring some custom conditions (even an empty list).
    /**
     * Some npm packages you want to use may not be designed to be run in the browser.
     * Sometimes you can use esbuild's configuration options to work around certain issues and successfully
     * bundle the package anyway. Undefined globals can be replaced with either the define feature in
     * simple cases or the inject feature in more complex cases.
     */
    // define :
    // inject :
  });
}

function copyStaticFiles() {
  console.log(`${COLORS.green}- Step 3:${COLORS.stop} copy static files`);

  const filesToCopyArr = [
    { filename: 'package.json', sourceDirPath: [], destinationDirPath: [] },
    { filename: '.npmignore', sourceDirPath: [], destinationDirPath: [] },
    {
      filename: '.npmrc',
      sourceDirPath: [],
      destinationDirPath: [],
      isAllowedToFail: true,
    },
    { filename: 'README.md', sourceDirPath: [], destinationDirPath: [] },
  ];

  filesToCopyArr.forEach(({ filename, sourceDirPath, destinationDirPath, isAllowedToFail }) => {
    try {
      const sourceFileFullPath = path.resolve(ROOT_PROJECT, ...sourceDirPath, filename);
      const destinationFileFullPath = path.resolve(ROOT_PROJECT, outDirName, ...destinationDirPath, filename);

      cpSync(sourceFileFullPath, destinationFileFullPath);
      console.log(`    • ${filename}`);
    } catch (error) {
      console.error(error);
      if (isAllowedToFail) return;

      throw new Error('File MUST exists in order to PASS build process! cp operation failed...');
    }
  });
}

function manipulatePackageJsonFile() {
  console.log(`${COLORS.green}- Step 4:${COLORS.stop} copy & manipulate the package.json file`);

  const packageJsonPath = path.resolve(ROOT_PROJECT, outDirName, 'package.json');

  // Step: get the original package.json file
  /** @type {PackageJson} */
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  delete packageJson.private;
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  packageJson.publishConfig.access = 'public';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

  console.log(`  • ${COLORS.blue}changed${COLORS.stop} from private to public`);
  console.log(`  • ${COLORS.blue}deleted${COLORS.stop} "scripts" key`);
  console.log(`  • ${COLORS.blue}deleted${COLORS.stop} "devDependencies" key`);
  console.log(`  • ${COLORS.blue}changed${COLORS.stop} publishConfig access to public`);
  console.log(`  • ${COLORS.blue}package.json${COLORS.stop} file written successfully!`);
}
```

### - I. install `lvlup`

The flow of versioning is made easy with a tool like `lvlup`.

Install it:

```bash
pnpm add -D lvlup
```

Init it:

```bash
lvlup init
```

Change the content of `.lvlup/config.json` file:

```json {4,7-8} showLineNumbers
{
  "$schema": "https://unpkg.com/lvlup@1.0.13/schema.json",
  "commit": {
    "afterAdd": true,
    "afterBump": true
  }
}
```

### - J. Edit your package.json

Change these keys in your `package.json` file:

```json {3,6-7,9-11} showLineNumbers
{
  "name": "@talkohavy/dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "dist/main.js",
  "types": "dist/main.d.ts",
  "scripts": {},
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "restricted"
  },
  "devDependencies": {},
}
```

### - K. Your new workflow

• Step 1: Open a `side-branch`, and make some changes (do not commit them yet).
• Step 2: Run the command `lvlup add`, choose a semver, and add a short description.
• Step 2.5: You can check the status by running `lvlup status`.
• Step 3: Make a pull request to the `master` branch.
• Step 4: It's up to the master branch (the CICD pipeline) to bump the version, with `lvlup bump`. This creates a new commit.
• Step 5: Also, it's up to the master branch (the CICD pipeline) to build the project, cd into the dist folder, and publish the new version/release, with `lvlup publish`. This does NOT create a new commit.

---

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

Another important piece of information is: if you had a token that should last a year, and you just committed an `npm logout`, you have invalidated your token permanently! And it can no longer be used!

To sum it up, npm logout does 2 things:

1. It deleted the line which includes the token from your .npmrc file.
   - If your `.npmrc` file contains only that 1 line with the token, the .npmrc file is deleted for good.
2. It invalidates the token.

### - C. .npmignore

You can use the `.npmignore` to blacklist files and folders from getting to the final package output that'll be published on npm.

However, since we'll be using the `divide & conquer` approach, the use of `.npmignore` will be minimal, if any.

### - D. npm login Deep Dive

When you run `npm login`, an `.npmrc` file is created (or is being updated if it already exists) with a fresh new token. This means that if a previous existing (either by `npm login` or by copy-pasting a generated _Access Token_ from npm), it is now gone. Erased.

---

## 6. Versioning

A common error you'll bump into is when you'll try to re-publish a package using the same version already registered on npm.

Before running the `publish` command, you'll need to bump the version.  
In fact, that's the _only_ change that's required by npm in order to be able to publish a new release.

To bump a version there are 3 commands ou can use:

When doing a bugfix:

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
/* eslint-disable */
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
