# If statements

## 1. If Structure

```go
var numOfTickets int = 50;

if numOfTickets == 0 {
    fmt.Println("No more tickets!");
}
```

Better code readability would be:

```go
var numOfTickets int = 50;
// probably some business logic here in-between...
var noTicketsLeft bool = numOfTickets == 0

if noTicketsLeft {
    fmt.Println("No more tickets!");
}
```

---

## 2. Else

```go
var numOfTickets int = 50;
// probably some business logic here in-between...
var noTicketsLeft bool = numOfTickets == 0

if noTicketsLeft {
    fmt.Println("No more tickets!");
} else {
    // code here...
}
```

## 3. Else if

```go
var numOfTickets int = 50;
// probably some business logic here in-between...
var noTicketsLeft bool = numOfTickets == 0

if noTicketsLeft {
    fmt.Println("No more tickets!");
} else if numOfTickets < 10 {
    // code here...
} else {
    // Num of tickets is greater than or equal to 10
    // code here...
}
```
