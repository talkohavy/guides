# Data Types

## 1. Different data-types

In Go, the different types are:

- string
- int
- bool
- array
- decimal

---

## 2. Numbers

In Go, there are so many different number types:

```text
- int      -
- int8     - -128 to 127
- int16    - -32768 to 32767
- int32    - -2147483648 to 2147483647
- int64    - -9223372036854775808 to 9223372036854775807
- uint     -
- uint8    - 0 to 155
- uint16   - 0 to 65535
- uint32   - 0 to 4294967295
- uint64   - 0 to 18446744073709551615
```

**When defining a variable using `var`, and choosing to omit the type, the default inferred type is `int`**.

Use the _unsigned_ types when you KNOW the value is going to be a Positive number (non-negative to be precise). This is helpful because, in a way, you get a mini-validation for your value at compile time.

Then we also have:

- float32
- float64
- complex64
- complex128

---

## 3. Strings

The type `string`:

```go
var name string = "Tal";
```

---

## 4. Boolean

The type `bool`:

```go
var isLoading bool = true;
var isEqual bool = 4 > 1;
```

---

## 5. Casting

For the most part, you should avoid casting. But if you really must, some casting work between two different types.

This is very useful however when performing **arithmetic operations**.

---

## 6. Arrays

### - A. Define an array

**Defining an array in Go requires 3 parts**:

```go
var arr = [10]int{};
```

1. the brackets `[]` with the size (**size is REQUIRED!!!**)
2. the type
3. the initial values (values are optional)

- Within the square brackets `[]`, you can set an **initial size**. By passing nothing, you essentially say the initial size is 0.
- The type can be `any`, `bool`, `int`, `string`, etc.
- Within the curly braces `{}`, you can set **initial values**. By passing nothing, you essentially create an empty array.

Good to know about arrays:

- Arrays in Go **are fixed-size**! There's no appending to an array! Trying to do so would results in an error (for that we use `Slices`).
- **You may NOT leave the brackets as empty!** (i.e. `[]`). Technically you can, but it would then no longer be an array, it would be a slice.
- When specifying size (i.e. `[3]`) but no values, the values within those cells would be the default value of that type.
- You may specify a size that is larger than the number of values passed to `{}`. The rest of the cells would just be default values.
- You may NOT provide more values than the number specified in the size. Th would result in a compile error.
- **There is no point in defining this array!** ---> `var arr = [0]int{};` - since it's size is always 0! It has no, and will never have any, cells.

Good ✅: Here is an array of size 3, type int, with 2 initial values

```go
var arr = [3]int{1,2};
```

<br/>

Good ✅: Here is an array of size 2 (inferred from the amount of values), type int, with 2 initial values

```go
var arr = int{1,2};
```

<br/>

Good ✅: Here is a mixed type array

```go
var arr = []any{1,2,"hello"};
```

<br/>

Bad ❌: trying to provide a 4th values, results in a compile error

```go
var arr = [3]int{1,2,3,4}; // <--- Error under 4: index 3 is out of bounds (>= 3)compilerOversizeArrayLit
```

### - B. Getting the length of an array

There is a special utility function called `len`.

```go
var arr = [3]int{1,2,3};
fmt.Println("The length of arr is:", len(arr));
```

### - C. Accessing cells

With square brackets:

```go
var arr = [3]int{1,2,3};
fmt.Println("arr at index 0 is:", arr[0]); // <--- 1
fmt.Println("arr at index 1 is:", arr[1]); // <--- 2
fmt.Printf("arr type is:%T\n", arr); // <--- [3]int
```

---

## 7. Slices

`Slices` are basically an abstraction of an array, so it uses the `Array` type under the hood, but it **has a dynamic size**.

### - A. Define a Slice

Like an array, but simply omit the size and leave `[]` empty:

```go
var arr = []int{1,2,3}; // <--- the lack of size inside [] means it's a Slice

fmt.Println("arr at index 0 is:", arr[0]); // <--- 1
fmt.Println("arr at index 1 is:", arr[1]); // <--- 2
fmt.Printf("arr type is:%T\n", arr); // <--- []int
```

Good to know about slices:

- Slices can be appended to (that's the whole point).
- The initial size is set by the amount of values you provide to `{}` at the beginning.

## - B. Appending to a Slice

Using the global util function called `append`, we can append items into a slice.

`append` accepts the _slice_ as the 1st argument, and the _item_ to append as the 2nd argument.

```go
var arr = []int{1,2,3};

append(arr, 4);
```

---

## 8. Maps

A **map** in Go is a built-in data structure (hash table) that **stores data as key-value pairs**.

### - A. Declaration

The keyword `map`, then the key type, then the value type:

For example:

```go
myMap := map[string]int{}
```

Rules regarding Maps:

- **Comparable Keys**: Keys must be unique and comparable with `==` (such as strings, integers, or floats; slices and maps cannot be keys).
- **Reference Type**: Maps point to an underlying hash table. Assigning a map to a new variable shares the same underlying data.
- **Unordered**: Iterating over a map does not guarantee a fixed or sorted order.

**One thing to be aware of**:

- **Zero Value**: A newly declared uninitialized map is `nil`. Reading from a `nil` map returns zero values safely, but writing to it causes a runtime panic.

### - B. Map with initial state

You can declare a map with an initial state:

```go
package main

import "fmt";

func sayHi(){
    fmt.Println("Hello!");

    myMap := map[string]int{
        "apple": 1,
        "banana": 2,
        "cherry": 3,
    };

    fmt.Println(myMap["apple"]);
    fmt.Println(myMap["banana"]);
    fmt.Println(myMap["cherry"]);
}
```

:::info
**Commas are mandatory after values!**

Without one, you'll get a compile error:

```go
myMap := map[string]int{
    "apple": 1,
    "banana": 2,
    "cherry": 3 // <--- missing ',' before newline in composite literal syntax
};
```

:::

### - C. To make? Or not to make?

There are 2 ways to define a map:

One way is the one we saw:

```go
myMap := map[string]int{}
```

Another is is by using `make`:

```go
myMap := make(map[string]int)
```

For **_empty maps_**, there is **no functional difference between them!**

Things to know about `make`:

- `make` **accepts a second optional argument** to pre-allocate space. Use `make(map[string]int, 100)` when you know roughly how many items you will add to improve performance and reduce memory reallocations.
- You **cannot pass initial values** into `make()`.
- When creating an **empty map without a known size**, choosing between map literal and `make` comes down to **personal preference**.

### - D. Pitfall of `make` with `var`

Declaring a map literal with `var` is also possible:

```go
// Works! ✅
var ages map[string]int = map[string]int{}

// Also works! ✅
var ages map[string]int = make(map[string]int)
```

The problem, or... not so the problem, but the possible runtime error, starts with the fact that **var let's you declare a variable without setting a value**.

With var, you can declare a map like so:

```go
var ages map[string]int
```

With that, you may encounter a runtime error when trying to add a key to the map, before setting its value:

Bad ❌:

```go
var ages map[string]int

ages["tal"] = 30; // <--- panic: assignment to entry in nil map. exit status 2
```

It's up to you to make sure you set the initial value somewhere:

Good ✅:

```go
var ages map[string]int

ages = map[string]int{
    "daniel": 27,
}

ages["tal"] = 30;
```

---

## 9. Struct

### - A. Why we need a `struct`?

The problem with Maps is that **maps forces your values to be of the same type**.

But **what if I want** to store **mixed types**?

For that - we have `struct`.

### - B. What is a `struct`?

A `struct` in Go is **a user-defined composite data type** that **groups** together zero or more named **fields of different data types into a single unit**. Because Go does not have traditional classes, structs are the primary building blocks for organizing complex data and modeling real-world entities.

Struct can be compared to classes in Java.

### - B. How to define a `struct`

```go
type UserData struct {
    firstName string
    lastName string
    email string
    age uint
}
```

### - C. Using the constructed `struct`

Once a struct is defined, you use it like so:

```go
const firstName = "Tal";

var user =  UserData {
    // Note! you cannot write: `firstName,` as a short-hand like in JavaScript.
    firstName: firstName,
    lastName: "Ko",
    email: "tal@gmail.com",
    age: 30,
}
```

### - D. Accessing properties on a `struct`

Access by using a dot notation:

```go
fmt.Print(user.age);
```
