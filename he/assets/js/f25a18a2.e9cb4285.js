"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[5927],{6291:e=>{e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"vite-library-mode","metadata":{"permalink":"/guides/he/blog/vite-library-mode","editUrl":"https://github.com/talkohavy/guides/blog/2024-08-10-vite-library-mode.md","source":"@site/blog/2024-08-10-vite-library-mode.md","title":"Create a Component Library Fast \ud83d\ude80 (using Vite\'s library mode)","description":"If you are managing multiple React applications and want consistency across your user interfaces, sooner or later you\'ll find that you need a component library.","date":"2024-08-10T00:00:00.000Z","tags":[{"inline":true,"label":"vite","permalink":"/guides/he/blog/tags/vite"},{"inline":true,"label":"react","permalink":"/guides/he/blog/tags/react"},{"inline":true,"label":"typescript","permalink":"/guides/he/blog/tags/typescript"},{"inline":true,"label":"tutorial","permalink":"/guides/he/blog/tags/tutorial"}],"readingTime":16.02,"hasTruncateMarker":false,"authors":[{"name":"Tal Kohavy","title":"Full Stack Developer","url":"https://github.com/talkohavy","imageURL":"https://avatars.githubusercontent.com/u/51020442","key":"talkohavy","page":null}],"frontMatter":{"slug":"vite-library-mode","title":"Create a Component Library Fast \ud83d\ude80 (using Vite\'s library mode)","authors":["talkohavy"],"tags":["vite","react","typescript","tutorial"]},"unlisted":false,"nextItem":{"title":"Welcome","permalink":"/guides/he/blog/welcome"}},"content":"If you are managing multiple React applications and want consistency across your user interfaces, sooner or later you\'ll find that you need a component library.\\n\\nWhen I first wanted to create a React component library, it took me a lot of time to find a setup that met all my requirements and wasn\'t too complicated.\\n\\nA guide like this would\'ve spared me a great amount of energy wrestling with this stuff myself. I hope it can help you as much as it would have helped me.\\n\\nThis post covers setting up and publishing a React component library, including configuring your build process and publishing your package to npm so you and/or others can use it.\\n\\n**I\'ve done my best to keep all configurations simple and concise, using default settings whenever possible.**\\n\\nWhen you are done, you can install your library like any other npm package:\\n\\n```bash\\nnpm install @username/my-component-library\\n```\\n\\nAnd use it like:\\n\\n```jsx\\nimport { Button } from \'@username/my-component-library\';\\n\\nfunction MyComponent() {\\n  return <Button>Click me!</Button>\\n}\\n```\\n\\n## Before we start\\n\\nBefore we dig into the implementation details, I would like to elaborate on some technical details regarding the setup of the library.\\n\\n### \ud83c\udf33 Fully tree shakeable\\n\\nFor me it was particularly important that only necessary code ends up in the final application. When you import a component, it only includes the necessary JS and CSS styles. Pretty cool, right?\\n\\n### \ud83e\udd91 Compiled CSS modules\\n\\nThe components are styled with [CSS modules](https://github.com/css-modules/css-modules). When building the library, these styles will get transformed to normal CSS style sheets. This means that the consuming application will not even be required to support CSS modules.\\n\\nAs a bonus compiling the CSS modules avoids a compatibility issue and the package can be consumed in both, environments that support named imports for CSS modules, and environments that don\'t.\\n\\n(In the future I want to extend this tutorial to use [vanilla-extract](https://vanilla-extract.style) instead.)\\n\\n### \ud83d\ude0e TypeScript\\n\\nWhile the library is written in TypeScript, it can be consumed in any \\"normal\\" JavaScript project as well. If you never used TypeScript before, give it a try. It not only forces you to write cleaner code, but also helps your AI coding assistant make better suggestions \ud83d\ude09\\n\\nOK enough reading, now let\'s have some fun!\\n\\n## 1. Setup a new Vite project\\n\\nIf you have never worked with [Vite](https://vitejs.dev), think of it as a replacement for [Create React App](https://medium.com/@dawid.niegrebecki/create-react-app-is-dead-what-to-use-instead-fcdd46b70295). Just a few commands and you are ready to go.\\n\\n```bash\\nnpm create vite@latest\\n? Project name: \u203a my-component-library\\n? Select a framework: \u203a React\\n? Select a variant: \u203a TypeScript\\ncd my-component-library\\nnpm i\\n```\\n\\nThat\'s it, your new Vite/React project is ready to go.\\n\\nHere are 4 things I recommend you to do right after installing Vite:\\n\\n1. Early first commit\\n   Committing regularly is a very good habit. And there is one point in time where it is especially helpful, right after you created a new project and BEFORE you type the first character in your project.\\n2. Create a .nvmrc file\\n   Working with different versions of Node on the same project might cause unnecessary trouble. So the second thing I do after setting up a node project is to create a .nvmrc file in the project root.\\n\\n```bash\\nnode --version > .nvmrc\\ngit add .nvmrc\\ngit commit -m \\"created .nvmrc file\\"\\n```\\n\\n3. Install node\'s types\\n   If working with TypeScript I also install the types package for node. Sooner or later you will need this.\\n\\n   ```bash\\n   npm install @types/node -D\\n   ```\\n\\n4. Add a jsconfig.json\\n   If you are going to use an editor that uses LSP (VSCode, Sublime Text, etc.) make sure you have a `jsconfig.json` (or `tsconfig.json`) file for your project. Not having this file might bring you into trouble.\\n\\n## 2. Basic build setup\\n\\nYou can now run `npm run dev` and browse to the url provided by Vite. While working on your library, this is a place where you can easily import your library and actually see your components. Think of all code inside the `src` folder as your demo page.\\n\\nThe actual library code will reside in another folder. Let\'s create this folder and name it `lib`. You could also name it differently, but `lib` is a solid choice.\\n\\nThe main entry point of your library will be a file named `main.ts` inside of `lib`. When installing the library you can import everything that is exported from this file.\\n\\n```diff\\n \ud83d\udcc2 my-component-library\\n// diff-add-start\\n\u2523 \ud83d\udcc2 lib\\n\u2503 \u2517 \ud83d\udcdc main.ts\\n// diff-add-end\\n  \u2523 \ud83d\udcc2 public\\n  \u2523 \ud83d\udcc2 src\\n  \u2026\\n```\\n\\n**<font size=\\"6\\">Vite Library Mode</font>**\\n\\nAt this time, if you build the project with `npm run build` Vite will transpile the code inside `src` to the `dist` folder. This is default Vite behavior.\\n\\nFor now you will use the demo page for development purposes only. So there is no need to transpile this part of the project yet. Instead you want to transpile and ship the code inside of `lib`.\\n\\nThis is where Vite\'s _Library Mode_ comes into play. It was designed specifically for building/transpiling libraries. To activate this mode, simply specify your library entry point in `vite.config.ts`.\\n\\nLike so:\\n\\n```jsx showLineNumbers\\nimport { defineConfig } from \'vite\'\\n// diff-add-next-line\\nimport { resolve } from \'path\'\\nimport react from \'@vitejs/plugin-react\'\\n\\nexport default defineConfig({\\n  plugins: [react()],\\n// diff-add-start\\n  build: {\\n    lib: {\\n      entry: resolve(__dirname, \'lib/main.ts\'),\\n      formats: [\'es\']\\n    }\\n  }\\n// diff-add-end\\n})\\n```\\n\\n:::info\\n\ud83d\udca1 The default formats are `\'es\'` and `\'umd\'`. For your component library \'es\' is all you need. This also removes the necessity for adding the `name` property.\\n\\n\ud83d\udca1 If your TypeScript linter complains about `\'path\'` and `__dirname` just install the types for node: `npm i @types/node -D`\\n:::\\n\\n- \ud83d\udcd8 Library mode [docs](https://vitejs.dev/guide/build.html#library-mode)\\n- \ud83d\udcd8 `lib` mode [docs](https://vitejs.dev/config/build-options.html#build-lib)\\n\\n### TypeScript and library mode\\n\\nThe `tsconfig.json` created by Vite only includes the folder `src`. To enable TypeScript for your newly created `lib` folder as well you need to add it to the TypeScript configuration file like this:\\n\\n```diff\\n// diff-add-next-line\\n\\"include\\": [\\"src\\"],\\n// diff-remove-next-line\\n\\"include\\": [\\"src\\", \\"lib\\"],\\n```\\n\\nAlthough TypeScript needs to be enabled for both the `src` and `lib` folders, it is better to not include `src` when building the library.\\n\\nTo ensure only the `lib` directory is included during the build process you can create a separate TypeScript configuration file specifically for building.\\n\\n:::info\\n\ud83d\udca1 Implementing this separate configuration helps avoid TypeScript errors when you import components directly from the `dist` folder on the demo page and those components haven\'t been built yet.\\n:::\\n\\n```diff\\n \ud83d\udcc2my-component-library\\n  \u2523 ...\\n  \u2523 \ud83d\udcdctsconfig.json\\n// diff-add-next-line\\n\u2523 \ud83d\udcdctsconfig-build.json\\n  ...\\n```\\n\\nThe only difference is that the build config includes only the `lib` directory, whereas the default configuration includes both `lib` and `src`\\n\\n`\ud83d\udcdctsconfig-build.json`\\n\\n```json\\n{\\n  \\"extends\\": \\"./tsconfig.json\\",\\n  \\"include\\": [\\"lib\\"]\\n}\\n```\\n\\nTo use `tsconfig-build.json` for building you need to pass the configuration file to `tsc` in the build script in your package.json:\\n\\n```json\\n  \\"scripts\\": {\\n     ...\\n// diff-remove-next-line\\n  \\"build\\": \\"tsc && vite build\\",\\n// diff-add-next-line\\n  \\"build\\": \\"tsc -p ./tsconfig-build.json && vite build\\",\\n  }\\n```\\n\\nFinally you will also need to copy the file `vite-env.d.ts` from `src` to `lib`. Without this file Typescript will miss some types definitions provided by Vite when building (because we don\'t include `src` anymore).\\n\\nYou can now execute `npm run build` once more and this is what you will see in your dist folder:\\n\\n```bash\\n \ud83d\udcc2dist\\n  \u2523 \ud83d\udcdcmy-component-library.js\\n  \u2517 \ud83d\udcdcvite.svg\\n```\\n\\n:::info\\n\ud83d\udca1 The name of the output file is identical with the `name` property in your package.json per default. This can be changed in the Vite config (`build.lib.fileName`) but we will do something else about this later.\\n:::\\n\\nThe file `vite.svg` is in your `dist` folder because Vite copies all files from the `public` directory to the output folder. Let\'s disable this behavior:\\n\\n```tsx showLineNumbers\\nexport default defineConfig({\\n  // ...\\n  build: {\\n// diff-add-next-line\\n    copyPublicDir: false,\\n  },\\n});\\n```\\n\\n:::info\\nYou can read a more detailed explanation here: [Why is the file vite.svg in the dist folder?](https://stackoverflow.com/questions/75276160/why-is-the-file-vite-svg-in-the-dist-folder-when-building-with-vite-library)\\n:::\\n\\n### Building the types\\n\\nAs this is a Typescript library you also want to ship type definitions with your package. Fortunately there is a Vite plugin that does exactly this: [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)\\n\\n```bash\\nnpm i vite-plugin-dts -D\\n```\\n\\nPer default `dts` will generate types for both `src` and `lib` because both folders are included in the project\'s `.tsconfig`. This is why we need to pass one configuration parameter: `include: [\'lib\']`.\\n\\n```ts title=vite.config.ts\\n// diff-add-next-line\\nimport dts from \'vite-plugin-dts\';\\n\\n// ...\\nexport default defineConfig({\\n  // ...\\n  plugins: [\\n    react(),\\n    // diff-add-next-line\\n  dts({ include: [\'lib\'] }),\\n  ],\\n  // ...\\n});\\n```\\n\\n:::info\\n\ud83d\udca1 It would also work to `exclude: [\'src\']` or use a different Typescript config file for building.\\n:::\\n\\nTo test things out, let\'s add some actual code to your library. Open `lib/main.ts` and export something, for example:\\n\\n```ts title=lib/main.ts\\nexport function helloAnything(thing: string): string {\\n  return `Hello ${thing}!`;\\n}\\n```\\n\\nThen run `npm run build` to transpile your code. If the content of your `dist` folder looks like below you should be all set \ud83e\udd73:\\n\\n```bash\\n \ud83d\udcc2dist\\n  \u2523 \ud83d\udcdcmain.d.ts\\n  \u2517 \ud83d\udcdcmy-component-library.js\\n```\\n\\n:::info\\n\ud83d\udca1 Don\'t be shy, open the files and see what the program did for you!\\n:::\\n\\n## 3. What is a React component library without components?\\n\\nWe didn\'t do all of this just to export a `helloAnything` function. So let\'s add some meat \ud83c\udf56 (or tofu \ud83c\udf31 or both) to our library.\\n\\nLet\'s go with two very common basic components: A button, and a label.\\n\\n```bash\\n \ud83d\udcc2my-component-library\\n  \u2523 \ud83d\udcc2lib\\n +\u2503 \u2523 \ud83d\udcc2components\\n +\u2503 \u2503 \u2523 \ud83d\udcc2Button\\n +\u2503 \u2503 \u2503 \u2523 \ud83d\udcc2Button.tsx\\n +\u2503 \u2503 \u2503 \u2517 \ud83d\udcdcindex.ts\\n +\u2503 \u2503 \u2517 \ud83d\udcc2Label\\n +\u2503 \u2503 \u2503 \u2523 \ud83d\udcc2Label.tsx\\n +\u2503 \u2503   \u2517 \ud83d\udcdcindex.ts\\n  \u2503 \u2517 \ud83d\udcdcmain.ts\\n  \u2026\\n```\\n\\nAnd a very basic implementation for these components:\\n\\n```tsx title=lib/components/Button/Button.tsx\\nexport default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {\\n  return <button type=\'button\' {...props} />;\\n}\\n```\\n\\n```tsx title=lib/components/Label/Label.tsx\\nexport function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {\\n  return <label {...props} />;\\n}\\n```\\n\\nFinally export the components from the library\'s main file:\\n\\n```tsx title=lib/main.ts\\nexport { Button } from \'./components/Button\';\\nexport { Label } from \'./components/Label\';\\n```\\n\\nIf you `npm run build` again you will notice that the transpiled file `my-component-library.js` now has **78kb** \ud83d\ude2e (a bit less because I removed \\"Input\\" from my example)\\n\\nThe implementation of the components above contains React JSX code and therefore `react` (and `react/jsx-runtime`) gets bundled as well.\\n\\nAs this library will be used in projects that have React installed anyways, you can externalize this dependencies to remove the code from bundle:\\n\\n```tsx title=vite.config.ts\\nexport default defineConfig({\\n  // ...\\n  build: {\\n   // ...\\n// diff-add-start\\n   rollupOptions: {\\n       external: [\'react\', \'react/jsx-runtime\'],\\n   },\\n// diff-add-end\\n  },\\n});\\n```\\n\\n## 4. Add some styles\\n\\nAs mentioned in the beginning, this library will use CSS modules to style the components.\\n\\nCSS modules are supported by Vite per default. All you have to do is to create CSS files that end with `.module.css`.\\n\\n```bash\\n \ud83d\udcc2my-component-library\\n  \u2523 \ud83d\udcc2lib\\n  \u2503 \u2523 \ud83d\udcc2components\\n  \u2503 \u2503 \u2523 \ud83d\udcc2Button\\n  \u2503 \u2503 \u2503 \u2523 \ud83d\udcc2Button.tsx\\n  \u2503 \u2503 \u2503 \u2523 \ud83d\udcdcindex.ts\\n+ \u2503 \u2503 \u2503 \u2517 \ud83d\udcc2Button.module.css\\n  \u2503 \u2503 \u2517 \ud83d\udcc2Label\\n  \u2503 \u2503   \u2523 \ud83d\udcc2Label.tsx\\n  \u2503 \u2503   \u2523 \ud83d\udcdcindex.ts\\n+ \u2503 \u2503   \u2517 \ud83d\udcc2Label.module.css\\n  \u2503 \u2517 \ud83d\udcdcmain.ts\\n  \u2026\\n```\\n\\nAnd add some basic CSS classes:\\n\\n```css title=lib/components/Button/Button.module.css\\n.button {\\n    padding: 1rem;\\n}\\n```\\n\\n```css title=lib/components/Label/Label.module.css\\n.label {\\n    font-weight: bold;\\n}\\n```\\n\\nAnd import/use them inside your components eg:\\n\\n```tsx\\nimport styles from \'./styles.module.css\';\\n\\nexport function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {\\n  const { className, ...restProps } = props;\\n  return <button type=\'button\' className={`${className} ${styles.button}`} {...restProps} />;\\n}\\n```\\n\\n### \u26f4\ufe0f Ship your style\\n\\nAfter transpiling your library you will notice that there is a new file in your distribution folder:\\n\\n```bash\\n \ud83d\udcc2dist\\n  \u2523 \u2026\\n  \u2523 \ud83d\udcdcmy-component-library.js\\n# diff-add-next-line\\n\u2517 \ud83d\udcdcstyle.css\\n```\\n\\nBut there are two issues with this file:\\n\\n1. You need to manually import the file in the consuming application.\\n2. It is one file that contains all styles for all components.\\n\\n### Import the CSS\\n\\nCSS files just can\'t easily be imported in JavaScript. Therefore, the CSS file is generated separately, allowing the library user to decide how to handle the file.\\n\\nBut what if we were to assume that the application using the library has a bundler configuration that can handle CSS imports?\\n\\nFor this to work, the transpiled JavaScript bundle must contain an import statement for the CSS file. We are going to use yet another Vite plugin ([vite-plugin-lib-inject-css](https://github.com/emosheeep/vite-plugin-lib-inject-css/tree/master/packages/vite-plugin-lib-inject-css)) that does exactly what we need with zero configuration.\\n\\n```bash\\nnpm i vite-plugin-lib-inject-css -D\\n```\\n\\n```tsx title=vite.config.ts\\n// diff-add-next-line\\nimport { libInjectCss } from \'vite-plugin-lib-inject-css\';\\n\\nexport default defineConfig({\\n  // ...\\n  plugins: [\\n    react(),\\n// diff-add-next-line\\n    libInjectCss(),\\n    dts({ include: [\'lib\'] }),\\n  ],\\n  // ...\\n});\\n```\\n\\nBuild the library and take a look at the top of your bundled JavaScript file (`dist/my-component-library.js`):\\n\\n```tsx title=dist/my-component-library.js\\nimport \'./main.css\';\\n\\n// ...\\n```\\n\\n:::info\\n\ud83d\udca1 You may notice that the CSS filename has changed from style.css to main.css. This change occurs because the plugin generates a separate CSS file for each chunk, and in this case the name of the chunk comes from the filename of the entry file.\\n:::\\n\\n### Split up the CSS\\n\\nBut there\'s still the second problem: when you import something from your library, `main.css` is also imported and all the CSS styles end up in your application bundle. Even if you only import the button.\\n\\nThe `libInjectCSS` plugin generates a separate CSS file for each chunk and includes an import statement at the beginning of each chunk\'s output file.\\n\\nSo if you split up the JavaScript code, you end up having separate CSS files that only get imported when the according JavaScript files are imported.\\n\\nOne way of doing this would be to turn every file into an Rollup entry point. And, it couldn\'t be better, there is a recommended way of doing this right in the [Rollup documentation](https://rollupjs.org/configuration-options/#input):\\n\\n:::info\\n\ud83d\udcd8 If you want to convert a set of files to another format while maintaining the file structure and export signatures, the recommended way\u2014instead of using output.preserveModules that may tree-shake exports as well as emit virtual files created by plugins\u2014is to turn every file into an entry point.\\n:::\\n\\nSo let\'s add this to your configuration.\\n\\nFirst install `glob` as it will be required:\\n\\n```bash\\nnpm i glob -D\\n```\\n\\nThen change your Vite config to this:\\n\\n```tsx title=vite.config.ts\\n/* eslint-disable*/\\n// diff-remove-next-line\\nimport { resolve } from \'path\';\\n// diff-add-start\\nimport { extname, relative, resolve } from \'path\';\\nimport { glob } from \'glob\';\\nimport { fileURLToPath } from \'node:url\';\\n// diff-add-end\\n// ...\\nexport default defineConfig({\\n  // ...\\n    rollupOptions: {\\n      external: [\'react\', \'react/jsx-runtime\'],\\n\\n// diff-add-start\\n     input: Object.fromEntries(\\n         glob.sync(\'lib/**/*.{ts,tsx}\', {\\n             ignore: [\'lib/**/*.d.ts\'],\\n       }).map(file => [\\n         // The name of the entry point lib/nested/foo.ts becomes nested/foo\\n         relative(\\n             \'lib\',\\n           file.slice(0, file.length - extname(file).length),\\n         ),\\n         // The absolute path to the entry file lib/nested/foo.ts becomes /project/lib/nested/foo.ts\\n         fileURLToPath(new URL(file, import.meta.url)),\\n       ]),\\n     ),\\n// diff-add-end\\n    },\\n   // ...\\n});\\n```\\n\\n:::info\\n\ud83d\udca1 The glob library helps you to specify a set of filenames. In this case it selects all files ending with `.ts` or `.tsx` and ignores `*.d.ts` files.\\n:::\\n\\n**How to use Storybook for my library?**\\n\\nTo install Storybook run `npx storybook@latest init` and start adding your stories.\\n\\nIf you add stories inside the `lib` folder you also need to make sure to exclude all `.stories.tsx` files from the glob pattern so the stories don\'t end up in your bundle.\\n\\n```tsx\\nglob.sync(\'lib/**/*.{ts,tsx}\', { ignore: \'lib/**/*.stories.tsx\' });\\n```\\n\\nNow you end up with a bunch of JavaScript and CSS files in the root of your `dist` folder. It works, but it doesn\'t look particularly pretty, does it?\\n\\n```tsx title=vite.config.ts\\nexport default defineConfig({\\n\\n  rollupOptions: {\\n    // ...\\n// diff-add-start\\n     output: {\\n       assetFileNames: \'assets/[name][extname]\',\\n       entryFileNames: \'[name].js\',\\n     },\\n// diff-add-end\\n    },\\n    // ...\\n});\\n```\\n\\nTranspile the library again and all JavaScript files should now be in the same organized folder structure you have created in `lib` alongside with their type definitions. And the CSS files are inside a new folder called assets.\\n\\nTranspile the library again and all JavaScript files should now be in the same organized folder structure that you created in `lib` along with their types. And the CSS files are in a new folder called \\"assets\\". \ud83d\ude4c\\n\\nNotice that the name of the main file has changed from \\"my-component-library.js\\" to \\"main.js\\". That\'s great!\\n\\n## 4. A few last steps before you can publish the package\\n\\nYour build setup is now ready, there are just a few things to consider before releasing your package.\\n\\nThe `package.json` file will get published along with your package files. And you need to make sure it contains all important information about the package.\\n\\n### Main file\\n\\nEvery npm package has a primary entry point, per default this file is `index.js` in the root of the package.\\n\\nYour library\'s primary entry point is now located at `dist/main.js`, so this needs to be set in your `package.json`. The same applies to the type\'s entry point: `dist/main.d.ts`\\n\\n```json title=package.json\\n{\\n  \\"name\\": \\"my-component-library\\",\\n  \\"private\\": true,\\n  \\"version\\": \\"0.0.0\\",\\n  \\"type\\": \\"module\\",\\n// diff-add-start\\n  \\"main\\": \\"dist/main.js\\",\\n  \\"types\\": \\"dist/main.d.ts\\",\\n// diff-add-end\\n}\\n```\\n\\n### Define the files to publish\\n\\nYou should also define which files should be packed into your distributed package.\\n\\n```json title=package.json\\n{\\n  \\"main\\": \\"dist/main.js\\",\\n  \\"types\\": \\"dist/main.d.ts\\",\\n// diff-add-start\\n  \\"files\\": [\\n    \\"dist\\"\\n  ],\\n// diff-add-end\\n}\\n```\\n\\n:::info\\n\ud83d\udca1 Certain files like `package.json` or `README` are always included, regardless of settings.\\n:::\\n\\n### Dependencies\\n\\nNow take a look at your `dependencies`: right now there should be only two `react` and `react-dom` and a couple of `devDependencies`.\\n\\nYou can move those two to the `devDependencies` as well. And additionally add them as `peerDependencies` so the consuming application is aware that it must have React installed to use this package.\\n\\n```json title=package.json\\n{\\n// diff-remove-next-line\\n\\"dependencies\\": {\\n// diff-add-next-line\\n\\"peerDependencies\\": {\\n    \\"react\\": \\"^18.2.0\\",\\n    \\"react-dom\\": \\"^18.2.0\\"\\n  },\\n  \\"devDependencies\\": {\\n+   \\"react\\": \\"^18.2.0\\",\\n+   \\"react-dom\\": \\"^18.2.0\\",\\n  }\\n}\\n```\\n\\n:::info\\n\ud83d\udca1 See this StackOverflow answer to learn more about the different types of dependencies: [Link](https://stackoverflow.com/questions/18875674/whats-the-difference-between-dependencies-devdependencies-and-peerdependencie)\\n:::\\n\\n### Side effects\\n\\nTo prevent the CSS files from being accidentally removed by the consumer\'s tree-shaking efforts, you should also specify the generated CSS as side effects:\\n\\n```json title=package.json\\n{\\n// ...\\n// diff-add-next-line\\n\\"sideEffects\\": [\\"**/*.css\\"],\\n// ...\\n}\\n```\\n\\n### Ensure that the package is built\\n\\nYou can use the special lifecycle script prepublishOnly to guarantee that your changes are always built before the package is published:\\n\\n```json title=package.json\\n{\\n  \\"scripts\\": {\\n    \\"dev\\": \\"vite\\",\\n    \\"build\\": \\"tsc && vite build\\",\\n    // ...\\n// diff-add-next-line\\n  \\"prepublishOnly\\": \\"npm run build\\"\\n  },\\n}\\n```\\n\\n## 5. Demo page and deployment\\n\\nTo just play around with your components on the demo page, you can simply import the components directly from the root of your project. This works because your `package.json` points to the transpiled main file `dist/main.ts`.\\n\\n```tsx title=src/App.tsx\\n/* eslint-disable */\\nimport { Button, Input, Label } from \'../\';\\n\\n// ...\\n```\\n\\nTo publish your package, you just need to run `npm publish`. If you want to release your package to the public, you have to set `private: false` in your `package.json`.\\n\\nYou can read more about publishing your package, including installing it in a local project (without publishing) in these articles of mine:\\n\\n- [Publish/install your package](https://dev.to/receter/the-minimal-setup-to-package-and-reuse-your-react-components-1063#publishinstall-your-package)\\n- [Automatically publish you package with GitHub actions](https://dev.to/receter/automatically-publish-your-node-package-to-npm-with-pnpm-and-github-actions-22eg)"},{"id":"welcome","metadata":{"permalink":"/guides/he/blog/welcome","editUrl":"https://github.com/talkohavy/guides/blog/2021-08-26-welcome/index.md","source":"@site/blog/2021-08-26-welcome/index.md","title":"Welcome","description":"Docusaurus blogging features are powered by the blog plugin.","date":"2021-08-26T00:00:00.000Z","tags":[{"inline":true,"label":"facebook","permalink":"/guides/he/blog/tags/facebook"},{"inline":true,"label":"hello","permalink":"/guides/he/blog/tags/hello"},{"inline":true,"label":"docusaurus","permalink":"/guides/he/blog/tags/docusaurus"}],"readingTime":0.405,"hasTruncateMarker":false,"authors":[{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","imageURL":"https://github.com/slorber.png","key":"slorber","page":null},{"name":"Yangshun Tay","title":"Front End Engineer @ Facebook","url":"https://github.com/yangshun","imageURL":"https://github.com/yangshun.png","key":"yangshun","page":null}],"frontMatter":{"slug":"welcome","title":"Welcome","authors":["slorber","yangshun"],"tags":["facebook","hello","docusaurus"]},"unlisted":false,"prevItem":{"title":"Create a Component Library Fast \ud83d\ude80 (using Vite\'s library mode)","permalink":"/guides/he/blog/vite-library-mode"},"nextItem":{"title":"MDX Blog Post","permalink":"/guides/he/blog/mdx-blog-post"}},"content":"[Docusaurus blogging features](https://docusaurus.io/docs/blog) are powered by the [blog plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog).\\n\\nSimply add Markdown files (or folders) to the `blog` directory.\\n\\nRegular blog authors can be added to `authors.yml`.\\n\\nThe blog post date can be extracted from filenames, such as:\\n\\n- `2019-05-30-welcome.md`\\n- `2019-05-30-welcome/index.md`\\n\\nA blog post folder can be convenient to co-locate blog post images:\\n\\n![Docusaurus Plushie](./docusaurus-plushie-banner.jpeg)\\n\\nThe blog supports tags as well!\\n\\n**And if you don\'t want a blog**: just delete this directory, and use `blog: false` in your Docusaurus config."},{"id":"mdx-blog-post","metadata":{"permalink":"/guides/he/blog/mdx-blog-post","editUrl":"https://github.com/talkohavy/guides/blog/2021-08-01-mdx-blog-post.mdx","source":"@site/blog/2021-08-01-mdx-blog-post.mdx","title":"MDX Blog Post","description":"Blog posts support Docusaurus Markdown features, such as MDX.","date":"2021-08-01T00:00:00.000Z","tags":[{"inline":true,"label":"docusaurus","permalink":"/guides/he/blog/tags/docusaurus"}],"readingTime":0.175,"hasTruncateMarker":false,"authors":[{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","imageURL":"https://github.com/slorber.png","key":"slorber","page":null}],"frontMatter":{"slug":"mdx-blog-post","title":"MDX Blog Post","authors":["slorber"],"tags":["docusaurus"]},"unlisted":false,"prevItem":{"title":"Welcome","permalink":"/guides/he/blog/welcome"},"nextItem":{"title":"Greetings!","permalink":"/guides/he/blog/greetings"}},"content":"Blog posts support [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features), such as [MDX](https://mdxjs.com/).\\n\\n:::tip\\n\\nUse the power of React to create interactive blog posts.\\n\\n```js\\n<button onClick={() => alert(\'button clicked!\')}>Click me!</button>\\n```\\n\\n<button onClick={() => alert(\'button clicked!\')}>Click me!</button>\\n\\n:::"},{"id":"greetings","metadata":{"permalink":"/guides/he/blog/greetings","editUrl":"https://github.com/talkohavy/guides/blog/2021-02-28-greetings.md","source":"@site/blog/2021-02-28-greetings.md","title":"Greetings!","description":"Congratulations, you have made your first post!","date":"2021-02-28T00:00:00.000Z","tags":[{"inline":true,"label":"greetings","permalink":"/guides/he/blog/tags/greetings"}],"readingTime":0.1,"hasTruncateMarker":false,"authors":[{"name":"Joel Marcey","title":"Co-creator of Docusaurus 1","url":"https://github.com/JoelMarcey","image_url":"https://github.com/JoelMarcey.png","imageURL":"https://github.com/JoelMarcey.png","key":null,"page":null},{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","image_url":"https://github.com/slorber.png","imageURL":"https://github.com/slorber.png","key":null,"page":null}],"frontMatter":{"slug":"greetings","title":"Greetings!","authors":[{"name":"Joel Marcey","title":"Co-creator of Docusaurus 1","url":"https://github.com/JoelMarcey","image_url":"https://github.com/JoelMarcey.png","imageURL":"https://github.com/JoelMarcey.png"},{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","image_url":"https://github.com/slorber.png","imageURL":"https://github.com/slorber.png"}],"tags":["greetings"]},"unlisted":false,"prevItem":{"title":"MDX Blog Post","permalink":"/guides/he/blog/mdx-blog-post"},"nextItem":{"title":"Long Blog Post","permalink":"/guides/he/blog/long-blog-post"}},"content":"Congratulations, you have made your first post!\\n\\nFeel free to play around and edit this post as much you like."},{"id":"long-blog-post","metadata":{"permalink":"/guides/he/blog/long-blog-post","editUrl":"https://github.com/talkohavy/guides/blog/2019-05-29-long-blog-post.md","source":"@site/blog/2019-05-29-long-blog-post.md","title":"Long Blog Post","description":"This is the summary of a very long blog post,","date":"2019-05-29T00:00:00.000Z","tags":[{"inline":true,"label":"hello","permalink":"/guides/he/blog/tags/hello"},{"inline":true,"label":"docusaurus","permalink":"/guides/he/blog/tags/docusaurus"}],"readingTime":2.05,"hasTruncateMarker":true,"authors":[{"name":"Endilie Yacop Sucipto","title":"Maintainer of Docusaurus","url":"https://github.com/endiliey","imageURL":"https://github.com/endiliey.png","key":"endi","page":null}],"frontMatter":{"slug":"long-blog-post","title":"Long Blog Post","authors":"endi","tags":["hello","docusaurus"]},"unlisted":false,"prevItem":{"title":"Greetings!","permalink":"/guides/he/blog/greetings"},"nextItem":{"title":"First Blog Post","permalink":"/guides/he/blog/first-blog-post"}},"content":"This is the summary of a very long blog post,\\n\\nUse a `\x3c!--` `truncate` `--\x3e` comment to limit blog post size in the list view.\\n\\n\x3c!--truncate--\x3e\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet"},{"id":"first-blog-post","metadata":{"permalink":"/guides/he/blog/first-blog-post","editUrl":"https://github.com/talkohavy/guides/blog/2019-05-28-first-blog-post.md","source":"@site/blog/2019-05-28-first-blog-post.md","title":"First Blog Post","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet","date":"2019-05-28T00:00:00.000Z","tags":[{"inline":true,"label":"hola","permalink":"/guides/he/blog/tags/hola"},{"inline":true,"label":"docusaurus","permalink":"/guides/he/blog/tags/docusaurus"}],"readingTime":0.12,"hasTruncateMarker":false,"authors":[{"name":"Gao Wei","title":"Docusaurus Core Team","url":"https://github.com/wgao19","image_url":"https://github.com/wgao19.png","imageURL":"https://github.com/wgao19.png","key":null,"page":null}],"frontMatter":{"slug":"first-blog-post","title":"First Blog Post","authors":{"name":"Gao Wei","title":"Docusaurus Core Team","url":"https://github.com/wgao19","image_url":"https://github.com/wgao19.png","imageURL":"https://github.com/wgao19.png"},"tags":["hola","docusaurus"]},"unlisted":false,"prevItem":{"title":"Long Blog Post","permalink":"/guides/he/blog/long-blog-post"}},"content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet"}]}}')}}]);