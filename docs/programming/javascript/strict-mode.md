# Strict Mode

## 1. What is Strict Mode?

Strict mode is a feature in JavaScript that helps you write cleaner and more secure code by enforcing stricter parsing and error handling rules. It prevents common pitfalls and throws errors for certain actions that would otherwise be ignored or fail silently.

## 2. How to Enable or Disable Strict Mode

If your JavaScript file is being treated as an ES6 module, strict mode is automatically enabled. This happens when:

- The file has the .mjs extension.
- The file is imported/exported as a module.
- Your `script` tag in HTML includes the type="module" attribute.

Also, nowadays, modern JavaScript runtime environments (e.g., Node.js & modern browsers) default to `strict mode`.

When all of the above aren't the case, you need to explicitly specify that want the environment to be strict by using the directive **"use strict"** at the top of your file.

## 3. The browser's Console

The browser's Console is a good example of a place where strict isn't enabled by default.  
When the environment is not strict, you can (for example) declare a variable without using `const`, `let` or `var`.

Try running this in your console:

```
x = 5;
```

and see that it works perfectly fine. However try running that exact same code in a nodejs environment, and you'll get this error:

```
Uncaught ReferenceError: x is not defined
```

To get your browser's console behave in strict mode, add a `"use strict"` directive at the beginning:  
(p.s. you might need to refresh your page)

```
"use strict";
x = 5;
```

Now you should get back the error from above.

## 4. Check If Strict Mode Is Enabled

You can confirm if strict mode is active by trying the following code snippet:

```js
/* eslint-disable */
function checkStrictMode() {
    const isStrictMode = (function () {
        return !this;
    })();

    return isStrictMode;
}

console.log(checkStrictMode()); // true means strict mode is active
```

This check is accurate because of how `this` behaves in "strict mode" versus "non-strict" mode in a standalone function.

In strict mode, if a function is called without an explicit context, `this` will be `undefined`.
In non-strict mode, if a function is called without an explicit context, `this` will be this `window` object.
