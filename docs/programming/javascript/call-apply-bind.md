# Call, Apply and Bind

In JavaScript, `apply`, `call`, and `bind` are methods available to all functions. They allow you to explicitly set the value of `this` when invoking a function. Here’s a breakdown of how they work:

## 1. `call`

- Invokes the function immediately.
- You pass the value for `this` as the first argument, followed by the function's arguments.

Syntax:

```js
functionName.call(thisArg, arg1, arg2, ...);
```

Example:

```js
function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); // Output: "Hello, Alice!"
```

## 2. `apply`

- Invokes the function immediately.
- Similar to `call`, but you pass the arguments as an array or array-like object (e.g., `arguments` or `[]`).

Syntax:

```js
functionName.apply(thisArg, [arg1, arg2, ...]);
```

Example:

```js
function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Bob' };

greet.apply(person, ['Hi', '?']); // Output: "Hi, Bob?"
```

## 3. `bind`

- Does not invoke the function immediately.
- Instead, it returns a new function with the `this` value permanently set to the specified object.
- You can call this new function later, optionally passing arguments.

Syntax:

```js
const boundFunction = functionName.bind(thisArg, arg1, arg2, ...);
```

Example:

```js
function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Charlie' };

const boundGreet = greet.bind(person, 'Hey');
boundGreet('!'); // Output: "Hey, Charlie!"
```

Comparison

| Method | Invokes Function? | Pass Arguments | Use Case                                                                  |
| ------ | ----------------- | -------------- | ------------------------------------------------------------------------- |
| call   | Yes               | Individually   | Immediate invocation with specific this.                                  |
| apply  | Yes               | As an array    | Immediate invocation with specific this, but arguments are in array form. |
| bind   | No                | Individually   | Creates a new function with specific this for later use.                  |

Common Use Cases

- Explicitly setting this for methods in objects.
- Borrowing methods from other objects.
- Using bind to ensure this in callbacks or event handlers refers to the intended context.
