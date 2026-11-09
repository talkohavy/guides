# Pointer

## 1. What is a pointer?

```go
var amount int = 50;
```

We store values, like the value `50`. Values are stored on memory. Whenever we reference that value using the variable name we defined (`amount`), `Go` must go and find that value in memory. So it needs to know where exactly in memory it is stored. In other words, it needs to know the **Memory Address** of that value. **A pointer is a variable that points to the Memory Address of another variable, that references the actual value** (`50`).

```text
                                Memory Address      Memory
                                --------------      ------
Variable: `tickets`   ----->      0xc01401            50
                                  0xc01402
Variable: `&tickets`  ----->      0xc01403         0xc01401
```

Pointers in Go are also sometimes called **Special Variables**.

---

## 2. A pointer in Go

A pointer in go is referenced using the `&` sign in front of the variable name.

i.e. variable name `amount`, so name of pointer is `&amount`.

Code example:

```go
package main

import "fmt"

func main(){
    var amount int = 50;

    // Print the value of `amount`:
    fmt.Println(amount); // <--- 50

    // Print the memory address of `amount`:
    fmt.Println(&amount); // <--- 0xc01401
}
```
