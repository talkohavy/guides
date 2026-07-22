# .prettierrc.mjs

```js
// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

const config = {
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: false, // <--- This is for an HTML file. if true, puts the closing of an opening tag on the last line instead of on a new line.
  bracketSpacing: true, // <--- turns this {foo: bar} into this { foo: bar }
  arrowParens: 'always', // <--- Leave it on "always"! turns this x => x into this (x) => x. This rule MUST stay on "always"! Otherwise it would collide with the "prefer-arrow-callback" & "arrow-body-style" combo from eslint.
  endOfLine: 'auto',
  printWidth: 120, // <--- Defaults to 80.
  proseWrap: 'preserve', // <--- This is relevant for markdown file. "always" creates a line break when line exceeds the amount of allowed characters. "preserve" wraps the text, but remembers that it's a single line. "never" keeps that text in a single line and doesn't wrap at all; text will be kept as a very long one-liner.
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'off',
  quoteProps: 'as-needed', // <--- only add quotes around object properties where required
  overrides: [
    {
      files: ['*.yaml'],
      options: {
        // This is needed in order to NOT brake Helm template syntax
        bracketSpacing: false,
      },
    },
  ],
};

export default config;

```
