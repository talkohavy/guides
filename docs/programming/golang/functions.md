# Functions

## 1. Characteristics of a Go Function

- Go functions are hoisted

---

## 2. Defining a function

```go
func greetUser() {
    fmt.Println("Hello user!");
}
```

---

## 3. Parameters

```go
func greetUser(username string) {
    fmt.Printf("Hello %s\n", username);
}
```

---

## 4. Returning a value from a function

Notice! **Functions in Go that return something, MUST explicitly write a RETURN TYPE**! It cannot stay implicit, or else you'll get a compile error under the `return someValue;` line.

```go
func greetUser(username string) bool {
    fmt.Printf("Hello %s\n", username);

    return true;
}
```

---

## 5. Return multiple values

Unlike many other programming languages, a `Go` function can return multiple values.

**Notice the return type below**! When returning multiple values, **you have to enclose the return types in parenthesis**.

```go
func getTalName() (string, string) {
    firstName := "tal";
    lastName := "tal";

    return firstName, lastName;
}

firstName, lastName = getTalName();
```
