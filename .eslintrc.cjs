/**
 * Notice: you googled ESLint Prettier Typescript React, and ended up installing:
 * - typescript
 * - eslint
 * - prettier
 * - eslint-plugin-react
 * - @typescript-eslint/eslint-plugin
 * - @typescript-eslint/parser
 * - eslint-plugin-import
 * - eslint-import-resolver-typescript
 * pnpm add -wD typescript eslint prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-import-resolver-typescript
 * @type { import('eslint').ESLint.ConfigData }
 */
module.exports = {
  root: true,
  extends: [
    // 'prettier', // i suspect that this thing here didn't do anything, because it also appears in "plugins", so i'm trying to comment it out. We'll see.
    'eslint:recommended', // comes from the eslint-plugin-react.
    'plugin:react/recommended', // comes from the eslint-plugin-react.
    'plugin:react/jsx-runtime', // comes from eslint-plugin-react. From the documentation: If you are using the new JSX transform from React 17, extend react/jsx-runtime in your eslint config (add "plugin:react/jsx-runtime" to "extends") to disable the relevant rules.
    // 'plugin:prettier/recommended', // this is the same as using prettier, only it adds a few rules.
  ],
  plugins: [
    'prettier', // <-- if you had used plugin:prettier/recommended this would have been enabled by default.
    'import',
    '@typescript-eslint',
    'sort-exports',
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    // detect solved the annoying warning of: "React version not specified in eslint-plugin-react settings"
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: { alwaysTryTypes: true, project: './jsconfig.json' } },
  },
  parserOptions: {
    ecmaVersion: 'latest', // Solved module not being recognized.
    sourceType: 'module', // Solved import & export not being recognized.
    ecmaFeatures: { jsx: true }, // Solved jsx files not being linted.
  },
  overrides: [
    // This is an example of how you can make overrides:
    {
      files: ['*.html'],
      excludedFiles: '*.test.html',
      parser: 'html',
      rules: { quotes: ['error', 'single'] },
    },
  ],
  env: {
    node: true, // Solved 'XXX not being recognized'. XXX: module, require, process
    browser: true, // Solved window & document object not being recognized.
    jest: true, // Solved jest keywords like test & expect.
    es6: true, // Solved Promise is not defined.
  },
  globals: {
    myCache: true,
    redisClient: true,
    defaultUser: true,
    ValidationError: true,
    UnauthorizedError: true,
    ForbiddenError: true,
    NotFoundError: true,
    InternalServerError: true,
    ServerError: true,
  },
  rules: {
    // NOTE: This is where you can Override default settings coming from the plugins!

    // #########################
    // Rule Set 1: generic rules
    // #########################
    'no-unreachable': 'error', // default value is error.
    'no-debugger': 'warn', // default value is error. Disallow the use of the debugger keyword.
    'no-unused-vars': 'off', // Solved unused variables raising an error. Using @typescript-eslint/no-unused-vars instead.
    'prefer-template': 'error', // turns this: name + value, to `${name}${value}`
    'arrow-body-style': 'error', // Makes a return with one line a one-liner without a return. if you had used plugin:prettier/recommended this would have been enabled by default.
    'prefer-arrow-callback': 'off', // if you had used plugin:prettier/recommended this would have been enabled by default
    'no-constant-condition': 'off',
    // 'no-console': 'error', // Uncomment this if you want to disallow console logs, warns, or even errors.
    // 'no-duplicate-imports': 'error', // The rule "import/no-duplicates" has better performance (and can actually merge them and offer a fix!)

    // ############################
    // Rule Set 2: typescript rules
    // ############################
    '@typescript-eslint/no-unused-vars': 'error',

    // ########################
    // Rule Set 3: import rules
    // ########################
    'import/no-duplicates': 'error', // merges when two import lines import from the same file!
    'import/no-unresolved': 'error', // { ignore: ['^@site', '^@theme', '^@docusaurus', '^@generated', 'unist', 'mdast'] } Turns on errors for missing imports. # import/no-unresolved: [2, { commonjs: true, amd: true }] // This rules catches unresolved imports, but you don't need it since typescript also catches unresolved imports.
    'import/newline-after-import': ['error', { count: 1, considerComments: true }], // must use a newline between all imports and next line of code. Options object defaults to { count: 1, considerComments: false }.
    'import/first': 'error', // I want the imports to be the first thing to appear in every file.
    'import/exports-last': 'error', // Ensure all exports appear after other statements.
    'import/extensions': ['error', 'never', { js: 'always' }],
    // - about import/extensions = Ensures consistent use of file extension on import path. it also had "'always', { ignorePackages: true }", which made internal packages fail at runtime if I enable this (api-gateway is an example case).
    'import/order': [
      // The given rule enforces a convention in the order of require() / import statements!
      'error',
      {
        pathGroups: [
          { pattern: 'react', group: 'builtin' },
          { pattern: '@*/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'never',
        groups: [
          // Level 1: builtin modules - i.e. import fs from 'fs' & import path from 'path'
          'builtin',
          // Level 2: external modules - i.e. import clsx from 'clsx'
          'external',
          // Level 4: internal modules - i.e. import foo from 'src/foo';
          'internal',
          // Level 5: modules from a "parent" directory - i.e. import foo from '../foo' & import foo from '../../foo'
          'parent',
          // Level 6: "sibling" modules from the same or a sibling's directory - i.e. import bar from './bar' & import baz from './bar/baz'
          'sibling',
          // Level 7: "index" of the current directory - i.e. import main from './'
          'index',
          // Level 8: only available in TypeScript
          'object',
          // Level 9: only available in TypeScript
          'type',
        ],
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
    // 'import/prefer-default-export': 'error', // Uncomment this if you only want to see export default and to disallow export { someVariable }.
    // 'import/named': 'error', // I disabled this, because typescript gives the same effect. When you import { servicename } from './A.js' but A doesn't contain an export { servicename }, you'll get a servicename not found in './A.js' eslint (import/named).
    // 'import/default': 'error', // I disabled this, because typescript gives the same effect. Ensures that a default export is present, given a default import.
    // 'import/export': 'error', // I disabled this, because typescript gives the same effect. Report any invalid exports, i.e. re-export of the same name.

    // ##########################
    // Rule Set 4: prettier rules
    // ##########################
    // Note: This did NOT age well! I'm using .prettiertrc.yaml which works best
    // 'prettier/prettier': [
    //   // if you had used plugin:prettier/recommended this would have been enabled by default
    //   'error',
    //   {
    //     trailingComma: 'es5',
    //     tabWidth: 2,
    //     semi: true,
    //     singleQuote: true,
    //     jsxSingleQuote: true,
    //     jsxBracketSameLine: false,
    //     bracketSpacing: true,
    //     arrowParens: 'always',
    //     parser: 'typescript',
    //     endOfLine: 'auto',
    //     printWidth: 120,
    //     proseWrap: 'preserve',
    //     htmlWhitespaceSensitivity: 'css',
    //     embeddedLanguageFormatting: 'off',
    //     quoteProps: 'as-needed',
    //   },
    //   { parser: 'typescript' },
    // ],

    // ##############################
    // Rule Set 5: sort-imports rules
    // ##############################
    'sort-imports': [
      'error',
      {
        ignoreCase: false, // set to false, because I want UPPERCASE letters up and lowercase letters down.
        ignoreDeclarationSort: true, // set to true, because import order is handled by the import/order rule.
        ignoreMemberSort: false, // set to false, because this is the rules that allows for inner sorting!
        memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        allowSeparatedGroups: false, // When true, the rule only checks the sorting of imports that appear on consecutive lines.
      },
    ],

    // ##############################
    // Rule Set 6: sort-exports rules
    // ##############################
    // NOTE: Comes from the plugin eslint-plugin-sort-exports.
    'sort-exports/sort-exports': ['error', { sortDir: 'asc' }],
  },
};
