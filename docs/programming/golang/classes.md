# Classes

## 1. Does Go have classes?

**No.** Go does not have classes in the traditional OOP sense (like Java, C#, or TypeScript). There is no `class` keyword, no `extends`, no `implements`, and no constructors.

Instead, Go gives you a few smaller building blocks, which together cover almost everything a class does:

| What a class gives you     | What Go uses instead               |
| -------------------------- | ---------------------------------- |
| Properties                 | **Struct** fields                  |
| Methods                    | **Methods** with a receiver        |
| `this`                     | The **receiver** (`u` in `u User`) |
| Constructor                | A plain `NewXxx()` function        |
| `public` / `private`       | **Capitalization** of the name     |
| `implements SomeInterface` | **Interfaces** (implicit)          |
| `extends` (inheritance)    | **Embedding** (composition)        |

Let's go over them one by one.

---

## 2. Structs: the data

A struct is the "properties" part of a class. We already covered structs in [Data Types](./data-types.md), so here's just a quick reminder:

```go
type User struct {
    Name string
    Age  int
}

user := User{
    Name: "John",
    Age:  25,
}
```

A struct holds data, but on its own it has no behavior. For that, we need methods.

---

## 3. Methods: the behavior

### - A. Defining a method

A method is just **a function with a receiver**. The receiver goes in parentheses, **between the `func` keyword and the method name**:

```go
func (u User) SayHello() {
    fmt.Println("Hello, I'm", u.Name)
}
```

That `(u User)` part is what attaches `SayHello` to the `User` type. Now we can call it with a dot, just like a method on a class:

```go
user.SayHello() // <--- Hello, I'm John
```

**The receiver `u` is Go's version of `this`** (or `self`). It's just a regular name you choose, and by convention it's a short one: usually the first letter of the type.

### - B. Methods live outside the struct

Notice that **the method is not written inside the struct**, like it would be inside a class. It's a separate declaration, and the only thing linking the two is the receiver.

The one rule: **a method must be declared in the same package as its type**. You can't add methods to a type from another package (like `string`, or a struct from some library).

---

## 4. Pointer receivers: modifying the struct

### - A. The problem with value receivers

Let's try writing a method that changes the user's age:

```go
func (u User) Birthday() {
    u.Age++
}

user := User{Name: "John", Age: 25}
user.Birthday()
fmt.Println(user.Age) // <--- 25 ❌
```

**The age didn't change!** That's because `(u User)` is a **value receiver**: the method gets **a copy** of the struct. It increments the copy's age, and the copy is thrown away when the method returns.

### - B. The fix: a pointer receiver

To modify the original struct, the method needs to receive a [pointer](./pointers.md) to it. Just add a `*` before the type:

```go
func (u *User) Birthday() {
    u.Age++
}

user := User{Name: "John", Age: 25}
user.Birthday()
fmt.Println(user.Age) // <--- 26 ✅
```

**Notice we didn't have to write `(&user).Birthday()`.** Go sees that `Birthday` needs a pointer, and takes the address of `user` for you automatically.

### - C. Which one should I use?

- Use a **pointer receiver** (`*User`) if the method **modifies** the struct, or if the struct is **large** (to avoid copying it on every call).
- Use a **value receiver** (`User`) for small structs that the method only reads.
- **Be consistent.** If some methods of a type need a pointer receiver, the convention is to give **all** of its methods a pointer receiver.

When in doubt, use a pointer receiver.

---

## 5. Constructors: just a function

Go has no constructors. You can always create a struct directly with `User{...}`, and any field you leave out gets its **zero value** (`""` for strings, `0` for numbers, etc.).

When a type needs some setup, or some validation, the convention is a plain function called `New` + the type name, which returns a pointer:

```go
func NewUser(name string, age int) *User {
    return &User{
        Name: name,
        Age:  age,
    }
}

user := NewUser("John", 25)
```

There's nothing special about it. It's a regular function, and the name `NewUser` is just a convention.

---

## 6. Public & private: capitalization

Go has no `public` or `private` keywords. Instead, it uses the same rule we saw for functions in [Packages](./packages.md):

- A field or method starting with an **uppercase** letter is **exported** (public).
- A field or method starting with a **lowercase** letter is **unexported** (private).

```go
type User struct {
    Name     string // <--- public
    password string // <--- private
}

func (u *User) SetPassword(p string) { // <--- public
    u.password = p
}

func (u *User) validate() bool { // <--- private
    return u.Name != ""
}
```

**Notice! "Private" in Go means private to the package, not to the type.** Any code inside the same package can still read `user.password`. Only code in other packages is blocked from it.

---

## 7. Interfaces: implicit contracts

### - A. Defining an interface

An interface is a list of method signatures:

```go
type Speaker interface {
    SayHello()
}
```

Any function can accept a `Speaker`, without caring what the actual type is:

```go
func greet(s Speaker) {
    s.SayHello()
}
```

### - B. No `implements` keyword

Here's the cool part. **A type satisfies an interface automatically, just by having the right methods.** There's no `implements` keyword, and the type doesn't even need to know the interface exists.

`User` already has a `SayHello()` method, so it's already a `Speaker`:

```go
user := User{Name: "John"}
greet(user) // <--- Works! ✅
```

Any other type with a `SayHello()` method would work too:

```go
type Robot struct {
    Model string
}

func (r Robot) SayHello() {
    fmt.Println("Beep boop, I'm", r.Model)
}

greet(Robot{Model: "R2-D2"}) // <--- Also works! ✅
```

### - C. Gotcha: pointer receivers and interfaces

If a method has a **pointer receiver**, only the **pointer** satisfies the interface:

```go
func (u *User) SayHello() {
    fmt.Println("Hello, I'm", u.Name)
}

user := User{Name: "John"}
greet(user)  // <--- Error! ❌
greet(&user) // <--- Works! ✅
```

The error:

> User does not implement Speaker (method SayHello has pointer receiver)

The automatic `&` that Go does for regular method calls (like in section 4) doesn't happen here, so you have to pass `&user` yourself.

---

## 8. Embedding: composition instead of inheritance

### - A. Embedding a struct

Go has no `extends`. Instead, you can **embed** one struct inside another, by writing just the type name, with no field name:

```go
type Animal struct {
    Name string
}

func (a Animal) Speak() {
    fmt.Println("...")
}

type Dog struct {
    Animal // <--- embedded
    Breed  string
}
```

Now `Dog` gets access to the embedded `Animal`'s fields and methods, as if they were its own:

```go
dog := Dog{
    Animal: Animal{Name: "Rex"},
    Breed:  "Husky",
}

fmt.Println(dog.Name) // <--- Rex
dog.Speak()           // <--- ...
```

This is called **promotion**: the fields and methods of `Animal` are _promoted_ to `Dog`. Under the hood, `dog.Name` is just a shortcut for `dog.Animal.Name`.

### - B. "Overriding" a method

`Dog` can define its own `Speak()`. It takes priority over the embedded one:

```go
func (d Dog) Speak() {
    fmt.Println("Woof!")
}

dog.Speak()        // <--- Woof!
dog.Animal.Speak() // <--- ... (the embedded one is still reachable)
```

### - C. Why this is NOT inheritance

It looks a lot like inheritance, but it isn't. Two examples show the difference.

**1. A `Dog` is not an `Animal`.** You can't pass a `Dog` where an `Animal` is expected:

```go
func pet(a Animal) {}

pet(dog)        // <--- Error! ❌ cannot use dog (variable of type Dog) as Animal value
pet(dog.Animal) // <--- Works ✅
```

**2. No virtual methods.** Let's say `Animal` has a method that calls `Speak()`:

```go
func (a Animal) Introduce() {
    fmt.Print(a.Name, " says: ")
    a.Speak()
}

dog.Introduce() // <--- Rex says: ...
```

In Java, this would print `Woof!`, because `Dog` overrides `speak()`. But in Go, `Introduce` belongs to `Animal`, and inside it `a` is just an `Animal`. **It has no idea it's embedded inside a `Dog`**, so it calls `Animal`'s `Speak()`.

**If you want polymorphism, use interfaces**, not embedding.

---

## 9. The key takeaway

Go supports object-oriented programming, but in its own way:

- **Composition over inheritance.** Build types by embedding smaller types, instead of building class hierarchies.
- **Implicit interfaces over explicit ones.** Describe the behavior you need, and any type that has it will fit.

Official references:

- [Go FAQ: Is Go an object-oriented language?](https://go.dev/doc/faq#Is_Go_an_object-oriented_language)
- [Effective Go: Embedding](https://go.dev/doc/effective_go#embedding)
