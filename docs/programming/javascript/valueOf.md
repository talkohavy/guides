# valueOf

## Description

JavaScript calls the `valueOf` method to convert an object to a primitive value. You rarely need to invoke the `valueOf` method yourself; JavaScript automatically invokes it when encountering an object where a primitive value is expected.

The `valueOf()` method of Object instances converts the this value to an object. This method is meant to be overridden by derived objects for custom type conversion logic.

## When is it called?

The valueOf method is called:

- When using any of these comparisons operators: `==`, `<`, `>`, `=<`, `<=`.
- When using arithmetic operators: `+`, `-`, `*`, `/`, `^`, `%`.
- When using bitwise operators: `|`, `&`, `^`, `~`, `<<`, `>>`, `>>>`.
- When calling `Number` with/without `new`: `Number(a)`, `new Number(a)`.
- When any of: `Math.min`, `Math.max`, `Math.abs`, ... , etc.
- When using the unary plus sign: `+`.
- When you explicitly call it: `obj.valueOf();`

## Important to know

- The `Object.prototype.valueOf()` base implementation is deliberately useless: by returning an object, its return value will never be used by any primitive conversion algorithm.
- Many built-in objects override this method to return an appropriate primitive value.
- When you create a custom object, you can override `valueOf()` to call a custom method, so that your custom object can be converted to a primitive value.
- Generally, `valueOf()` is used to return a value that is most meaningful for the object — unlike `toString()`, it does not need to be a string.
- Alternatively, you can add a `[Symbol.toPrimitive]()` method, which allows even more control over the conversion process.
- `[Symbol.toPrimitive]` **will always be preferred** over `valueOf` or `toString` for any type conversion.

## Using unary plus (+) on objects

- Unary plus performs `number coercion` on its operand.
- If an object has `[Symbol.toPrimitive]()`, then it would be called (minus the exception of: `Date`).
- Otherwise, it means calling the object's `valueOf()`.
- If the object doesn't have a custom `valueOf()` method, the base implementation of `valueOf()` will be ignored and the return value of `toString()` to be used instead.

```js
+new Date(); // the current timestamp; same as new Date().getTime()
+{}; // NaN (toString() returns "[object Object]")
+[]; // 0 (toString() returns an empty string list)
+[1]; // 1 (toString() returns "1")
+[1, 2]; // NaN (toString() returns "1,2")
+new Set([1]); // NaN (toString() returns "[object Set]")
+{ valueOf: () => 42 }; // 42
```
