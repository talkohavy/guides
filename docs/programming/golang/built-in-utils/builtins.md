# Built-in Functions

## 1. What are built-in functions?

Before we get into packages, there's a small set of functions that **don't belong to any package**. They're built into the language itself, so **you never import them**. You just call them.

```go
len(something) // <--- no `import`, no `pkg.` prefix
```

There are only a handful of them, and you'll use most of them every single day: `len`, `cap`, `append`, `make`, `delete`, `copy`, `min`, `max`, `clear` and `new`.

---

## 2. `len`: the length of something

`len` returns the length of a string, an array, a slice, a map, or a channel:

```go
len("hello")                    // <--- 5
len([]int{1, 2, 3})             // <--- 3
len(map[string]int{"a": 1})     // <--- 1
```

### - A. Gotcha: `len` of a string counts bytes, not characters

```go
len("hello") // <--- 5
len("héllo") // <--- 6 ❗
```

Go strings are stored as UTF-8 bytes, and `é` takes 2 bytes. To count the actual characters, use `utf8.RuneCountInString("héllo")` from the `unicode/utf8` package, which returns `5`. (Go calls a single character a **rune**. See [Data Types](../data-types.md#4-runes-characters) for bytes vs. runes.)

### - B. Is `len` fast?

Yes, **`len` is O(1) for every type**. Go never counts the items. Strings, slices, maps and channels all keep their length stored alongside the data, so `len` just reads it. For arrays, the length is part of the type (`[5]int`), so it's known at compile time.

So calling `len(s)` in a loop condition (`for i := 0; i < len(s); i++`) is perfectly fine.

The one that's **not** O(1) is `utf8.RuneCountInString`: it has to walk through the whole string to count the characters.

---

## 3. `append`: add items to a slice

### - A. Basic usage

```go
nums := []int{1, 2}

nums = append(nums, 3)       // <--- add one item: [1 2 3]
nums = append(nums, 4, 5)    // <--- add multiple items: [1 2 3 4 5]

more := []int{6, 7}
nums = append(nums, more...) // <--- add a whole slice: [1 2 3 4 5 6 7]
```

Notice the `...` in the last line. It "spreads" the slice into separate arguments, just like the spread operator in JavaScript (but written after the value, instead of before it).

### - B. How a slice works under the hood

To understand `append`, you need to know what a slice really is. A slice variable is just a small **header** with 3 fields:

- A **pointer** to an underlying array, where the items actually live.
- A **length**: how many items the slice has.
- A **capacity**: how many items fit in the underlying array.

When you call `append`, one of two things happens:

1. **There's room** (length < capacity): the item is written into the existing array. No copying. **O(1)**.
2. **The array is full**: Go allocates a new, bigger array, copies all the items over, and then adds the new one. **O(n)**.

### - C. You MUST assign the result

Either way, the slice header changes: the length always grows, and in case 2, the pointer changes too. Since Go passes the header to `append` **by value** (as a copy), `append` can't update your variable. It returns the updated header instead, and you have to store it. If you forget, Go refuses to compile:

```go
append(nums, 3) // <--- Error! ❌
```

> append(nums, 3) (value of type []int) is not used

That's why you'll always see the pattern `nums = append(nums, ...)`.

**But wait, doesn't returning a new slice mean copying everything?** No. `append` returns a new **header**, not a new array. The header is always just 3 small fields, so copying it is O(1), no matter how many items the slice has. The array is only copied in case 2, when it's full.

If you forget to store the result, the item is still written into the array, but your variable still has the old length, so it can't see it:

```go
n := make([]int, 0, 4)
_ = append(n, 1)
fmt.Println(n, len(n)) // <--- [] 0 (the 1 is in the array, but `n` doesn't know about it)
```

### - D. What if I assign the result to a different variable?

It's allowed, and what happens depends on whether there was room:

```go
// There's room: ONE array, TWO headers
a := make([]int, 2, 4)
b := append(a, 99)
fmt.Println(a, b)   // <--- [0 0] [0 0 99]
fmt.Println(a[:3])  // <--- [0 0 99] (the 99 is in `a`'s array too, just past `a`'s length)

// The array is full: TWO separate arrays
x := []int{1, 2}    // <--- length 2, capacity 2
y := append(x, 3)
y[0] = 100
fmt.Println(x, y)   // <--- [1 2] [100 2 3] (independent)
```

Notice that in the second case, the copy happened because the array was **full**. It would have happened with `x = append(x, 3)` too. The variable you assign to never affects the cost. It only affects whether the old array is still in use (with `x = ...`, nothing points to the old array anymore, and the garbage collector frees it).

**So why the convention?** Because assigning to a different variable is how you end up with two slices that secretly share one array (see the gotcha below).

### - E. Is `append` fast?

Yes. **`append` is O(1) on average** (the fancy term is "amortized O(1)"), just like `push` on a JavaScript array.

The slow case (allocating and copying) is rare, because Go roughly **doubles** the capacity every time it grows. Here are the capacities you get when appending 2000 items, one at a time, to an empty slice:

```text
1 2 4 8 16 32 64 128 256 512 848 1280 ...
```

That's only 14 reallocations for 2000 appends. (For large slices, the growth slows down to about 1.25x, to avoid wasting memory.)

If you know the final size in advance, you can skip the reallocations completely, by creating the slice with enough capacity using `make` (see the next section).

### - F. Gotcha: slices can share the same array

Because `append` writes into the existing array when there's room, two slices that share an array can overwrite each other:

```go
base := make([]int, 3, 10) // <--- length 3, capacity 10

b := append(base, 1)
c := append(base, 2)

fmt.Println(b[3], c[3]) // <--- 2 2 ❗
```

Both `append` calls had room, so both wrote to the **same spot** in `base`'s array. The second one overwrote the first.

**The rule:** always append to the slice you assign the result to (`s = append(s, ...)`). If you need an independent copy, use `slices.Clone` (see [Slices & Maps](./slices-and-maps.md)).

---

## 4. `make`: create a slice, map, or channel

`make` creates and initializes slices, maps and channels.

```go
scores := make(map[string]int) // <--- an empty map, ready to use
ids := make([]int, 3)          // <--- a slice with 3 zero values: [0 0 0]
buf := make([]int, 0, 100)     // <--- an empty slice, with room for 100 items
ch := make(chan string)        // <--- a channel (see Concurrency)
```

For slices, `make` takes up to two numbers:

- **Length**: how many items the slice has right now.
- **Capacity** (optional): how many items it can hold before Go needs to allocate a bigger chunk of memory.

**When to use it:** if you know in advance roughly how many items you're going to append, use `make([]T, 0, n)`. That way Go allocates the memory once, instead of growing the slice again and again as you append.

For maps, we already covered when you need `make` in [Data Types](../data-types.md).

---

## 5. `cap`: the capacity of a slice

`cap` tells you how many items a slice can hold before it needs to grow:

```go
s := make([]int, 0, 5)
fmt.Println(len(s), cap(s)) // <--- 0 5
```

You'll rarely need `cap` day-to-day. It's mostly useful for understanding (and debugging) how slices grow.

---

## 6. `delete`: remove a key from a map

```go
ages := map[string]int{"Tal": 30, "Dana": 25}

delete(ages, "Tal")
fmt.Println(ages) // <--- map[Dana:25]
```

Deleting a key that doesn't exist is **not** an error. It just does nothing.

---

## 7. `copy`: copy items between slices

### - A. Why do we need it?

Assigning a slice to a new variable **does not copy it**. Both variables point to the same underlying data:

```go
a := []int{1, 2, 3}
b := a
b[0] = 99

fmt.Println(a) // <--- [99 2 3] ❗ `a` changed too!
```

### - B. Using `copy`

`copy(dst, src)` copies items from `src` into `dst`, and returns how many items it copied. It copies **as many items as fit** in `dst`:

```go
src := []int{1, 2, 3}
dst := make([]int, 2)

n := copy(dst, src)
fmt.Println(n, dst) // <--- 2 [1 2]
```

**Tip:** for copying an entire slice, `slices.Clone(src)` is simpler. See [Slices & Maps](./slices-and-maps.md).

---

## 8. `min` & `max`

Return the smallest / largest of the values you pass in:

```go
min(3, 1, 2)   // <--- 1
max(3, 1, 2)   // <--- 3
min("b", "a")  // <--- "a" (works on strings too)
```

These work on **separate values**, not on a slice. For the min/max of a slice, use `slices.Min` / `slices.Max` (see [Slices & Maps](./slices-and-maps.md)).

---

## 9. `clear`: empty a map or a slice

```go
ages := map[string]int{"Tal": 30, "Dana": 25}
clear(ages)
fmt.Println(ages, len(ages)) // <--- map[] 0

nums := []int{1, 2, 3}
clear(nums)
fmt.Println(nums, len(nums)) // <--- [0 0 0] 3
```

Notice the difference: on a **map**, `clear` removes all the keys. On a **slice**, it keeps the length, and just sets every item to its zero value.

---

## 10. `new`: allocate a zero value and get a pointer

`new(T)` creates a zero value of type `T`, and returns a [pointer](../pointers.md) to it:

```go
p := new(int)
fmt.Println(*p) // <--- 0

*p = 5
fmt.Println(*p) // <--- 5
```

In practice, you'll rarely see `new`. For structs, people write `&User{}` instead, which does the same thing, and also lets you set fields.

---

## 11. Cheat sheet

| Function                | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `len(x)`                | Length of a string (in bytes), array, slice, map, chan |
| `cap(s)`                | Capacity of a slice                                    |
| `append(s, v...)`       | Adds items, and returns the updated slice              |
| `make(T, ...)`          | Creates a slice, map, or channel                       |
| `delete(m, k)`          | Removes a key from a map                               |
| `copy(dst, src)`        | Copies items from one slice to another                 |
| `min(...)` / `max(...)` | Smallest / largest of the given values                 |
| `clear(x)`              | Empties a map, or zeroes out a slice                   |
| `new(T)`                | Pointer to a new zero value of type `T`                |
