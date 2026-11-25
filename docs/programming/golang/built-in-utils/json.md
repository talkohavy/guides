# json

## 1. What is `encoding/json`?

`encoding/json` is the package for **converting Go values to JSON and back**.

```go
import "encoding/json"
```

The two functions you'll use the most:

- `json.Marshal`: Go value **to** JSON. Like JavaScript's `JSON.stringify`.
- `json.Unmarshal`: JSON **to** a Go value. Like JavaScript's `JSON.parse`.

**The big difference from JavaScript:** in JS, `JSON.parse` gives you back whatever shape the JSON had. Go is statically typed, so you usually **describe the shape first** with a struct, and then **tell `Unmarshal` to fill that struct**. So any "extra" keys the stringified json included would not appear in the struct.

---

## 2. `Marshal`: Struct to JSON

```go
type User struct {
    Name string
    Age  int
}

u := User{Name: "Tal", Age: 30}

data, err := json.Marshal(u)
if err != nil {
    return err
}

fmt.Println(string(data)) // <--- {"Name":"Tal","Age":30}
```

A few things to notice:

- `Marshal` returns a `[]byte` (raw bytes), not a string. Convert it with `string(data)` if you want to print it. (Most places you'd send it to, like a file or an HTTP response, take `[]byte` directly.)
- It also returns an error. For regular structs it basically never fails, but it can for values JSON can't represent (like a channel or a function).
- The JSON keys are the **field names, as is**: `"Name"`, not `"name"`. We'll fix that with struct tags in a moment.

### - A. `MarshalIndent`: pretty printing

`Marshal` produces a compact, one-line JSON. For something human-readable (logs, debugging, config files), use `MarshalIndent`:

```go
data, err := json.MarshalIndent(u, "", "  ")
fmt.Println(string(data))
```

```json
{
  "Name": "Tal",
  "Age": 30
}
```

The second argument is a prefix for every line (you almost always want `""`), and the third is the indentation (like the third argument of `JSON.stringify(obj, null, 2)`).

---

## 3. Struct tags: controlling the JSON keys

### - A. Renaming fields

**In Go, lowercase fields are ignored ❗**

I need the output JSON to be lowercased. Or maybe my incoming JSON body is lowercased. But creating a struct that begins with a lowercased letter is a problem:

```go
type User struct {
    name string // <--- lowercase: invisible to encoding/json
}

data, _ := json.Marshal(User{Name: "Tal"})
fmt.Println(string(data)) // <--- {}
```

Since `encoding/json` lives in another package, so it can only see your **exported** (capitalized) fields. Lowercase fields are **silently skipped**. However, in JSON, keys are usually `camelCase` or `snake_case`.

Solution: **add a struct tag** to each field

```go
type User struct {
    Name      string `json:"name"`
    Age       int    `json:"age"`
    CreatedAt string `json:"created_at"`
}

data, _ := json.Marshal(User{Name: "Tal", Age: 30, CreatedAt: "2026-11-25"})
fmt.Println(string(data)) // <--- {"name":"Tal","age":30,"created_at":"2026-11-25"}
```

**A struct tag is a _string in backticks_ after the field type**.

**It doesn't change anything about the field in Go**; it's just extra information that packages like `encoding/json` can read.

The same tag is used in both directions: `Marshal` writes the key `"name"`, and `Unmarshal` reads the key `"name"` into `Name`.

### - B. `omitempty`: skip empty values

By default, every field is written, even if it's empty. Add `,omitempty` to leave a field out when it has its zero value:

```go
type User struct {
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
}

data, _ := json.Marshal(User{Name: "Tal"})
fmt.Println(string(data)) // <--- {"name":"Tal"} (no "email" key)
```

"Empty" means: `false`, `0`, `""`, a `nil` pointer, and a `nil` or empty slice/map.

**Careful:** this means you can't send an actual `0` or `false` with `omitempty`. A field `` Count int `json:"count,omitempty"` `` with the value `0` disappears from the output. If `0` is a meaningful value, don't use `omitempty` on it (or use a pointer, see [section 6](#6-missing-vs-zero-pointer-fields)).

**`omitempty` doesn't work on structs.** A nested struct is never considered "empty", so it's always written. Go 1.24 added `omitzero` for that: it skips a field whose value is the zero value, including zero structs and a zero `time.Time`.

### - C. `-`: never include a field

```go
type User struct {
    Name     string `json:"name"`
    Password string `json:"-"` // <--- never written, never read
}
```

Use it for fields that should never leave your program, like a password hash.

---

## 4. `Unmarshal`: JSON to struct

```go
type User struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

input := []byte(`{"name": "Dana", "age": 25}`)

var user User
err := json.Unmarshal(input, &user)
if err != nil {
    return err
}

fmt.Println(user.Name, user.Age) // <--- Dana 25
```

### - A. Why `&user`?

`Unmarshal` doesn't return the result. Instead, you create an empty variable, and give `Unmarshal` a [pointer](../pointers.md) to it, so it can fill it in.

If you forget the `&`, it compiles, but fails at runtime:

```go
err := json.Unmarshal(input, u)
fmt.Println(err) // <--- json: Unmarshal(non-pointer main.User)
```

### - B. Extra & missing keys

`Unmarshal` is forgiving about the shape of the JSON:

- **Keys in the JSON that aren't in the struct** are ignored.
- **Fields in the struct that aren't in the JSON** keep whatever value they already had (for a fresh variable, that's the zero value).

```go
var u User
json.Unmarshal([]byte(`{"name": "Dana", "country": "IL"}`), &u)
fmt.Printf("%+v\n", u) // <--- {Name:Dana Age:0}
```

`"country"` was dropped, and `Age` stayed `0`.

**Tip:** because missing fields keep their existing value, you can set **defaults** before unmarshaling:

```go
cfg := Config{Port: 3000, Host: "localhost"} // <--- defaults
json.Unmarshal(data, &cfg)                   // <--- only overrides what's in the file
```

**Note:** key matching is **case-insensitive**. The JSON key `"NAME"` will also fill the field tagged `"name"`. It rarely matters, but it can surprise you.

### - C. Errors

`Unmarshal` returns an error for invalid JSON:

```go
err := json.Unmarshal([]byte(`{"name": "Dana",}`), &u)
fmt.Println(err) // <--- invalid character '}' looking for beginning of object key string
```

And for values of the wrong type:

```go
err := json.Unmarshal([]byte(`{"name": "Dana", "age": "25"}`), &u)
fmt.Println(err) // <--- json: cannot unmarshal string into Go struct field User.age of type int
```

`"25"` is a string in JSON, and `Age` is an `int`. Go won't convert it for you.

### - D. Slices & nested structs

Just describe the shape, and `Unmarshal` fills it all in:

```go
type Address struct {
    City string `json:"city"`
}

type User struct {
    Name    string   `json:"name"`
    Tags    []string `json:"tags"`
    Address Address  `json:"address"`
}

input := []byte(`[
    {"name": "Tal", "tags": ["admin"], "address": {"city": "Tel Aviv"}},
    {"name": "Dana", "tags": [], "address": {"city": "Haifa"}}
]`)

var users []User
err := json.Unmarshal(input, &users)

fmt.Println(users[0].Address.City) // <--- Tel Aviv
```

---

## 5. When you don't know the shape: `map[string]any`

Sometimes you don't have a struct for the JSON, or the shape changes. You can unmarshal into a `map[string]any` (`any` means "a value of any type"):

```go
var m map[string]any
json.Unmarshal([]byte(`{"name": "Avi", "age": 35, "tags": ["a", "b"]}`), &m)

fmt.Println(m["name"]) // <--- Avi
```

The catch is that every value is an `any`, so to actually use one, you need a **type assertion** to say what it really is:

```go
age := m["age"].(float64)
fmt.Println(age + 1) // <--- 36
```

Notice the `float64`. **All JSON numbers become `float64`** when there's no struct to tell Go otherwise, even `35`. Here's the full mapping:

| JSON             | Go (inside `any`) |
| ---------------- | ----------------- |
| `"text"`         | `string`          |
| `35`, `3.14`     | `float64`         |
| `true` / `false` | `bool`            |
| `null`           | `nil`             |
| `[...]`          | `[]any`           |
| `{...}`          | `map[string]any`  |

**Prefer structs when you can.** With a map, every access needs a type assertion, and a typo in a key just gives you `nil` instead of a compile error.

---

## 6. Missing vs. zero: pointer fields

After `Unmarshal`, if `Age` is `0`, you can't tell whether the JSON said `"age": 0`, or didn't have an `"age"` key at all. Usually that's fine. But sometimes it matters, like in a `PATCH` request, where "not sent" means "don't change it", and `0` means "set it to 0".

The fix is to use a **pointer** field. A missing key leaves it `nil`, and a present key (even with a zero value) makes it point to a value:

```go
type UpdateUser struct {
    Name *string `json:"name"`
    Age  *int    `json:"age"`
}

var req UpdateUser
json.Unmarshal([]byte(`{"age": 0}`), &req)

fmt.Println(req.Name == nil) // <--- true  (not sent)
fmt.Println(*req.Age)        // <--- 0     (sent, and it's 0)
```

---

## 7. Streams: `Encoder` & `Decoder`

`Marshal` and `Unmarshal` work with a `[]byte` that's already in memory. When the JSON comes from (or goes to) a **stream**, like an HTTP request body, an HTTP response, or a file, use `Decoder` and `Encoder` instead. They read and write directly, without you first loading everything into a `[]byte`.

### - A. `Decoder`: read JSON from a stream

The most common use, reading the body of an HTTP request:

```go
func createUser(w http.ResponseWriter, r *http.Request) {
    var u User
    if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        http.Error(w, "invalid JSON", http.StatusBadRequest)
        return
    }
    // ...use u
}
```

Want to **reject** unknown keys instead of ignoring them?  
_(useful for catching typos in config files or API requests)_  
The decoder has an option for that:

```go
dec := json.NewDecoder(r.Body)
dec.DisallowUnknownFields()

err := dec.Decode(&u) // <--- json: unknown field "agee"
```

### - B. `Encoder`: write JSON to a stream

The most common use, writing an HTTP response:

```go
func getUser(w http.ResponseWriter, r *http.Request) {
    u := User{Name: "Tal", Age: 30}

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(u)
}
```

It works with anything you can write to, like a file or `os.Stdout`:

```go
json.NewEncoder(os.Stdout).Encode(u) // <--- {"name":"Tal","age":30}
```

**Note:** `Encode` adds a newline (`\n`) after the JSON. `Marshal` doesn't.

### - C. Which one should I use?

- Have a `[]byte` or a string already? Use `Marshal` / `Unmarshal`.
- Reading from or writing to an `io.Reader` / `io.Writer` (HTTP bodies, files)? Use `NewDecoder` / `NewEncoder`.

---

## 8. Gotchas

### - A. `nil` slice vs. empty slice

```go
var a []string  // <--- nil slice
b := []string{} // <--- empty slice

x, _ := json.Marshal(a)
y, _ := json.Marshal(b)

fmt.Println(string(x)) // <--- null
fmt.Println(string(y)) // <--- []
```

In Go, both behave the same (`len` is `0`, you can `append` to both). But in JSON one is `null` and the other is `[]`. If your frontend does `response.tags.map(...)`, a `null` will crash it. When a list should always be a list, initialize it with `[]string{}`.

### - B. Map keys are sorted

When you marshal a map, the keys are written in **alphabetical order**, no matter how you inserted them:

```go
m := map[string]int{"b": 2, "a": 1, "c": 3}
data, _ := json.Marshal(m)
fmt.Println(string(data)) // <--- {"a":1,"b":2,"c":3}
```

Struct fields, on the other hand, are written in the order they're declared in the struct.

### - C. HTML characters are escaped

`Marshal` escapes `<`, `>` and `&`, so the JSON is safe to put inside an HTML page:

```go
data, _ := json.Marshal("<b>")
fmt.Println(string(data)) // <--- "\u003cb\u003e"
```

It's still valid JSON, and decodes back to `"<b>"`, so it's usually not a problem. It only looks weird when you read it.

### - D. Special types

- `time.Time` is written as a string in RFC 3339 format (`"2026-11-25T10:30:00Z"`), and read back from the same format. See [time](./time.md).
- `[]byte` is written as a **base64** string, not as an array of numbers.
