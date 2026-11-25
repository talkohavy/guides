# Data Types

## 1. Different data-types

In Go, the different types are:

- string
- rune (a single character)
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
- uint8    - 0 to 255
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

## 4. Runes (characters)

### - A. `"a"` vs `'a'`

In JavaScript, `"a"` and `'a'` are the same thing. **In Go, they're two different types**:

| Quotes       | Type     | Example                                  |
| ------------ | -------- | ---------------------------------------- |
| `"double"`   | `string` | `"a"`, `"hello"`                         |
| `'single'`   | `rune`   | `'a'` (exactly one character)            |
| `` `back` `` | `string` | A raw string: no escapes, can span lines |

So this doesn't compile:

```go
vowels := map[rune]bool{"a": true} // <--- Error! ❌
```

> cannot use "a" (untyped string constant) as rune value in map literal

The map's keys are runes, but `"a"` is a string. Use single quotes:

```go
vowels := map[rune]bool{'a': true, 'e': true} // <--- ✅
```

And since a rune is a single character, single quotes can't hold more than one:

```go
'ab' // <--- Error! ❌ more than one character in rune literal
```

### - B. What is a `rune`?

A `rune` is **a single character**. Under the hood, it's just a number: the character's Unicode code point. In fact, `rune` is simply another name for `int32`:

```go
r := 'a'
fmt.Printf("%T\n", r) // <--- int32
fmt.Println(r)        // <--- 97 ❗ (the number, not the letter)
```

To print it as a character, use `%c`, or convert it to a string:

```go
fmt.Printf("%c\n", r) // <--- a
string(r)             // <--- "a"
```

Since runes are numbers, you can do math with them:

```go
'a' + 1         // <--- 98
string('a' + 1) // <--- "b"
```

### - C. What is a `byte`?

A `byte` is another name for `uint8`: a number from 0 to 255. **A Go string is stored as a sequence of bytes** (in UTF-8 encoding).

For plain English letters, one character is one byte. But there are other characters that take more than one byte. For example:

```go
[]byte("hé") // <--- [104 195 169] (the "é" takes 2 bytes)
```

### - D. Bytes vs. runes in a string

This is where it all comes together. Some operations on a string work with **bytes**, and some work with **runes**:

```go
s := "héllo"

len(s)          // <--- 6 (bytes!)
s[1]            // <--- 195 (a byte, and only half of the "é")

len([]rune(s))  // <--- 5 (characters)
[]rune(s)[1]    // <--- 'é' (a rune)

for i, ch := range s {
    // `ch` is a rune: h, é, l, l, o
}
```

**The rule of thumb:**

- `len(s)` and `s[i]` work with **bytes**.
- `range s` and `[]rune(s)` work with **runes** (characters).

If your text is plain English (ASCII), bytes and characters are the same, and you won't notice the difference. As soon as there's an accent, an emoji, or Hebrew, use runes.

**Note:** comparing a byte to a character literal works fine, because Go converts the `'h'` to a byte for you:

```go
s[0] == 'h' // <--- true
```

---

## 5. Boolean

The type `bool`:

```go
var isLoading bool = true;
var isEqual bool = 4 > 1;
```

---

## 6. Casting

For the most part, you should avoid casting. But if you really must, some casting work between two different types.

This is very useful however when performing **arithmetic operations**.

---

## 7. Arrays

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

## 8. Slices

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

### - B. Appending to a Slice

Using the global util function called `append`, we can append items into a slice.

`append` accepts the _slice_ as the 1st argument, and the _item_ to append as the 2nd argument.

```go
var arr = []int{1,2,3};

append(arr, 4);
```

### - C. Slicing a Slice: `s[low:high]`

You can take a part of a slice with `s[low:high]`. `low` included, `high` excludes . Either side can be omitted:

```go
nums := []int{10, 20, 30, 40, 50}

nums[1:3] // <--- [20 30]
nums[1:]  // <--- [20 30 40 50] (everything except the first)
nums[:2]  // <--- [10 20]
nums[:]   // <--- [10 20 30 40 50]
```

**Slicing does NOT copy the items!** It's **O(1)**, no matter how big the slice is.

Remember that a slice is just a small [header](./built-in-utils/builtins.md#--b-how-a-slice-works-under-the-hood) with 3 fields (a pointer, a length, and a capacity). `nums[1:]` only creates a new header, whose pointer points at the 2nd item of the **same** underlying array:

```text
nums      → ptr ─┐  len 5, cap 5
                 ▼
array:         [10, 20, 30, 40, 50]
                     ▲
nums[1:]  → ptr ─────┘  len 4, cap 4
```

This means that skipping the first item in a loop is free. There's no reason to fall back to an index loop just to avoid `[1:]`:

```go
oldest := people[0]
for _, p := range people[1:] { // <--- no copying, just a new header
  if p.Age > oldest.Age {
    oldest = p
  }
}
```

**The catch:** since both slices share one array, changing an item through one changes it in the other too:

```go
sub := nums[1:3]
sub[0] = 99
fmt.Println(nums) // <--- [10 99 30 40 50] ❗ `nums` changed too!
```

If you need an independent copy, use `slices.Clone(nums[1:3])`.

---

## 9. Maps

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

### - E. Checking if a key exists: the "comma ok" idiom

Reading a **missing key** doesn't panic or return an error. It **silently returns the zero value** of the value type:

```go
ages := map[string]int{"tal": 30}

fmt.Println(ages["nobody"]) // 0
```

So how do you tell "the key is missing" apart from "the key exists and its value is `0`"?

Ask for a **second return value**: a `bool` reporting whether the key exists:

```go
map1 := map[string]string{
    "key1": "value1",
}

val1, ok1 := map1["key1"] // "value1", true
val4, ok4 := map1["key4"] // "",       false
```

The idiomatic way is to combine it with an `if` statement's init clause, so `val` and `ok` are scoped to the `if` block:

```go
if val, ok := map1["key1"]; ok {
    fmt.Println("found:", val)
} else {
    fmt.Println("not found")
}
```

If you only care whether the key exists, discard the value with `_`:

```go
if _, ok := map1["key1"]; ok {
    // key exists
}
```

Things to know:

- **The second value is optional.** `val := m[key]` and `val, ok := m[key]` are both valid. Go picks the form based on how many variables you assign to.
- **`ok` is just a convention.** You can name it anything, but everyone uses `ok`.
- **Works on `nil` maps too.** You get the zero value and `false`, with no panic.
- **It's not unique to maps.** The same "comma ok" form shows up in type assertions (`v, ok := x.(string)`) and channel receives (`v, ok := <-ch`).

---

## 10. Struct

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
