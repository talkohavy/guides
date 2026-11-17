# slices & maps

## 1. What are `slices` and `maps`?

Two small packages with ready-made helpers for the two collection types we met in [Data Types](../data-types.md):

```go
import (
    "maps"
    "slices"
)
```

If you're coming from JavaScript, `slices` is where you'll find the things you're used to calling on arrays: `includes`, `indexOf`, `sort`, `reverse`, `find`...

They work on slices and maps of **any** type (`[]int`, `[]string`, `[]User`, `map[string]int`, ...), because they're written with generics.

**Note:** these packages are fairly new (Go 1.21). In older code and tutorials, you'll see the `sort` package (`sort.Ints`, `sort.Slice`...) instead. For new code, prefer `slices`.

---

## 2. Searching a slice

### - A. `Contains` & `Index`

```go
nums := []int{5, 2, 8, 1, 9}

slices.Contains(nums, 8) // <--- true
slices.Index(nums, 8)    // <--- 2
slices.Index(nums, 42)   // <--- -1 (not found)
```

### - B. `ContainsFunc` & `IndexFunc`: search by a condition

When you're not looking for an exact value, but for "the first item that matches some condition", pass a function:

```go
users := []User{{"Tal", 30}, {"Dana", 25}, {"Avi", 35}}

slices.ContainsFunc(users, func(u User) bool {
    return u.Name == "Dana"
}) // <--- true

i := slices.IndexFunc(users, func(u User) bool {
    return u.Age > 30
}) // <--- 2 (Avi)
```

`IndexFunc` is Go's version of JavaScript's `findIndex`. There's no `find`, so you use the index: `users[i]` (after checking that `i != -1`).

### - C. `Min` & `Max`

```go
slices.Max(nums) // <--- 9
slices.Min(nums) // <--- 1
```

**Careful:** they panic if the slice is empty.

---

## 3. Sorting

### - A. `Sort`

```go
nums := []int{5, 2, 8, 1, 9}
slices.Sort(nums)
fmt.Println(nums) // <--- [1 2 5 8 9]

names := []string{"bob", "Alice", "carol"}
slices.Sort(names)
fmt.Println(names) // <--- [Alice bob carol]
```

Notice that `Sort` **changes the slice itself** (in place), and returns nothing. If you need to keep the original order too, sort a copy:

```go
sorted := slices.Clone(nums)
slices.Sort(sorted)
```

### - B. `SortFunc`: sort by your own rule

For structs, or any custom order, use `SortFunc` with a comparison function. The function returns a **negative** number if `a` should come first, **positive** if `b` should come first, and `0` if they're equal.

The easiest way to write it is with `cmp.Compare` (from the `cmp` package), which does exactly that:

```go
import "cmp"

slices.SortFunc(users, func(a, b User) int {
    return cmp.Compare(a.Age, b.Age)
})
fmt.Println(users) // <--- [{Dana 25} {Tal 30} {Avi 35}]
```

For descending order, swap them: `cmp.Compare(b.Age, a.Age)`.

If you know JavaScript's `arr.sort((a, b) => a.age - b.age)`, it's the same idea.

### - C. `Reverse`

```go
slices.Reverse(nums) // <--- [9 8 5 2 1] (also in place)
```

---

## 4. Changing a slice

### - A. `DeleteFunc`: remove items by a condition

Go's version of `filter` (but inverted: you say what to **remove**):

```go
nums := []int{1, 2, 3, 4, 5, 6}

evens := slices.DeleteFunc(nums, func(n int) bool {
    return n%2 != 0 // <--- remove the odd numbers
})
fmt.Println(evens) // <--- [2 4 6]
```

**Careful:** `DeleteFunc` modifies the original slice. Use the slice it returns, and don't use the original afterwards.

### - B. `Insert`

```go
slices.Insert([]int{1, 2, 5}, 2, 3, 4) // <--- [1 2 3 4 5]
```

The second argument is the index to insert at, and everything after it is the values to insert.

### - C. `Compact`: remove consecutive duplicates

```go
slices.Compact([]int{1, 1, 2, 2, 2, 3, 1}) // <--- [1 2 3 1]
```

Notice the last `1` stays, because it's not next to the other `1`s. To remove **all** duplicates, sort first, then compact.

---

## 5. Comparing & copying

```go
slices.Equal([]int{1, 2}, []int{1, 2}) // <--- true

copyOfNums := slices.Clone(nums)
```

**Why do we need `Equal`?** Because `==` doesn't work on slices at all. `a == b` is a compile error.

**Why do we need `Clone`?** Because assigning a slice (`b := a`) doesn't copy it. Both variables share the same data (see [Built-in Functions](./builtins.md#7-copy-copy-items-between-slices)).

---

## 6. The `maps` package

### - A. Getting the keys, sorted

**Maps in Go have no order.** If you loop over a map twice, you might get the keys in a different order each time. So, when you need a stable order (for printing, for tests, for output), grab the keys and sort them:

```go
ages := map[string]int{"Tal": 30, "Dana": 25, "Avi": 35}

keys := slices.Sorted(maps.Keys(ages))
fmt.Println(keys) // <--- [Avi Dana Tal]

for _, name := range keys {
    fmt.Println(name, ages[name])
}
```

`maps.Keys` doesn't return a slice. It returns an **iterator** (something you can loop over with `range`). `slices.Sorted` collects it into a slice, and sorts it. If you want the keys without sorting, use `slices.Collect(maps.Keys(ages))`.

`maps.Values` works the same way, for the values.

### - B. `Clone` & `Equal`

```go
copyOfAges := maps.Clone(ages)
copyOfAges["Tal"] = 99

fmt.Println(ages["Tal"])                // <--- 30 (the original didn't change)
fmt.Println(maps.Equal(ages, copyOfAges)) // <--- false
```

### - C. `DeleteFunc`

Removes every entry that matches a condition:

```go
maps.DeleteFunc(copyOfAges, func(name string, age int) bool {
    return age > 30
})
```

---

## 7. Cheat sheet

| Function                       | What it does                             |
| ------------------------------ | ---------------------------------------- |
| `slices.Contains(s, v)`        | Is `v` in the slice?                     |
| `slices.Index(s, v)`           | Position of `v`, or `-1`                 |
| `slices.IndexFunc(s, fn)`      | Position of the first item matching `fn` |
| `slices.Min(s)` / `Max(s)`     | Smallest / largest item                  |
| `slices.Sort(s)`               | Sort in place                            |
| `slices.SortFunc(s, cmpFn)`    | Sort in place, by your own rule          |
| `slices.Reverse(s)`            | Reverse in place                         |
| `slices.DeleteFunc(s, fn)`     | Remove items matching `fn`               |
| `slices.Insert(s, i, v...)`    | Insert values at index `i`               |
| `slices.Equal(a, b)`           | Are two slices equal?                    |
| `slices.Clone(s)`              | Copy a slice                             |
| `slices.Sorted(maps.Keys(m))`  | A map's keys, as a sorted slice          |
| `maps.Clone(m)` / `maps.Equal` | Copy / compare maps                      |
| `maps.DeleteFunc(m, fn)`       | Remove entries matching `fn`             |
