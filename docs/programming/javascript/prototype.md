# Prototype

## tldr;

- A `prototype` is an object's internal "bag" of properties.
- Each object has an **internal link** to another object called its `prototype`.
- That `prototype` object has a `prototype` of its own, and so on until an object is reached with `null` as its `prototype`, marking the final link in the `prototype` chain.
- When trying to access a property of an object, the property will not only be sought on the object but on the `prototype` of the object, the `prototype` of the `prototype`, and so on until either a property with a matching name is found or the end of the `prototype` chain is reached.
- While called `prototype`, the **ACTUAL** key on the object is named `__proto__`. So `prototype` IS the bag of properties, and `__proto__` is the NAME of the key on the object that POINTS to the `prototype`.
- Wanting to create multiple objects leads us to creating a **constructor** function.
- Every function has a `key` called `prototype` (`funcName.prototype`), which points to an object.
- When using a function as a **constructor**, the returned object gets as `prototype` (stored under `__proto__`) the object that is stored under `funcName.prototype`.
- Do not confuse `funcName.prototype` with `funcName.__proto__`. The latter is the constructor function's own prototype, which is `Function.prototype`.
- You can mutate a **constructor** function's prototype _AFTER_ creating many instances, and those instances would instantly get that mutated object as `prototype`.
- Do not reassign an object to a **constructor** function's _entire_ prototype, since that would only affect future instances being created. Previously created instances would have their ties to the most updated prototype severed.

---

## 1. Inheritance and the prototype chain

- JavaScript implements inheritance by using objects.
- Each object has an internal link to another object called its `prototype`.
- That `prototype` object has a `prototype` of its own, and so on until an object is reached with null as its `prototype`.
- By definition, `null` has no `prototype` and acts as the final link in this `prototype` chain.

## 2. Own properties & Inherited properties

- JavaScript objects are dynamic "bags" of properties.
- An object's direct properties are often referred to as **own properties**.
- When trying to access a property of an object, the property will not only be sought on the object but on the `prototype` of the object, the `prototype` of the `prototype`, and so on until either a property with a matching name is found or the end of the `prototype` chain is reached.

## 3. Getting/Viewing an object's prototype

- When viewing an object in debug mode, or when printing an object in the browser's console, you can see its prototype under: [[Prototype]]
- Using code, this internal prototype can be accessed and modified using `Object.getPrototypeOf()` and `Object.setPrototypeOf()` functions respectively.
- Using `Object.getPrototypeOf()` is equivalent to `obj.__proto__` which is non-standard but de-facto implemented by many JavaScript engines.

---

## 4. Constructors

Constructors are functions called with the `new` keyword.

Although we can, We want to avoid manually binding the **\_\_proto\_\_** for every object creation, since it is very inconvenient. We should instead use a constructor function, which automatically sets the [[Prototype]] for every object manufactured. We call those **Constructor functions**, and they are functions called with the `new` keyword.

```js
// A constructor function
function Box(value) {
  this.value = value;
}

// Properties all boxes created from the Box() constructor
// will have
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
```

We phrase it like that:

> _calling `new Box(1)` returns an instance created from the **Box** `constructor` function._

---

## 5. Do not re-assign prototype

Because `Box.prototype` references the same object as the [[Prototype]] of all instances, we can change the behavior of all instances by mutating `Box.prototype`.

```js
function Box(value) {
  this.value = value;
}
Box.prototype.getValue = function () {
  return this.value;
};
const box = new Box(1);

// Mutate Box.prototype after an instance has already been created
Box.prototype.getValue = function () {
  return this.value + 1;
};
box.getValue(); // 2
```

Re-assigning `Constructor.prototype` (`Constructor.prototype = ...`) is a bad idea for two reasons:

- The `[[Prototype]]` of instances created before the reassignment is now referencing a different object from the `[[Prototype]]` of instances created after the reassignment — mutating one's `[[Prototype]]` no longer mutates the other.
- Unless you manually re-set the `constructor` property, the constructor function can no longer be traced from `instance.constructor`, which may break user expectation. Some built-in operations will read the `constructor` property as well, and if it is not set, they may not work as expected.

`Constructor.prototype` is only useful when constructing instances. It has nothing to do with `Constructor.[[Prototype]]`, which is the constructor function's own prototype, which is `Function.prototype` — that is, `Object.getPrototypeOf(Constructor) === Function.prototype`.

---

## 6. Implicit constructors of literals

Some literal syntaxes in JavaScript create instances that implicitly set the [[Prototype]]. For example:

```js
Object.getPrototypeOf('hello') === String.prototype; // true

Object.getPrototypeOf(14) === Number.prototype; // true

Object.getPrototypeOf(true) === Boolean.prototype'; // true

Object.getPrototypeOf({ a: 1 }) === Object.prototype; // true

Object.getPrototypeOf(new Error) === Error.prototype; // true

const array = [1, 2, 3];
Object.getPrototypeOf(array) === Array.prototype; // true

const regexp = /abc/;
Object.getPrototypeOf(regexp) === RegExp.prototype; // true
```

We can "de-sugar" them into their constructor form.

```js
const array = new Array(1, 2, 3);
const regexp = new RegExp("abc");
```

---

## 7. Default `prototype` instances

It may be interesting to note that due to historical reasons, some built-in constructors' `prototype` property are instances themselves.  
For example:

- `Number.prototype` is a number 0
- `String.prototype` is an empty string ''
- `Array.prototype` is an empty array
- `RegExp.prototype` is /(?:)/

```js
Number.prototype + 1; // 1
Array.prototype.map((x) => x + 1); // []
String.prototype + "a"; // "a"
RegExp.prototype.source; // "(?:)"
Function.prototype(); // Function.prototype is a no-op function by itself
```

---

## 8. `prototype`'s version of `extends`

We can set the `[[Prototype]]` of `Constructor.prototype` via the `Object.setPrototypeOf()` function:

```js
function Base() {}
function Derived() {}
// Set the `[[Prototype]]` of `Derived.prototype`
// to `Base.prototype`
Object.setPrototypeOf(Derived.prototype, Base.prototype);

const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

In class terms, this is equivalent to using the `extends` syntax:

```js
class Base {}
class Derived extends Base {}

const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

---

## 9. `prototype` of arrow functions

All functions have a default `prototype`, with one exception: an arrow function doesn't have a default prototype property:

```js
function doSomething() {}
console.log(doSomething.prototype); // {}

const doSomethingFromArrowFunction = () => {};
console.log(doSomethingFromArrowFunction.prototype); // undefined
```

---

## 1. Object.create

The `Object.create()` is a static method which creates a new empty object.

:::warning
You may also see some legacy code using Object.create() to build the inheritance chain. However, because this reassigns the prototype property and removes the constructor property, it can be more error-prone, while performance gains may not be apparent if the constructors haven't created any instances yet.

```js
function Base() {}
function Derived() {}
// Re-assigns `Derived.prototype` to a new object
// with `Base.prototype` as its `[[Prototype]]`
// DON'T DO THIS — use Object.setPrototypeOf to mutate it instead
Derived.prototype = Object.create(Base.prototype);
```

:::

Its first parameter is an optional `proto`. By passing in `proto`, .... an object as the prototype of the newly created object.

```js
const map = Object.create(Map.prototype);
map.set('key1', 'value1');
map.set('key2', 'value2');
console.log(map instanceof Map); // true
console.log(map.get('key1'));    // "value1"
```
