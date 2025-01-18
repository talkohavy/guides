# Getters & Setters

## 1. Description

A **getter** is a function associated with a property that gets the value of a specific property. A **setter** is a function associated with a property that sets the value of a specific property. Together, they can indirectly represent the value of a property.

Within object initializers, getters and setters are defined like regular methods, but prefixed with the keywords `get` or `set`.

The getter method must not expect a parameter, while the setter method expects exactly one parameter (the new value to set). For instance:

```js
const myObj = {
  a: 7,
  get b() {
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2;
  },
};

console.log(myObj.a); // 7
console.log(myObj.b); // 8, returned from the get b() method
myObj.c = 50; // Calls the set c(x) method
console.log(myObj.a); // 25
```

The myObj object's properties are:

- `myObj.a` — a number
- `myObj.b` — a getter that returns `myObj.a` plus 1
- `myObj.c` — a setter that sets the value of `myObj.a` to half of the value `myObj.c` is being set to

Getters and setters can also be added to an object at any time after creation using the `Object.defineProperties()` method. This method's first parameter is the object on which you want to define the getter or setter. The second parameter is an object whose property names are the getter or setter names, and whose property values are objects for defining the getter or setter functions. Here's an example that defines the same getter and setter used in the previous example:

```js
const myObj = { a: 0 };

Object.defineProperties(myObj, {
  b: {
    get() {
      return this.a + 1;
    },
  },
  c: {
    set(x) {
      this.a = x / 2;
    },
  },
});

myObj.c = 10; // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(myObj.b); // Runs the getter, which yields a + 1 or 6
```

Which of the two forms to choose depends on your programming style and task at hand. If you can change the definition of the original object, you will probably define getters and setters through the original initializer. This form is more compact and natural. However, if you need to add getters and setters later — maybe because you did not write the particular object — then the second form is the only possible form. The second form better represents the dynamic nature of JavaScript, but it can make the code hard to read and understand.

---

## 2. Benefits

### - A. Create readonly immutable property

A property with only a getter (i.e. no setter), creates a non-overridable property.

```js
class User {
  constructor(name) {
    this._name = name; // Private-like property
  }

  get name() {
    console.log('Getting name...');
    return this._name;
  }
}
```

You can now call `user.name`, and get back it's value, and not be worried about someone doing `user.name = 1234` since it won't do anything.

An example:

```js
const user = new User('Alice');
console.log(user.name); // Logs "Alice"
user.name = 'John';
console.log(user.name); // Still logs: "Alice"
```

### - B. Run Validations

When setting up a property value, you can make it run some custom validation.

```js
class User {
  constructor(name) {
    this._name = name; // Private-like property
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    if (newName.length < 3) {
      throw new Error('Name must be at least 3 characters long.');
    }

    this._name = newName;
  }
}

const user = new User('Alice');
user.name = 'Jo';       // throws and error: "Name must be at least 3 characters long."
```

### - C. Derived/Computed Properties

Getters allow you to return computed values dynamically instead of storing them as properties.

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(5, 10);
console.log(rect.area); // 50 (computed dynamically)
```

---

## 3. When to avoid

- **Performance-critical code**: If frequent access to a property involves a computationally expensive getter, this can degrade performance.

- **Simple properties**: If you don't need any validation, transformation, or encapsulation, direct access is simpler and clearer.
