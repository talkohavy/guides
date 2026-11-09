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
