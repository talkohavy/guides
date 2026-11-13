# Utility Functions

## 1. len

```go
len(arrOrSliceOrStr)
```

---

## 2. append

```go
const slice = append(slice, value);
```

---

## 3. Fields

```go
const updatedStr = strings.Fields(str);
```

Splits the string with whitespace as a separator. Returns a slice of strings with the split elements. For example, input: `"Tal Kohavy"`, output: `["Tal","Kohavy"]`.

---

## 4. Errors

```go
import "errors"

err := errors.New("error message")
```

---

## 5. Errors

```go
strconv.FormatUInt(i uint64, base int) string
```

FormatUint returns the string representation of i in the given base, for `2 <= base <= 36`. The result uses the lower-case letters 'a' to 'z' for digit values >= 10.

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
    v := uint64(42)
    s10 := strconv.FormatUint(v, 10)
    fmt.Printf("%T, %v\n", s10, s10)

    s16 := strconv.FormatUint(v, 16)
    fmt.Printf("%T, %v\n", s16, s16)
}
```

---

## 6. unit64

In Go, `uint64` is a built-in unsigned 64-bit integer type that holds non-negative whole numbers from 0 to 18,446,744,073,709,551,615 (2⁶⁴ - 1). It occupies 8 bytes of memory regardless of whether the system architecture is 32-bit or 64-bit.

```go
const count = uint64(ticketsCount, 10);
```

---

## 7. Sprintf

In `fmt`, Print, Println & Printf are all functions that print.

But what if I wanted to store the string in a variable? Come `Sprintf`.

```go
var ticket = fmt.Sprintf("%v tickets for %v %v", ticketCount, firstName, lastName);
```

---

## 8. time package

### - A. Sleep

```go
import (
    "fmt"
    "time"
)

func uploadImage(){
    time.Sleep(10 * time.Second);
    fmt.Println("Image uploaded successfully!");
}
```

### - B. Now

```go
startNow := time.Now();
```

### - C. Since

Returns result in ms.

```go
startNow := time.Now();

fmt.Println("This operation took:", time.Since(startNow));
```
