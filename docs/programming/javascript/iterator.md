# Iterator

An iterator in JavaScript is an object that allows you to traverse through a collection (like an array, string, or custom data structure) one element at a time. It follows a specific protocol called the iterator protocol.

## 1. Iterator Protocol

An object is an iterator if it implements a `next()` method, which returns an object with two properties:

- value: The next value in the iteration sequence.
- done: A boolean that indicates whether the iteration is complete (true if there are no more values to iterate over, false otherwise).

## 2. How Iterators Work

Here's a basic example of an iterator:

```js
function createIterator(array) {
  let index = 0;

  return {
    next() {
      if (index < array.length) {
        return { value: array[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    },
  };
}

const iterator = createIterator(['a', 'b', 'c']);

console.log(iterator.next()); // { value: 'a', done: false }
console.log(iterator.next()); // { value: 'b', done: false }
console.log(iterator.next()); // { value: 'c', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

## 3. Built-In Iterators

JavaScript provides built-in iterators for iterable objects like:

- Arrays
- Strings
- Maps
- Sets

You can use the `Symbol.iterator` to access these built-in iterators. For example:

```js
const array = [1, 2, 3];
const iterator = array[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

## 4. Iterating with for...of

Iterators are typically used implicitly in JavaScript with the for...of loop:

```js
for (const value of ['x', 'y', 'z']) {
  console.log(value); // output: x, y, z
}
```

## 5. Custom Iterable Objects

You can make your own objects iterable by implementing the iterator protocol using the Symbol.iterator property:

```js
const iterableObject = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  },
};

for (const value of iterableObject) {
  console.log(value); // output: hello, world
}
```
