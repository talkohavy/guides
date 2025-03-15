# Jest

## 1. Installation

Add a script:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Install these:

```bash
pnpm add -D @testing-library/dom @testing-library/jest-dom @testing-library/react jest jest-environment-jsdom ts-jest
```

Create a `jest.config.js` file:  
(this file was generated using `jest --init`)

```ts title=jest.config.js
import requireJSON from 'json-easy-strip';
import { createDefaultPreset } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
const tsconfig = requireJSON('./tsconfig.json');

/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const config = {
  ...createDefaultPreset(),

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'jsdom', // <--- IMPORTANT! must be 'jsdom'. Option are: 'jsdom' | 'node'.

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.tsx'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },

  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/yv/tfvrv22n3rn8g7_2dzx2n8lc0000gn/T/jest_dx",

  // Automatically clear mock calls, instances, contexts and results before every test
  // clearMocks: false,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  // coverageDirectory: undefined,

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "mjs",
  //   "cjs",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "json",
  //   "node"
  // ],

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state before every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};

export default config;
```

There are many ways to configure jest, **we are using `ts-jest`**.

Other ways are:

- Babel
- webpack
- Vite (Jest is not fully supported by vite)
- Parcel
- TypeScript (through `ts-jest`)

---

## 2. Important to know CLI options

### `--listTests`

Lists all test files that Jest will run given the arguments, and exits.

### `--config=<path>`

Alias: `-c`. The path to a Jest config file specifying how to find and execute tests. If no `rootDir` is set in the config, the directory containing the config file is assumed to be the `rootDir` for the project. This can also be a JSON-encoded value which Jest will use as configuration.

### `--showConfig`

Print your Jest config and then exits.

### `--passWithNoTests`

Allows the test suite to pass when no files are found.

### `--runTestsByPath`

Run only the tests that were specified with their exact paths. This avoids converting them into a regular expression and matching it against every single file.

For example, given the following file structure:

```
__tests__
└── t1.test.js # test
└── t2.test.js # test
```

When ran with a pattern, no test is found:

```bash
jest --runTestsByPath __tests__/t
```

Output:

```bash
No tests found
```

However, passing an exact path will execute only the given test:

```bash
jest --runTestsByPath __tests__/t1.test.js
```

### `--silent`

Prevent tests from printing messages through the console.

### `--verbose`

Display individual test results with the test suite hierarchy.

---

## 3. Catch a thrown Error

If you want to test whether a particular function throws an error when it's called, use `toThrow`.

```ts
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);

  // You can also use a string that must be contained in the error message or a regexp
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);

  // Or you can match an exact error message using a regexp like below
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
});
```

---

## 4. Testing Asynchronous Code

Jest needs to know when the code it is testing has completed before it can move on to another test. Jest has several ways to handle this.

- **Promises**: Return a promise from your test, and Jest will wait for that promise to resolve. If the promise is rejected, the test will fail.
- **Async/Await**: Make your test `async` and use the `await` keyword inside.

These two tests are equal:

```ts
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});
```

```ts
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

### `resolves` & `rejects`

You can combine async and await with `.resolves` or `.rejects`.
For that to work **you need to pass a promise** to the `expect`, and add an await keyword before the `expect`. Jest will wait for that promise to either resolve or reject (depending)and if the promise is rejected when it should be resolved, or vice versa, the test will fail.

```ts
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});
```

:::danger
Be sure to return (or `await`) the promise - if you omit the `return`/`await` statement, your test will complete before the promise returned from `fetchData` resolves or rejects.

For example,

```ts
async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
}

test('1 equals 2', () => {
  fetchData().then((data) => {
    expect(data).toBe(2);
  });
});
```

The above test will PASS, but **it should NOT PASS**!
:::

---

## 5. Mock Functions

Here are all the possible scenarios you might have:

1. You wanna test function A. Function A **accepts** callback function as one of its parameters.
2. You wanna test function A. Function A **uses** another function B. Function A **imports** function B from a different file/module.
3. You wanna test function A. Function A **uses** another function B. Functions A and B both live on the same file.
4. You wanna test function A. Function A **uses** another function B. You need to mock the returned value with different values at each time.
5. You wanna test Class A. Class A **has** method B which returns `this`.

### Scenario 1: Mock callback fn as argument using `jest.fn()`

#### A. Goal Explanation

You wanna test function A. Function A **accepts** callback function as one of its parameters.

#### B. Example code to test

```ts
export function forEach(items, callback) {
  for (const item of items) {
    callback(item);
  }
}
```

#### C. Case Description

Above we have a function called `forEach` that we want to test. `forEach` accepts `callback` as a parameter, ad calls it inside for each item under the items array.

Our goal is to write a test that:

- checks how many times `mockCallback` has been called.
- checks the first argument of the first and second calls were as expected.

#### D. How to test

What are the steps to achieve this goal?

1. We will use `jest.fn()` to create a `mockCallback` const.
2. We will pass `mockCallback` as the argument to our tested function (forEach).
3. We will inspect the `mock` property of `mockCallback` (more specifically the `mockCallback.mock.calls` sub-property).
4. Use plain matchers such as `toBe` or `toHaveLength`.

We will write the test as such:

```ts
import { forEach } from './forEach';

const mockCallback = jest.fn();

test('forEach mock function', () => {
  const items = [0, 1];
  forEach(items, mockCallback);

  // The mock function was called al least once
  expect(mockCallback.mock.calls.length).toBeGreaterThan(0);

  // The mock function was called exactly twice
  expect(mockCallback.mock.calls).toHaveLength(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);
});
```

Instead of using the `.mock` property directly, jest had created a syntactic sugar around it for every operation and check we might need. So we will not be writing test as above.

A better way to write it is:

```ts
import { forEach } from './forEach';

const mockCallback = jest.fn();

test('forEach mock function', () => {
  const items = [0, 1];
  forEach(items, mockCallback);

  // The mock function was called al least once
  // diff-remove-next-line
  expect(mockCallback.mock.calls.length).toBeGreaterThan(0);
  // diff-add-next-line
  expect(mockCallback).toHaveBeenCalled();

  // The mock function was called exactly twice
  // diff-remove-next-line
  expect(mockCallback.mock.calls).toHaveLength(2);
  // diff-add-next-line
  expect(mockCallback).toHaveBeenCalledTimes(2);

  // The first argument of the first call to the function was 0
  // diff-remove-next-line
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  // diff-add-next-line
  expect(mockCallback).toHaveBeenNthCalledWith(1, 0);

  // The first argument of the second call to the function was 1
  // diff-remove-next-line
  expect(mockCallback.mock.calls[1][0]).toBe(1);
  // diff-add-next-line
  expect(mockCallback).toHaveBeenNthCalledWith(2, 1);
});
```

<br/>

### Scenario 2: Mocking Modules with `jest.mock(...)`

#### A. Goal Explanation

You wanna test function A. Function A **uses** another function B. Function A **imports** function B from a different file/module.

#### B. Example code to test

```ts
import axios from 'axios';

type Filters = {
  nameStartsWith: string;
  ageGreaterThan: number;
};

export class Users {
  static async findMany(filters?: Filters) {
    const updatedFilters: Filters = {
      ageGreaterThan: filters?.ageGreaterThan ?? 0,
      nameStartsWith: filters?.nameStartsWith ?? 't',
    };

    const response = await axios.get('/users.json', {
      headers: {
        'x-filter-name': updatedFilters.nameStartsWith,
        'x-filter-age': updatedFilters.ageGreaterThan,
      },
    });

    const { data } = response;

    return data;
  }
}
```

#### C. Case Description

Above we have a class called `Users` with a method called `findMany` which we want to test. `Users` calls `axios`, an imported **module**, under the hood to send all of its async api requests. The `findMany` method specifically calls `axios.get`.

Let's say that our goal is to write a test that:

- checks that `axios.get` had been called at least once.
- checks that the headers (a property under the second argument) were created as expected.
- mock the response value so that the test won't crash

#### D. How to test

What are the steps to achieve this goal?

1. We will use `jest.mock('module-name')` to specify just which module to mock.
2. Import the module into our test. This will give us 100% control (we'll see what it means soon).
3. We will mock wanted methods on axios (i.e. `get`).
4. We would use matchers like `.haveBeenCalledOnce` and such on those mocked methods.

**• Why we need so many things?**

First, let's explain why we need so many things. Like, why we need to write `jest.mock`, but also import the actual module to be mocked.

Here's a test template:

```ts
import Users from './users';

test('should fetch users', async () => {
  const data = await Users.findMany();

  // ???
});
```

We are calling `Users.findMany()`, which under the hood calls `axios`.  
`axios` needs to be mocked.

We start by adding `jest.mock`:

```ts
import Users from './users';

jest.mock('axios');

// ...
```

What this will do is **it will mock any import of the axios module**, and wrap it around some `jest` function.

The problem with the code above is the return value. `Users.findMany()` calls `axios.get()`, and expects it to return some data. If it won't return the same data structure, **the code will crash**. We now need a way to alter the return value of `axios.get()`.

What we can do is this (_not recommended_):

```ts
import { Users } from './users';

jest.mock('axios', () => {
  return {
    get: jest.fn(() => ({ data: { age: 5 } })),
  };
});

test('should fetch users', async () => {
  const data = await Users.findMany();

  expect(data.age).toBe(5);
});
```

While this works, we are still missing something.  
What we wanna do is be able to ask questions like:

- How many times it has `get` been called?
- What were the arguments `get` was called with?

We don't have access to the `get` function (yet!). To get it, we need to import axios **INSIDE** our test!

```ts showLineNumbers
import axios from 'axios';
import { Users } from './users';

console.log('axios is:', axios);

jest.mock('axios', () => {
  return {
    get: jest.fn(() => ({ data: { age: 5 } })),
  };
});
```

In the above code, if we were to put breakpoints in lines 4 and 6, line 6 would be hit first! `jest.mock()` is hoisted all the way to the top! Before any of the imports occur. This guarantees that the import of `axios` inside our test will be of the **mocked axios**, and not the **real axios**. This now gives us the ability to ask questions about `axios.get` inside of tests:

With adding the import `axios` statement, the test file will look like this:

```ts
import axios from 'axios';
import { Users } from './users';

jest.mock('axios', () => {
  return {
    get: jest.fn(() => ({ data: { age: 5 } })),
  };
});

test('should fetch users', async () => {
  const data = await Users.findMany();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('/users.json', {
    headers: { 'x-filter-name': 't', 'x-filter-age': 0 },
  });
  expect(data.age).toBe(5);
});
```

The above code is great, but there's one thing to note about it - the implementation mock that is provided as the second argument to `jest.mock` will **stay the same for every test in that file**. Well, but what if we want to have flexibility over different test?

What we can do is to not provide a mock implementation as the second argument, and have each test define it on the fly for its own use.

Like so:

```ts
import axios from 'axios';
import { Users } from './users';

jest.mock('axios');

test('should fetch users', async () => {
  const data = await Users.findMany();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('/users.json', {
    headers: { 'x-filter-name': 't', 'x-filter-age': 0 },
  });
  expect(data.age).toBe(5);
});
```

You're probably seeing that **typescript error** under `mockResolvedValue`. Your IDE thinks it's the real `axios`, and that `axios.get` has no property of `mockResolvedValue` on it. We need to tell it that `axios.get` is a `jest.fn` type:

```ts
import axios from 'axios';
import { Users } from './users';

jest.mock('axios');

test('should fetch users', async () => {
  (axios.get as jest.Mock).mockResolvedValue({ data: { age: 5 } });
  // Would also work: (axios.get as jest.Mock).mockReturnValue({ data: { age: 5 } });

  const data = await Users.findMany();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('/users.json', {
    headers: { 'x-filter-name': 't', 'x-filter-age': 0 },
  });
  expect(data.age).toBe(5);
});
```

<br/>

### Scenario 3: Mocking Modules Partially

#### A. Goal Explanation

You wanna test function A. Function A **uses** another function B. Functions A and B both live on the same file.

#### B. Example code to test

```ts
export const namedExportVariable = 'named export variable';
export function namedExportFunction() {
  return 'named export function';
};

export default () => 'export default function';
```

#### C. Case Description

Steps to achieve this goal:

- We will again use `jest.mock`
- We will pass it a **mock implementation** of the module as the seconds argument
- Inside the mock implementation:
  - We will use `jest.requireActual('path')`, which is a special jest function that allows us to import the real module.
  - We will return an object, where inside it:
    - We will spread `jest.requireActual('path')`. Those will be all the parts of the module we want as unmocked.
    - Below the spread, we will override the parts we want to mock.
- If you need to import the module as **default**, the return object of the mock implementation MUST contain the special key of `__esModule: true,`.

#### D. How to test

##### Example 1: a named export

If we only want to mock `namedExportFunction`, then our test file should be:

```ts
import { namedExportFunction, namedExportVariable } from './foo-bar-baz';

jest.mock('./foo-bar-baz', () => {
  const originalModule = jest.requireActual('./foo-bar-baz');

  return {
    ...originalModule,
    namedExportFunction: jest.fn(() => 'mocked named export function'),
  };
});

test('should do a partial mock', () => {
  // The mocked parts:
  const namedExportFunctionResult = namedExportFunction();
  expect(namedExportFunction).toHaveBeenCalled();
  expect(namedExportFunctionResult).toBe('mocked named export function');

  // The unmocked parts:
  expect(namedExportVariable).toBe('named export variable');
});
```

##### Example 2: a default export

If you need to either **mock a default export** object, or **import a default export** object, you'll need to use the special keyword of `__esModule: true,`.

For example, here's the test file when mocking the `export default` object:

```ts
import defaultExportFunction, { namedExportVariable } from './foo-bar-baz';

jest.mock('./foo-bar-baz', () => {
  const originalModule = jest.requireActual('./foo-bar-baz');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked export default function'),
  };
});

test('should do a partial mock', () => {
  // The mocked parts:
  const defaultExportFunctionResult = defaultExportFunction();
  expect(defaultExportFunction).toHaveBeenCalled();
  expect(defaultExportFunctionResult).toBe('mocked export default function');

  // The unmocked parts:
  expect(namedExportVariable).toBe('named export variable');
});
```

And here's the test file when only using the `export default` object, and mocking another named part of the module:

```ts
import defaultExportFunction, { namedExportVariable } from './foo-bar-baz';

jest.mock('./foo-bar-baz', () => {
  const originalModule = jest.requireActual('./foo-bar-baz');

  return {
    __esModule: true,
    ...originalModule,
    namedExportVariable: 'mocked named export variable',
  };
});

test('should do a partial mock', () => {
  // The mocked parts:
  expect(namedExportVariable).toBe('mocked named export variable');

  // The unmocked parts:
  const defaultExportFunctionResult = defaultExportFunction();
  expect(defaultExportFunctionResult).toBe('export default function');
});
```

In both cases, omitting the `__esModule: true` would cause the tests to fail.

<br/>

### Scenario 4: Mock Return Values Multiple Times

#### A. Goal Explanation

You wanna test function A. Function A **uses** another function B. You need to mock the returned value with different values at each time.

#### B. Example code to test

None. This is just about the test itself.

#### C. Case Description

We can control the **implementation** of the mock function depending of the amount of calls made to it so far (index-based).

#### D. How to test

```ts
test('should do a partial mock', () => {
  const myMockFn = jest
    .fn(() => 1)
    .mockImplementation(() => 3);
    .mockImplementationOnce(() => 10)
    .mockImplementationOnce(() => 42)

  console.log(myMockFn()); // 10
  console.log(myMockFn()); // 42
  console.log(myMockFn()); // 3
  console.log(myMockFn()); // 3
  console.log(myMockFn()); // 3

  expect(1).toBe(1);
});
```

When you need to recreate a complex behavior of a mock function such that multiple function calls produce different results, use the `mockImplementationOnce` method. When the mocked function runs out of implementations defined with `mockImplementationOnce`, it will execute the default implementation set with:

- `mockImplementation` - first priority! (if defined)
- `jest.fn` - second priority (if defined)

The output of the code above would be:

```
10
42
3
3
3
```

Notice how `1` is never printed.

It's worth noting that the order of appearance of `mockImplementationOnce` matters, but when `mockImplementation` appears doesn't matter.  
For example:

```ts
// This:
const myMockFn = jest
  .fn()
  .mockImplementation(() => 3);
  .mockImplementationOnce(() => 10)
  .mockImplementationOnce(() => 42)

// is exactly the same as this:
const myMockFn = jest
  .fn()
  .mockImplementationOnce(() => 10)
  .mockImplementationOnce(() => 42)
  .mockImplementation(() => 3);

// and also the same as this:
const myMockFn = jest
  .fn(() => 3)
  .mockImplementationOnce(() => 10)
  .mockImplementationOnce(() => 42);
```

<br/>

### Scenario 5: Mock a return `this` method

#### A. Goal Explanation

You wanna test Class A. Class A **has** method B which returns `this`.

#### B. Example code to test

```ts
export class MyClass {
  private name: string = '';
  private age: number = 0;

  setName(name?: string): this {
    if (typeof name === 'string') this.name = name;

    return this;
  }

  setAge(age?: number) {
    if (typeof age === 'number') this.age = age;

    return this;
  }

  logCreated() {
    fetch('http://localhost:8000').then((response) => {
      console.log('data is:', response);
    });

    return this;
  }

  toJSON(): { name: string; age: number } {
    return { name: this.name, age: this.age };
  }
}

type InitProps = {
  name?: string;
  age?: number;
};

export function init(props?: InitProps) {
  const { name, age } = props ?? {};

  const instance = new MyClass().setName(name).setAge(age).logCreated();

  return instance;
}
```

#### C. Case Description

Above we have a function called `init` that we want to test. `init` creates an instance of `MyClass`, and calls a few of its methods. The problem is that one of the methods (`logCreated` in this case) is making an API request, which we want to avoid.

Our goal is:

- to write a test that tests the `init` function.
- avoid the request call (do not send an API request).

#### D. How to test

We start off by mocking the module of `MyClass` using `jest.mock`.  
We only want to mock `MyClass.prototype.logCreated`, and for the rest of the stuff from the module to remain as the actual implementation, so we'll use `jest.requireActual()`. Then, we'll mock just the `logCreated` method, and since we need it to return a pointer to `this`, we'll use jest's `mockReturnThis`. We will import `MyClass`, which will be the mocked version (since we used `jest.mock`), and we'll ask questions about `MyClass.prototype.logCreated`.

```ts
import { MyClass, init } from './MyClass';

jest.mock('./MyClass', () => {
  const actualModule = jest.requireActual('./MyClass');

  actualModule.MyClass.prototype.logCreated = jest.fn().mockReturnThis();

  return actualModule;
});

describe('init function', () => {
  it('should create an instance of MyClass and use real methods except logCreated', async () => {
    const instance = init({ name: 'Alice', age: 30 });

    // Ensure that the object is an instance of MyClass
    expect(instance).toBeInstanceOf(MyClass);

    // Check that the real setName and setAge methods worked
    expect(instance.toJSON()).toEqual({ name: 'Alice', age: 30 });

    // Ensure that logCreated was called
    expect(MyClass.prototype.logCreated).toHaveBeenCalledTimes(1);
  });
});
```

## 6. Prefer using `spyOn` over `mock`

When possible, always prefer using `spyOn` instead of `mock`.

### Scenario 1: callback function passed as argument

The example code:

```ts
export function forEach(items, callback) {
  for (const item of items) {
    callback(item);
  }
}
```

The test we wrote:

```ts
import { forEach } from './forEach';

const mockCallback = jest.fn();

test('forEach mock function', () => {
  const items = [0, 1];
  forEach(items, mockCallback);

  expect(mockCallback).toHaveBeenCalled();
  expect(mockCallback).toHaveBeenCalledTimes(2);
  expect(mockCallback).toHaveBeenNthCalledWith(1, 0);
  expect(mockCallback).toHaveBeenNthCalledWith(2, 1);
});
```

The conclusion:

We had used `jest.fn()` to create a function that does not exist (and named it `mockCallback`). We use `spyOn` on functions that do exist, and because `mockCallback` did not exists, it's not right to use `spyOn` in this case.

<br/>

### Scenario 2: mocking `axios.get`

The example code:

```ts
import axios from 'axios';

type Filters = {
  nameStartsWith: string;
  ageGreaterThan: number;
};

export class Users {
  static async findMany(filters?: Filters) {
    const updatedFilters: Filters = {
      ageGreaterThan: filters?.ageGreaterThan ?? 0,
      nameStartsWith: filters?.nameStartsWith ?? 't',
    };

    const response = await axios.get('/users.json', {
      headers: {
        'x-filter-name': updatedFilters.nameStartsWith,
        'x-filter-age': updatedFilters.ageGreaterThan,
      },
    });

    const { data } = response;

    return data;
  }
}
```

The test we wrote:

```ts
import axios from 'axios';
import { Users } from './users';

jest.mock('axios');

test('should fetch users', async () => {
  (axios.get as jest.Mock).mockResolvedValue({ data: { age: 5 } });
  // Would also work: (axios.get as jest.Mock).mockReturnValue({ data: { age: 5 } });

  const data = await Users.findMany();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('/users.json', {
    headers: { 'x-filter-name': 't', 'x-filter-age': 0 },
  });
  expect(data.age).toBe(5);
});
```

The conclusion:

This is a perfect example of when to prefer using `jest.spyOn`.  
We see above tht we're mocking the entire `axios` module, when in fact all we want to do is mock the `get` method.

A better approach is:

```ts
import axios from 'axios';
import { Users } from './users';

// diff-remove-next-line
jest.mock('axios');

test('should fetch users', async () => {
  // diff-remove-next-line
  (axios.get as jest.Mock).mockResolvedValue({ data: { age: 5 } });
  // diff-add-next-line
  const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: { age: 5 } });

  const data = await Users.findMany();

  expect(axiosGetSpy).toHaveBeenCalled();
  expect(axiosGetSpy).toHaveBeenCalledWith('/users.json', {
    headers: { 'x-filter-name': 't', 'x-filter-age': 0 },
  });

  expect(data.age).toBe(5);
});
```

While the difference may seem mild, it is quite large:

1. We no longer need the type coercion.
2. We no longer mock the _entire_ module.
3. The `axios` instance is different (mocked v.s. real).
4. We no longer **affect non-related parts** (for example, `axios.post`).

<br/>

### Scenario 3: mock only 1 function/constant from a file.

The example code:

```ts
export const namedExportVariable = 'named export variable';
export function namedExportFunction() {
  return 'named export function';
};

export default () => 'export default function';
```

The test we wrote:

```ts
import { namedExportFunction, namedExportVariable } from './foo-bar-baz';

jest.mock('./foo-bar-baz', () => {
  const originalModule = jest.requireActual('./foo-bar-baz');

  return {
    ...originalModule,
    namedExportFunction: jest.fn(() => 'mocked named export function'),
  };
});

test('should do a partial mock', () => {
  // The mocked parts:
  const namedExportFunctionResult = namedExportFunction();
  expect(namedExportFunction).toHaveBeenCalled();
  expect(namedExportFunctionResult).toBe('mocked named export function');

  // The unmocked parts:
  expect(namedExportVariable).toBe('named export variable');
});
```

The conclusion:

Another great example of using `spyOn`.  
All this boilerplate of `jest.mock` could be spared, by just using `spyOn`:

```ts
import { namedExportFunction, namedExportVariable } from './foo-bar-baz';

test('should do a partial mock', () => {
  const namedExportFunctionSpy = jest
    .spyOn(require('./foo-bar-baz'), 'namedExportFunction')
    .mockReturnValue('mocked named export function');

  const namedExportFunctionResult = namedExportFunction();

  expect(namedExportFunctionSpy).toHaveBeenCalled();
  expect(namedExportFunctionResult).toBe('mocked named export function');
  expect(namedExportVariable).toBe('named export variable');
});
```

See how much cleaner this is? ✅

We didn't need to mock the entire module, and just mocked the parts we needed.  
Also, `spy` functions are similar to `jest.fn` functions in the sense that their implementation can be mocked, so it's not _just_ spying.

<br/>

### Scenario 4: Multiple return values using `mockImplementationOnce`

Scenario 4 talked about `mockImplementationOnce`, so there's nothing here to actually compare with `spyOn`.

```ts
const myMockFn = jest
  .fn()
  .mockImplementation(() => 3);
  .mockImplementationOnce(() => 10)
  .mockImplementationOnce(() => 42)
```

We will say though that `jest.spyOn` also supports `mockImplementationOnce`, since it is similar to `jest.fn`

<br/>

### Scenario 5: mock 1 method on 1 exported object from a file

The example code:

```ts
export class MyClass {
  private name: string = '';
  private age: number = 0;

  setName(name?: string): this {
    if (typeof name === 'string') this.name = name;

    return this;
  }

  setAge(age?: number) {
    if (typeof age === 'number') this.age = age;

    return this;
  }

  logCreated() {
    fetch('http://localhost:8000').then((response) => {
      console.log('data is:', response);
    });

    return this;
  }

  toJSON(): { name: string; age: number } {
    return { name: this.name, age: this.age };
  }
}

type InitProps = { name?: string; age?: number; };

export function init(props?: InitProps) {
  const { name, age } = props ?? {};

  const instance = new MyClass().setName(name).setAge(age).logCreated();

  return instance;
}
```

The test we wrote:

```ts
import { MyClass, init } from './MyClass';

jest.mock('./MyClass', () => {
  const actualModule = jest.requireActual('./MyClass');
  actualModule.MyClass.prototype.logCreated = jest.fn().mockReturnThis();
  return actualModule;
});

describe('init function', () => {
  it('should create an instance of MyClass and use real methods except logCreated', async () => {
    const instance = init({ name: 'Alice', age: 30 });

    expect(instance).toBeInstanceOf(MyClass);
    expect(instance.toJSON()).toEqual({ name: 'Alice', age: 30 });
    expect(MyClass.prototype.logCreated).toHaveBeenCalledTimes(1);
  });
});
```

The conclusion:

Another great example of when to prefer `spyOn`.

Look at the following test:

```ts
import { MyClass, init } from './MyClass';

describe('init function', () => {
  it('should create an instance of MyClass and use real methods except logCreated', async () => {
    const logCreatedSpy = jest.spyOn(MyClass.prototype, 'logCreated').mockReturnThis();

    const instance = init({ name: 'Alice', age: 30 });

    expect(instance).toBeInstanceOf(MyClass);
    expect(instance.toJSON()).toEqual({ name: 'Alice', age: 30 });
    expect(logCreatedSpy).toHaveBeenCalledTimes(1);
  });
});
```

We removed all the boilerplate of `jest.mock`, and only added the spy on what we wanted, which is the `logCreated` method.

<br/>

### Scenario 6: Just pure spying

This is a new scenario only possible with `spyOn`.

What if we just want to spy on a function? We don't want to affect the function's implementation. We simply want to run assertions on it, such as: `toHaveBeenCalled` or `toHaveBeenCalledWith`. For that purpose, `spyOn` is our **ONLY** option.

```ts title=makeFood.ts
export function makeFood(){
  return 'dinner'
}
```

```ts title=makeFood.test.ts
import { makeFood } from './makeFood';

test('makeFood', () => {
  const makeFoodModule = require('./makeFood');
  const makeFoodSpy = jest.spyOn(makeFoodModule, 'makeFood');

  const food = makeFood();

  expect(food).toBe('dinner');
  expect(makeFoodSpy).toHaveBeenCalled();
});
```

<br/>

### Summary

#### `jest.mock()`

- Automatically **mocks an entire module**.
- Used to replace all exports of a module with mock functions.
- If no implementation is provided, all the mocked functions return undefined by default.

#### `jest.spyOn()`

- **Spies on an existing method** of an object.
- A **required module** can be considered as an object.
- Allows you to track calls **while still calling the original implementation**, unless overridden.
- **Less code is required** in order to spy 1 function inside a module with multiple exports.

---
