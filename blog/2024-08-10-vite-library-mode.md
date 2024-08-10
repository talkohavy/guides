---
title: How to Create a Component Library with Vite
description: How to create a components library fast using Vite's library mode, typescript, css modules, and publish to npm.
slug: vite-library-mode
authors: [talkohavy]
image: https://i.imgur.com/mErPwqL.png
tags: [vite, react, typescript, tutorial]
hide_table_of_contents: false
---

If you are managing multiple React applications and want consistency across your user interfaces, sooner or later you'll find that you need a component library.

When I first wanted to create a React component library, it took me a lot of time to find a setup that met all my requirements and wasn't too complicated.

A guide like this would've spared me a great amount of energy wrestling with this stuff myself. I hope it can help you as much as it would have helped me.

This post covers setting up and publishing a React component library, including configuring your build process and publishing your package to npm so you and/or others can use it.

<!-- truncate -->

**I've done my best to keep all configurations simple and concise, using default settings whenever possible.**

When you are done, you can install your library like any other npm package:

```bash
npm install @username/my-component-library
```

And use it like:

```jsx
import { Button } from '@username/my-component-library';

function MyComponent() {
  return <Button>Click me!</Button>
}
```

## Before we start

Before we dig into the implementation details, I would like to elaborate on some technical details regarding the setup of the library.

### 🌳 Fully tree shakeable

For me it was particularly important that only necessary code ends up in the final application. When you import a component, it only includes the necessary JS and CSS styles. Pretty cool, right?

### 🦑 Compiled CSS modules

The components are styled with [CSS modules](https://github.com/css-modules/css-modules). When building the library, these styles will get transformed to normal CSS style sheets. This means that the consuming application will not even be required to support CSS modules.

As a bonus compiling the CSS modules avoids a compatibility issue and the package can be consumed in both, environments that support named imports for CSS modules, and environments that don't.

(In the future I want to extend this tutorial to use [vanilla-extract](https://vanilla-extract.style) instead.)

### 😎 TypeScript

While the library is written in TypeScript, it can be consumed in any "normal" JavaScript project as well. If you never used TypeScript before, give it a try. It not only forces you to write cleaner code, but also helps your AI coding assistant make better suggestions 😉

OK enough reading, now let's have some fun!

## 1. Setup a new Vite project

If you have never worked with [Vite](https://vitejs.dev), think of it as a replacement for [Create React App](https://medium.com/@dawid.niegrebecki/create-react-app-is-dead-what-to-use-instead-fcdd46b70295). Just a few commands and you are ready to go.

```bash
npm create vite@latest
? Project name: › my-component-library
? Select a framework: › React
? Select a variant: › TypeScript
cd my-component-library
npm i
```

That's it, your new Vite/React project is ready to go.

Here are 4 things I recommend you to do right after installing Vite:

1. Early first commit
   Committing regularly is a very good habit. And there is one point in time where it is especially helpful, right after you created a new project and BEFORE you type the first character in your project.
2. Create a .nvmrc file
   Working with different versions of Node on the same project might cause unnecessary trouble. So the second thing I do after setting up a node project is to create a .nvmrc file in the project root.

```bash
node --version > .nvmrc
git add .nvmrc
git commit -m "created .nvmrc file"
```

3. Install node's types
   If working with TypeScript I also install the types package for node. Sooner or later you will need this.

   ```bash
   npm install @types/node -D
   ```

4. Add a jsconfig.json
   If you are going to use an editor that uses LSP (VSCode, Sublime Text, etc.) make sure you have a `jsconfig.json` (or `tsconfig.json`) file for your project. Not having this file might bring you into trouble.

## 2. Basic build setup

You can now run `npm run dev` and browse to the url provided by Vite. While working on your library, this is a place where you can easily import your library and actually see your components. Think of all code inside the `src` folder as your demo page.

The actual library code will reside in another folder. Let's create this folder and name it `lib`. You could also name it differently, but `lib` is a solid choice.

The main entry point of your library will be a file named `main.ts` inside of `lib`. When installing the library you can import everything that is exported from this file.

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

**<font size="6">Vite Library Mode</font>**

At this time, if you build the project with `npm run build` Vite will transpile the code inside `src` to the `dist` folder. This is default Vite behavior.

For now you will use the demo page for development purposes only. So there is no need to transpile this part of the project yet. Instead you want to transpile and ship the code inside of `lib`.

This is where Vite's _Library Mode_ comes into play. It was designed specifically for building/transpiling libraries. To activate this mode, simply specify your library entry point in `vite.config.ts`.

Like so:

```jsx showLineNumbers
import { defineConfig } from 'vite'
// diff-add-next-line
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

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

:::info
💡 The default formats are `'es'` and `'umd'`. For your component library 'es' is all you need. This also removes the necessity for adding the `name` property.

💡 If your TypeScript linter complains about `'path'` and `__dirname` just install the types for node: `npm i @types/node -D`
:::

- 📘 Library mode [docs](https://vitejs.dev/guide/build.html#library-mode)
- 📘 `lib` mode [docs](https://vitejs.dev/config/build-options.html#build-lib)

### TypeScript and library mode

The `tsconfig.json` created by Vite only includes the folder `src`. To enable TypeScript for your newly created `lib` folder as well you need to add it to the TypeScript configuration file like this:

```diff
// diff-add-next-line
"include": ["src"],
// diff-remove-next-line
"include": ["src", "lib"],
```

Although TypeScript needs to be enabled for both the `src` and `lib` folders, it is better to not include `src` when building the library.

To ensure only the `lib` directory is included during the build process you can create a separate TypeScript configuration file specifically for building.

:::info
💡 Implementing this separate configuration helps avoid TypeScript errors when you import components directly from the `dist` folder on the demo page and those components haven't been built yet.
:::

```diff
 📂my-component-library
  ┣ ...
  ┣ 📜tsconfig.json
// diff-add-next-line
┣ 📜tsconfig-build.json
  ...
```

The only difference is that the build config includes only the `lib` directory, whereas the default configuration includes both `lib` and `src`

`📜tsconfig-build.json`

```json
{
  "extends": "./tsconfig.json",
  "include": ["lib"]
}
```

To use `tsconfig-build.json` for building you need to pass the configuration file to `tsc` in the build script in your package.json:

```json
  "scripts": {
     ...
// diff-remove-next-line
  "build": "tsc && vite build",
// diff-add-next-line
  "build": "tsc -p ./tsconfig-build.json && vite build",
  }
```

Finally you will also need to copy the file `vite-env.d.ts` from `src` to `lib`. Without this file Typescript will miss some types definitions provided by Vite when building (because we don't include `src` anymore).

You can now execute `npm run build` once more and this is what you will see in your dist folder:

```bash
 📂dist
  ┣ 📜my-component-library.js
  ┗ 📜vite.svg
```

:::info
💡 The name of the output file is identical with the `name` property in your package.json per default. This can be changed in the Vite config (`build.lib.fileName`) but we will do something else about this later.
:::

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

:::info
You can read a more detailed explanation here: [Why is the file vite.svg in the dist folder?](https://stackoverflow.com/questions/75276160/why-is-the-file-vite-svg-in-the-dist-folder-when-building-with-vite-library)
:::

### Building the types

As this is a Typescript library you also want to ship type definitions with your package. Fortunately there is a Vite plugin that does exactly this: [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)

```bash
npm i vite-plugin-dts -D
```

Per default `dts` will generate types for both `src` and `lib` because both folders are included in the project's `.tsconfig`. This is why we need to pass one configuration parameter: `include: ['lib']`.

```ts title=vite.config.ts
// diff-add-next-line
import dts from 'vite-plugin-dts';

// ...
export default defineConfig({
  // ...
  plugins: [
    react(),
    // diff-add-next-line
  dts({ include: ['lib'] }),
  ],
  // ...
});
```

:::info
💡 It would also work to `exclude: ['src']` or use a different Typescript config file for building.
:::

To test things out, let's add some actual code to your library. Open `lib/main.ts` and export something, for example:

```ts title=lib/main.ts
export function helloAnything(thing: string): string {
  return `Hello ${thing}!`;
}
```

Then run `npm run build` to transpile your code. If the content of your `dist` folder looks like below you should be all set 🥳:

```bash
 📂dist
  ┣ 📜main.d.ts
  ┗ 📜my-component-library.js
```

:::info
💡 Don't be shy, open the files and see what the program did for you!
:::

## 3. What is a React component library without components?

We didn't do all of this just to export a `helloAnything` function. So let's add some meat 🍖 (or tofu 🌱 or both) to our library.

Let's go with two very common basic components: A button, and a label.

```bash
 📂my-component-library
  ┣ 📂lib
 +┃ ┣ 📂components
 +┃ ┃ ┣ 📂Button
 +┃ ┃ ┃ ┣ 📂Button.tsx
 +┃ ┃ ┃ ┗ 📜index.ts
 +┃ ┃ ┗ 📂Label
 +┃ ┃ ┃ ┣ 📂Label.tsx
 +┃ ┃   ┗ 📜index.ts
  ┃ ┗ 📜main.ts
  …
```

And a very basic implementation for these components:

```tsx title=lib/components/Button/Button.tsx
export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type='button' {...props} />;
}
```

```tsx title=lib/components/Label/Label.tsx
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}
```

Finally export the components from the library's main file:

```tsx title=lib/main.ts
export { Button } from './components/Button';
export { Label } from './components/Label';
```

If you `npm run build` again you will notice that the transpiled file `my-component-library.js` now has **78kb** 😮 (a bit less because I removed "Input" from my example)

The implementation of the components above contains React JSX code and therefore `react` (and `react/jsx-runtime`) gets bundled as well.

As this library will be used in projects that have React installed anyways, you can externalize this dependencies to remove the code from bundle:

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

## 4. Add some styles

As mentioned in the beginning, this library will use CSS modules to style the components.

CSS modules are supported by Vite per default. All you have to do is to create CSS files that end with `.module.css`.

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

And import/use them inside your components eg:

```tsx
import styles from './styles.module.css';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...restProps } = props;
  return <button type='button' className={`${className} ${styles.button}`} {...restProps} />;
}
```

### ⛴️ Ship your style

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
2. It is one file that contains all styles for all components.

### Import the CSS

CSS files just can't easily be imported in JavaScript. Therefore, the CSS file is generated separately, allowing the library user to decide how to handle the file.

But what if we were to assume that the application using the library has a bundler configuration that can handle CSS imports?

For this to work, the transpiled JavaScript bundle must contain an import statement for the CSS file. We are going to use yet another Vite plugin ([vite-plugin-lib-inject-css](https://github.com/emosheeep/vite-plugin-lib-inject-css/tree/master/packages/vite-plugin-lib-inject-css)) that does exactly what we need with zero configuration.

```bash
npm i vite-plugin-lib-inject-css -D
```

```tsx title=vite.config.ts
// diff-add-next-line
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  // ...
  plugins: [
    react(),
// diff-add-next-line
    libInjectCss(),
    dts({ include: ['lib'] }),
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

### Split up the CSS

But there's still the second problem: when you import something from your library, `main.css` is also imported and all the CSS styles end up in your application bundle. Even if you only import the button.

The `libInjectCSS` plugin generates a separate CSS file for each chunk and includes an import statement at the beginning of each chunk's output file.

So if you split up the JavaScript code, you end up having separate CSS files that only get imported when the according JavaScript files are imported.

One way of doing this would be to turn every file into an Rollup entry point. And, it couldn't be better, there is a recommended way of doing this right in the [Rollup documentation](https://rollupjs.org/configuration-options/#input):

:::info
📘 If you want to convert a set of files to another format while maintaining the file structure and export signatures, the recommended way—instead of using output.preserveModules that may tree-shake exports as well as emit virtual files created by plugins—is to turn every file into an entry point.
:::

So let's add this to your configuration.

First install `glob` as it will be required:

```bash
npm i glob -D
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
glob.sync('lib/**/*.{ts,tsx}', { ignore: 'lib/**/*.stories.tsx' });
```

Now you end up with a bunch of JavaScript and CSS files in the root of your `dist` folder. It works, but it doesn't look particularly pretty, does it?

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

Transpile the library again and all JavaScript files should now be in the same organized folder structure you have created in `lib` alongside with their type definitions. And the CSS files are inside a new folder called assets.

Transpile the library again and all JavaScript files should now be in the same organized folder structure that you created in `lib` along with their types. And the CSS files are in a new folder called "assets". 🙌

Notice that the name of the main file has changed from "my-component-library.js" to "main.js". That's great!

## 4. A few last steps before you can publish the package

Your build setup is now ready, there are just a few things to consider before releasing your package.

The `package.json` file will get published along with your package files. And you need to make sure it contains all important information about the package.

### Main file

Every npm package has a primary entry point, per default this file is `index.js` in the root of the package.

Your library's primary entry point is now located at `dist/main.js`, so this needs to be set in your `package.json`. The same applies to the type's entry point: `dist/main.d.ts`

```json title=package.json
{
  "name": "my-component-library",
  "private": true,
  "version": "0.0.0",
  "type": "module",
// diff-add-start
  "main": "dist/main.js",
  "types": "dist/main.d.ts",
// diff-add-end
}
```

### Define the files to publish

You should also define which files should be packed into your distributed package.

```json title=package.json
{
  "main": "dist/main.js",
  "types": "dist/main.d.ts",
// diff-add-start
  "files": [
    "dist"
  ],
// diff-add-end
}
```

:::info
💡 Certain files like `package.json` or `README` are always included, regardless of settings.
:::

### Dependencies

Now take a look at your `dependencies`: right now there should be only two `react` and `react-dom` and a couple of `devDependencies`.

You can move those two to the `devDependencies` as well. And additionally add them as `peerDependencies` so the consuming application is aware that it must have React installed to use this package.

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
+   "react": "^18.2.0",
+   "react-dom": "^18.2.0",
  }
}
```

:::info
💡 See this StackOverflow answer to learn more about the different types of dependencies: [Link](https://stackoverflow.com/questions/18875674/whats-the-difference-between-dependencies-devdependencies-and-peerdependencie)
:::

### Side effects

To prevent the CSS files from being accidentally removed by the consumer's tree-shaking efforts, you should also specify the generated CSS as side effects:

```json title=package.json
{
// ...
// diff-add-next-line
"sideEffects": ["**/*.css"],
// ...
}
```

### Ensure that the package is built

You can use the special lifecycle script prepublishOnly to guarantee that your changes are always built before the package is published:

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

## 5. Demo page and deployment

To just play around with your components on the demo page, you can simply import the components directly from the root of your project. This works because your `package.json` points to the transpiled main file `dist/main.ts`.

```tsx title=src/App.tsx
/* eslint-disable */
import { Button, Input, Label } from '../';

// ...
```

To publish your package, you just need to run `npm publish`. If you want to release your package to the public, you have to set `private: false` in your `package.json`.

You can read more about publishing your package, including installing it in a local project (without publishing) in these articles of mine:

- [Publish/install your package](https://dev.to/receter/the-minimal-setup-to-package-and-reuse-your-react-components-1063#publishinstall-your-package)
- [Automatically publish you package with GitHub actions](https://dev.to/receter/automatically-publish-your-node-package-to-npm-with-pnpm-and-github-actions-22eg)
