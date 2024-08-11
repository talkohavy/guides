---
title: How to Create a Component Library with Vite
description: How to create a components library fast using Vite's library mode, typescript, css modules, and publish to npm.
slug: vite-library-mode
authors: [talkohavy]
image: https://i.ibb.co/rGSxHmB/vite.png
tags: [vite, react, typescript, tutorial]
hide_table_of_contents: false
---

## 1. Set up a new Vite project

Start a new project:

```bash
npm create vite@latest
```

Choose `React` & `TypeScript + SWC`

Here are 4 things I recommend you to do right after installing Vite:

1. Early first commit
   Committing regularly is a very good habit. And there is one point in time where it is especially helpful, right after you created a new project and BEFORE you type the first character in your project.

2. Install node's types
   If working with TypeScript I also install the types package for node. Sooner or later you will need this.

   ```bash
   pnpm add -D @types/node
   ```

---

## 2. Create a `lib/main.ts` file

Create a folder next to `src` and name it `lib`. Inside, create the file which will act as the main entry point of your library, and name it `main.ts`. When installing the library you can import everything that is exported from this file.

```diff
 📂 my-component-library
// diff-add-start
┣ 📂 lib
┃ ┗ 📜 main.ts
// diff-add-end
  ┣ 📂 public
  ┣ 📂 src
  …
```

## 3. Activate Vite's Library Mode

By default, when running `vite build`, Vite will transpile the code inside `src` to the `dist` folder. What we want instead, is to transpile and ship the code inside of `lib`.

To activate vite's library mode, inside of our `vite.config.ts` file, we will need to use the `build.lib` option.

Like so (do not copy code yet!):

```jsx showLineNumbers
import { defineConfig } from 'vite'
// diff-add-next-line
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
// diff-add-start
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    }
  }
// diff-add-end
})
```

<!-- truncate -->

## 4. tsconfig.json dedicated for build

Update the contents of your `tsconfig.json` file like so:

```json title=tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
// diff-add-next-line
    { "path": "./tsconfig.build.json" }
  ]
}
```

And create a new `tsconfig.json`:

```diff
 📂my-component-library
  ┣ ...
  ┣ 📜tsconfig.json
// diff-add-next-line
┣ 📜tsconfig.build.json
  ...
```

And paste the below code as its contents:

```json title=tsconfig.build.ts
{
  "extends": "./tsconfig.json",
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
    "target": "ESNext",
    "jsx": "react-jsx", // Specify what JSX code is generated.
    "lib": ["ESNext", "DOM", "DOM.Iterable"], // adding the "DOM" library helps vs-code to recognize the window & document objects. Specify a set of bundled library declaration files that describe the target runtime environment.
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
    "allowImportingTsExtensions": true, // Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.ts
    "baseUrl": "./", // Specify the base directory to resolve non-relative module names.
    "typeRoots": ["node_modules/@types"], // Specify multiple folders that act like './node_modules/@types'.
    "paths": {
      "/*": ["src/public/*"],
      "@src/*": ["src/*"]
    },
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
    "noEmit": false, // set to `true` to disable emitting files from a compilation.
    "outDir": "./dist", // Specify an output folder for all emitted files.
    "declaration": true, // Generate .d.ts files from TypeScript and JavaScript files in your project.
    "emitDeclarationOnly": true, // Only output d.ts files and not JavaScript files
    // "sourceMap": true, // defaults to `false`. Create source map files for emitted JavaScript files.
    // "declarationMap": true, // Create sourcemaps for d.ts files.
    // "inlineSourceMap": true, // Include sourcemap files inside the emitted JavaScript. */
    // "outFile": "./", // Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "removeComments": true, // Disable emitting comments.
    // "importHelpers": true, // Allow importing helper functions from tslib once per project, instead of including them per-file.
    // "downlevelIteration": true, // Emit more compliant, but verbose and less performant JavaScript for iteration.
    // "sourceRoot": "", // Specify the root path for debuggers to find the reference source code.
    // "mapRoot": "", // Specify the location where debugger should locate map files instead of generated locations.
    // "inlineSources": true, // Include source code in the sourcemaps inside the emitted JavaScript.
    // "emitBOM": true, // Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
    // "newLine": "crlf", // Set the newline character for emitting files.
    // "stripInternal": true, // Disable emitting declarations that have '@internal' in their JSDoc comments.
    // "noEmitHelpers": true, // Disable generating custom helper functions like '__extends' in compiled output.
    // "noEmitOnError": true, // Disable emitting files if any type checking errors are reported.
    // "preserveConstEnums": true, // Disable erasing 'const enum' declarations in generated code.
    // "declarationDir": "./", // Specify the output directory for generated declaration files.

    // ------------------------------
    // Section 6: Interop Constraints
    // ------------------------------
    "isolatedModules": true, // <--- Setting to `true` tells TypeScript to warn you if you write certain code that can't be correctly interpreted by a single-file transpilation process. Ensure that each file can be safely transpiled without relying on other imports.
    "esModuleInterop": true, // Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility.
    "allowSyntheticDefaultImports": true, // Allow 'import x from y' when a module doesn't have a default export.
    "forceConsistentCasingInFileNames": true, // Ensure that casing is correct in imports.
    // "preserveSymlinks": true, // <--- Solved being redirected to node_modules/.pnpm symlink all the time! Disable resolving symlinks to their realpath. This correlates to the same flag in node. But on the other-hand, I wasn't able to import Page as type from playwright in jsdoc. Disable resolving symlinks to their realpath. This correlates to the same flag in node.
    // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
    // "isolatedDeclarations": true,                     /* Require sufficient annotation on exports so other tools can trivially generate declaration files. */

    // ------------------------
    // Section 7: Type Checking
    // ------------------------
    /* Linting */
    // "strictNullChecks": true,                         // <--- When type checking, take into account 'null' and 'undefined'.
    // "strictFunctionTypes": true,                      // <--- When assigning functions, check to ensure parameters and the return values are subtype-compatible.
    // "strictBindCallApply": true,                      // <--- Check that the arguments for 'bind', 'call', and 'apply' methods match the original function.
    // "strictPropertyInitialization": true,             // <--- Check for class properties that are declared but not set in the constructor.
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

    // -----------------------
    // Section 8: Completeness
    // -----------------------
    "skipLibCheck": true // Skip type checking all .d.ts files.
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
  },
  "include": ["lib"]
}
```

The important part to notice is that the "include" key of it has the value of ["lib"], to have our typescript rules be applied only to the `lib` folder, and not the `src`.

Implementing this separate configuration helps avoid TypeScript errors when you import components directly from the `dist` folder on the demo page and those components haven't been built yet.

## 5. Use the tsconfig.build.ts for building

To use `tsconfig.build.json` for building you need to pass the configuration file to `tsc` in the build script in your package.json:

```json
{
  // ...
  "scripts": {
     ...
// diff-remove-next-line
  "build": "tsc && vite build",
// diff-add-next-line
  "build": "tsc -p ./tsconfig.build.json && vite build",
  }
}
```

## 6. Copy `vite-env.d.ts` from `src` to `lib`

You will also need to copy the file `vite-env.d.ts` from `src` to `lib`. Without this file Typescript will miss some types definitions provided by Vite when building (because we don't include `src` in our `tsconfig.build.ts`).

You can now execute `npm run build` and this is what you will see in your dist folder:

```bash
 📂dist
  ┣ 📜my-component-library.js
  ┣ 📜main.d.ts
  ┣ 📜main.js
  ┗ 📜vite.svg
```

:::info
💡 The name of the output file is identical with the `name` property in your package.json per default. This can be changed in the Vite config (`build.lib.fileName`) but we will do something else about this later.
:::

## 7. Get rid of the `vite.svg` file

The file `vite.svg` is in your `dist` folder because Vite copies all files from the `public` directory to the output folder. Let's disable this behavior:

```tsx showLineNumbers
export default defineConfig({
  // ...
  build: {
// diff-add-next-line
    copyPublicDir: false,
  },
});
```

## 8. Create a basic component

What is a React component library without components?  
Let's create one or two:

```bash
 📂 my-component-library
  ┣ 📂 lib
 +┃ ┣ 📂 components
 +┃ ┃ ┣ 📂 Button
 +┃ ┃ ┃ ┣ 📂 Button.tsx
 +┃ ┃ ┃ ┗ 📜 index.ts
 +┃ ┃ ┗ 📂 Label
 +┃ ┃ ┃ ┣ 📂 Label.tsx
 +┃ ┃   ┗ 📜 index.ts
  ┃ ┗ 📜 main.ts
  …
```

And add a very basic implementation for these components:

```tsx title=lib/components/Button/Button.tsx
export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type='button' {...props} />;
}
```

```tsx title=lib/components/Label/Label.tsx
export default function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}
```

Finally export the components from the library's main file:

```tsx title=lib/main.ts
export { default as Button } from './components/Button';
export { default as Label } from './components/Label';
```

If you `npm run build` again you will notice that the transpiled file `my-component-library.js` now has **78kb** 😮

## 9. Remove `react` & `react/jsx-runtime` from the bundle

The implementation of the components above contains React JSX code and therefore `react` (and `react/jsx-runtime`) gets bundled as well. As this library will be used in projects that have React installed anyways, you can **externalize** this dependencies to _remove the code from bundle_:

```tsx title=vite.config.ts
export default defineConfig({
  // ...
  build: {
   // ...
// diff-add-start
   rollupOptions: {
       external: ['react', 'react/jsx-runtime'],
   },
// diff-add-end
  },
});
```

## 10. Handle CSS files

This library will use **CSS modules** to style the components.

CSS modules are supported by Vite by default. All you have to do is to create CSS files that end with `.module.css`.

```bash
 📂my-component-library
  ┣ 📂lib
  ┃ ┣ 📂components
  ┃ ┃ ┣ 📂Button
  ┃ ┃ ┃ ┣ 📂Button.tsx
  ┃ ┃ ┃ ┣ 📜index.ts
+ ┃ ┃ ┃ ┗ 📂Button.module.css
  ┃ ┃ ┗ 📂Label
  ┃ ┃   ┣ 📂Label.tsx
  ┃ ┃   ┣ 📜index.ts
+ ┃ ┃   ┗ 📂Label.module.css
  ┃ ┗ 📜main.ts
  …
```

And add some basic CSS classes:

```css title=lib/components/Button/Button.module.css
.button {
    padding: 1rem;
}
```

```css title=lib/components/Label/Label.module.css
.label {
    font-weight: bold;
}
```

And import/use them inside your components:

```tsx
import styles from './Button.module.css';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...restProps } = props;
  return <button type='button' className={`${className} ${styles.button}`} {...restProps} />;
}
```

After transpiling your library you will notice that there is a new file in your distribution folder:

```bash
 📂dist
  ┣ …
  ┣ 📜my-component-library.js
# diff-add-next-line
┗ 📜style.css
```

But there are two issues with this file:

1. You need to manually import the file in the consuming application.
2. It is one big giant file that contains all styles for all components.

CSS files just can't easily be imported in JavaScript. Therefore, the CSS file is generated separately, allowing the library user to decide how to handle the file.

But what if we were to assume that the application using the library has a bundler configuration that can handle CSS imports?

For this to work, the transpiled JavaScript bundle must contain an import statement for the CSS file. We are going to use yet another Vite plugin ([vite-plugin-lib-inject-css](https://github.com/emosheeep/vite-plugin-lib-inject-css)) that does exactly what we need with zero configuration.

:::tip
**From their documentation:**

"Inject css at the top of each chunk file in library mode using import statement, support multi-entries build, especially to help building component libraries."
:::

Let's install `vite-plugin-lib-inject-css`:

```bash
pnpm add -D vite-plugin-lib-inject-css
```

And use it inside our `vite.config.ts` file:

```tsx title=vite.config.ts
// diff-add-next-line
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  // ...
  plugins: [
    react(),
// diff-add-next-line
  libInjectCss(),
  ],
  // ...
});
```

Build the library and take a look at the top of your bundled JavaScript file (`dist/my-component-library.js`):

```tsx title=dist/my-component-library.js
import './main.css';

// ...
```

:::info
💡 You may notice that the CSS filename has changed from style.css to main.css. This change occurs because the plugin generates a separate CSS file for each chunk, and in this case the name of the chunk comes from the filename of the entry file.
:::

## 11. Split up the CSS

But there's still the second problem: when you import something from your library, `main.css` is also imported and all the CSS styles end up in your application bundle. Even if you only import the **Button**.

Well, good news!!! The `libInjectCSS` plugin generates a separate CSS file for each chunk and includes an import statement at the beginning of each chunk's output file. So if you split up the JavaScript code, you'll end up having separate CSS files that only get imported when the according JavaScript files are imported.

Best way of doing this would be to turn every file into an Rollup entry point. And there is a recommended way of doing this right in the [Rollup documentation](https://rollupjs.org/configuration-options/#input):

So let's add this to your configuration.

First install `glob` as it will be required:

```bash
pnpm add -D glob
```

Then change your Vite config to this:

```tsx title=vite.config.ts
/* eslint-disable*/
// diff-remove-next-line
import { resolve } from 'path';
// diff-add-start
import { extname, relative, resolve } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'node:url';
// diff-add-end
// ...
export default defineConfig({
  // ...
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
// diff-add-start
     input: Object.fromEntries(
         glob.sync('lib/**/*.{ts,tsx}', {
             ignore: ['lib/**/*.d.ts'],
       }).map(file => [
         // The name of the entry point lib/nested/foo.ts becomes nested/foo
         relative(
             'lib',
           file.slice(0, file.length - extname(file).length),
         ),
         // The absolute path to the entry file lib/nested/foo.ts becomes /project/lib/nested/foo.ts
         fileURLToPath(new URL(file, import.meta.url)),
       ]),
     ),
// diff-add-end
    },
   // ...
});
```

:::info
💡 The glob library helps you to specify a set of filenames. In this case it selects all files ending with `.ts` or `.tsx` and ignores `*.d.ts` files.
:::

**How to use Storybook for my library?**

To install Storybook run `npx storybook@latest init` and start adding your stories.

If you add stories inside the `lib` folder you also need to make sure to exclude all `.stories.tsx` files from the glob pattern so the stories don't end up in your bundle.

```tsx
glob.sync('lib/**/*.{ts,tsx}', {
  // diff-remove-next-line
  ignore: ['lib/**/*.d.ts'],
// diff-add-next-line
  ignore: ['lib/**/*.d.ts', 'lib/**/*.stories.tsx'],
});
```

Now you end up with a bunch of JavaScript and CSS files in the root of your `dist` folder. It works, but it doesn't look particularly pretty, does it?

That's why we'll add `rollupOptions.output` to our config:

```tsx title=vite.config.ts
export default defineConfig({

  rollupOptions: {
    // ...
// diff-add-start
     output: {
       assetFileNames: 'assets/[name][extname]',
       entryFileNames: '[name].js',
     },
// diff-add-end
    },
    // ...
});
```

Transpile the library again and all JavaScript files should now be in the same organized folder structure you have created in `lib` alongside with their type definitions. And the CSS files are inside a new folder called assets. 🙌

Notice that the name of the main file has changed from "my-component-library.js" to "main.js". That's great!

## 12. Update your `package.json` file

main & types should be `dist/main.js` and `dist/main.d.ts`.

Your library's primary entry point is now located at `dist/main.js`, so this needs to be set in your `package.json`.

The same applies to the types' entry point: `dist/main.d.ts`

```json title=package.json
{
  "name": "my-component-library",
  "private": true,
  "version": "0.0.0",
  "type": "module",
// highlight-start
  "main": "dist/main.js",
  "types": "dist/main.d.ts",
// highlight-end
}
```

## 13. Dependencies, devDependencies & peerDependencies

Now take a look at your `dependencies`.

Right now there should be only two there: `react` and `react-dom` You can move both to the `devDependencies`.

Additionally, add them as `peerDependencies`, so that the consuming application is aware that it must have React installed to use this package.

```json title=package.json
{
// diff-remove-next-line
"dependencies": {
  // diff-add-next-line
"peerDependencies": {
  "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
// diff-add-start
"react": "^18.2.0",
"react-dom": "^18.2.0",
// diff-add-end
  }
}
```

## 14. Add CSS to Side effects

To prevent the CSS files from being accidentally removed by the consumer's tree-shaking efforts, you should also specify the generated CSS as side effects:

```json title=package.json
{
// ...
// diff-add-next-line
"sideEffects": ["**/*.css"],
// ...
}
```

## 15. Use `prepublishOnly` to ensure build prior to publish

You can use the special lifecycle script `prepublishOnly` to guarantee that your changes are always built before the package is published:

```json title=package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    // ...
// diff-add-next-line
  "prepublishOnly": "npm run build"
  },
}
```

## 16. Demo page

To just play around with your components on the demo page, you can simply import the components directly from the root of your project. This works because your `package.json` points to the transpiled main file `dist/main.ts`.

```tsx title=src/App.tsx
/* eslint-disable */
import { Button, Input, Label } from '../';

// ...
```
