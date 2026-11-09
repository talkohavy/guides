# Loops

## 1. Introduction

In Go, **Loops are simplified**.

You don't have different types of loops. No while, do-while, forEach, and so on. You just have 1 for loop, and that's it.

---

## 2. Define an infinite loop

```go
for {

}
```

It's the same as writing:

```go
for true {

}
```

Only cleaner.

---

## 3. Classic of loop

```go
for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

NOTE: using `var` wouldn't work! only `:=`.

---

## 4. Range loop

`range` can accept a number.

```go
for range 10 {
    fmt.Println("Hi")
}
```

`range` can even return the _index_:

```go
for x := range 4 {
    fmt.Println(i); // <--- Would print 0 1 2 3
}
```

## 5. Define a for-each loop

`range` iterates over elements of different data structures, not only `arrays` & `slices`.
Specifically for `arrays` & `slices`, it gives us back the `index` & `value` for each element.

```go
var arr = [3]int{1,2,3}

for index , item := range arr {
    fmt.Println(index, item);
}
```

When you don't need/use the `index` value, simply replace it with an `_`. The `_` is known in many languages as the **Blank Identifier**.

```go
var arr = [3]int{1,2,3}

for _ , item := range arr {
    fmt.Println(index, item);
}
```

---

## 6. Breaking a loop

To stop a for loop mid-way, you can use the `break` keyword.

Example:

```go
var arr = [3]int{1,2,3}

for {
    break; // <--- probably wrapped in some condition of course
}
```

---

## 7. Continue

Exactly what you think:

```go
var arr = [3]int{1,2,3}

for {
    continue; // <--- probably wrapped in some condition of course
}
```

## 8. for as long as

A `for loop` with a condition:

```go
for remainingTicket > 0 {
}

for len(arr) < 50 {
}

for remainingTicket > 0 && len(arr) < 50 {
}
```
