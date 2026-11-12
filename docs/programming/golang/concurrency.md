# Concurrency

## 1. Motivation

### - A. How you're used to it (Node.js)

In Node.js, you have **one thread** running your JavaScript. Concurrency is achieved with the **event loop**: whenever you do I/O (a DB query, an HTTP request, reading a file), you hand it off, and continue with something else until the result comes back.

```js
const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);
```

This is great for I/O, but:

- **CPU-heavy work blocks everything** (a big `JSON.parse`, hashing, image processing). For that you need `worker_threads`, which are heavy and awkward.
- You get **function coloring**: once a function is `async`, every caller must become `async` too.

### - B. How Java does it

**In Java, you have real OS threads** (`new Thread(...)`, `ExecutorService`). They run in parallel on all CPU cores, **but each OS thread is expensive** (~1MB of stack memory), so you can't just spawn 100,000 of them. **You end up managing thread pools**. (Java 21 added _virtual threads_, which are basically Java copying Go's idea.)

### - C. How Go does it

Go gives you **goroutines**:

- A goroutine is a **super lightweight thread** managed by the Go runtime (not by the OS).
- It starts with a tiny stack (~2KB) that grows as needed, so **spawning 100,000 goroutines is totally normal**.
- The Go runtime **multiplexes** all goroutines over a small number of OS threads (by default, one per CPU core). So you get **real parallelism** on all cores, for both I/O work and CPU work.
- **There is no `async`/`await` and no function coloring!** You write plain, synchronous-looking, blocking code. When a goroutine waits on I/O, the runtime simply parks it and runs another goroutine on that thread.

That last point is the biggest mindset shift coming from JS:

:::info
In Go, **blocking is fine**. A function that makes an HTTP request just... returns the response. No promises, no callbacks. **Concurrency is decided by the caller**, not by the function.

For example, in JavaScript, it is the function who decides. When someone writes a function as async, it always returns a promise, and every caller has to deal with that (by adding an await in front of it, and being async itself).

:::

### - D. Concurrency vs. Parallelism

Two words that get mixed up a lot:

- **Concurrency** - _dealing_ with many things at once (structuring your program as independent tasks). Node.js is concurrent.
- **Parallelism** - _doing_ many things at once (literally running at the same moment on different CPU cores). Node.js (without workers) is not parallel.

Go gives you **both**: you write concurrent code, and the runtime runs it in parallel when it can.

If you're still struggling with a mental model - **Think of making breakfast: toast and eggs**.

**Concurrency is one cook handling two jobs**. You put the bread in the toaster. While it toasts, you crack the eggs into the pan. Then you butter the toast while the eggs cook. Both jobs are in progress at the same time, but **at any single moment your hands are only doing one thing**. You switch to the other job whenever this one is waiting.

**Parallelism is two cooks**. One makes toast and the other makes eggs. At the same moment, two pairs of hands are working.

---

## 2. Goroutines

### - A. The `go` keyword

To run a function in a new goroutine, simply **put the word `go` in front of the function call**:

```go
package main

import (
    "fmt"
    "time"
)

func sayHi(name string) {
    fmt.Println("Hi", name)
}

func main() {
    go sayHi("Tal") // <--- runs in the background
    go sayHi("Daniel")

    time.Sleep(100 * time.Millisecond) // <--- don't do this in real code (see below)
}
```

You can also use it with an anonymous function (very common):

```go
go func() {
    fmt.Println("I'm running in a goroutine")
}()
```

Things to know about `go`:

- `go` **does not wait**. The line returns immediately, and the function runs in the background. Think of it as calling an `async` function **without** `await`-ing it.
- You **cannot get a return value** from `go someFunc()`. Doing this: `x := go someFunc()` is a compile error. To get results back, we use **channels** (as we'll see later).
- The order in which goroutines run is **not guaranteed**. Running the example above might print Daniel before Tal.

### - B. When `main` exits, everything dies

Bad ❌:

```go
func main() {
    go sayHi("Tal")
} // <--- prints nothing!
```

**When the `main` function returns, the program exits, and all running goroutines are killed instantly.** No waiting, no cleanup.

This is different from Node.js, where the process stays alive as long as there's pending work in the event loop.

Using `time.Sleep` to "wait" (like in the first example) is a hack: you're guessing how long the work takes. The correct way to wait is with a `WaitGroup`.

---

## 3. Waiting for goroutines: `sync.WaitGroup`

### - A. What is it?

A `WaitGroup` is **a counter of running goroutines**. You can wait until that counter drops back to 0.

It's the closest thing to `await Promise.all(...)` (when you don't care about return values).

### - B. The modern way: `wg.Go`

Since Go 1.25, `WaitGroup` has a `Go` method that both starts the goroutine **and** tracks it:

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup

    names := []string{"Tal", "Daniel", "Dana"}

    for _, name := range names {
        wg.Go(func() {
            fmt.Println("Hi", name)
        })
    }

    wg.Wait() // <--- blocks until all 3 goroutines are done
    fmt.Println("All done!")
}
```

### - C. The classic way: `Add` + `Done`

You'll see this in nearly all existing code, so you need to recognize it:

```go
var wg sync.WaitGroup

for _, name := range names {
    wg.Add(1) // <--- increment counter BEFORE starting the goroutine
    go func() {
        defer wg.Done() // <--- decrement counter when the goroutine finishes
        fmt.Println("Hi", name)
    }()
}

wg.Wait()
```

Rules for the classic way:

- Call `wg.Add(1)` **before** the `go` statement, never inside the goroutine. Otherwise, `wg.Wait()` might run before `Add` happened, see a counter of 0, and return too early.
- Always use `defer wg.Done()` so it's called even if the function returns early.
- If you pass a `WaitGroup` to a function, **pass a pointer** (`*sync.WaitGroup`). Passing it by value copies the counter, and your `Wait()` will hang forever.

:::info
Before Go 1.22, every iteration of a `for` loop **shared the same loop variable**, so all goroutines in the loop above could print the last `name`. You'll see old code doing `name := name` inside the loop to work around it. Since Go 1.22, each iteration gets its own variable, so this is no longer needed.
:::

---

## 4. Shared memory and race conditions

### - A. The problem

In Node.js, you never think about two pieces of code touching the same variable **at the exact same time**, because only one piece of JS runs at a time.

In Go, goroutines run **truly in parallel**. So this is broken:

Bad ❌:

```go
func main() {
    count := 0
    var wg sync.WaitGroup

    for range 1000 {
        wg.Go(func() {
            count++ // <--- multiple goroutines writing at the same time!
        })
    }

    wg.Wait()
    fmt.Println(count) // <--- 1000? 978? 991? Different every run!
}
```

`count++` is actually 3 steps: _read_ the value, _add 1_, _write_ it back. Two goroutines may both read `41`, both add 1, and both write `42`. One increment is lost. This is called a **data race**.

### - B. The race detector

Go ships with a built-in tool that catches data races. Just add the `-race` flag:

```bash
go run -race ./src
```

And:

```bash
go test -race ./src
```

It will print `WARNING: DATA RACE` along with the exact lines involved.

:::info
**Make `go test -race ./src` part of your workflow (and your CI).** Races are bugs that might show up once in 10,000 runs, and the race detector is by far the easiest way to find them.
:::

### - C. Fix #1: `sync.Mutex`

A **Mutex** (mutual exclusion) is a lock. Only one goroutine can hold it at a time. Everybody else who calls `Lock()` waits in line.

Good ✅:

```go
func main() {
    count := 0
    var mu sync.Mutex
    var wg sync.WaitGroup

    for range 1000 {
        wg.Go(func() {
            mu.Lock()
            count++
            mu.Unlock()
        })
    }

    wg.Wait()
    fmt.Println(count) // <--- always 1000
}
```

Inside a bigger function, the idiom is to unlock with `defer`, so you never forget it (even on early returns or panics):

```go
mu.Lock()
defer mu.Unlock()
// ... everything until the end of the function is protected
```

Rules regarding Mutexes:

- **Keep the locked section small.** Don't hold a lock while doing slow work like HTTP calls.
- **Never copy a Mutex** after using it. When it lives inside a struct, pass that struct around as a pointer.
- Go's Mutex is **not re-entrant**: calling `Lock()` twice from the same goroutine (without `Unlock()` in between) will hang forever. Java's `synchronized` allows that, Go doesn't.

### - D. `sync.RWMutex`

When you have **many readers and few writers** (like an in-memory cache), use `sync.RWMutex`. Many goroutines can hold the read lock together, but a writer gets exclusive access:

```go
var mu sync.RWMutex
cache := map[string]string{}

// Readers:
mu.RLock()
value := cache["key"]
mu.RUnlock()

// Writers:
mu.Lock()
cache["key"] = "value"
mu.Unlock()
```

:::info
**Maps are NOT safe for concurrent use!** If one goroutine writes to a map while others read or write it, Go will crash the whole program with `fatal error: concurrent map writes`. This is not a panic you can recover from. Always protect shared maps with a Mutex.
:::

### - E. Fix #2: `sync/atomic`

For simple counters and flags, the `sync/atomic` package is faster and simpler than a Mutex:

```go
var count atomic.Int64

for range 1000 {
    wg.Go(func() {
        count.Add(1)
    })
}

wg.Wait()
fmt.Println(count.Load()) // <--- 1000
```

There's also `atomic.Bool`, `atomic.Int32`, `atomic.Pointer[T]`, etc.

---

## 5. Channels

### - A. The Go philosophy

Mutexes work, but Go has a famous saying:

> **Don't communicate by sharing memory; share memory by communicating.**

Instead of many goroutines touching the same variable, **goroutines send data to each other through channels**. Only one goroutine owns a piece of data at a time, so there's nothing to lock.

### - B. What is a channel?

A channel is **a typed pipe**. One goroutine puts values in at one end, another goroutine takes them out at the other end.

Create one with `make`:

```go
ch := make(chan int) // <--- a channel that carries ints
```

Send and receive with the arrow operator `<-`. **The arrow shows the direction the data flows**:

```go
ch <- 42      // send 42 INTO the channel
value := <-ch // receive a value FROM the channel
```

### - C. Getting results back from a goroutine

Remember that `go` can't return a value? Channels solve that:

```go
func fetchUser(id int) string {
    time.Sleep(time.Second) // <--- pretend this is an HTTP call
    return fmt.Sprintf("user-%d", id)
}

func main() {
    ch := make(chan string)

    go func() {
        ch <- fetchUser(1)
    }()

    // ... do other things meanwhile ...

    user := <-ch // <--- waits here until the goroutine sends the value
    fmt.Println(user)
}
```

In JS terms: `go func() {...}()` is like _creating a promise_, and `<-ch` is like _awaiting it_.

Notice that `fetchUser` is a plain synchronous function. The caller decided to run it concurrently. That's the Go way.

### - D. Unbuffered channels block

A channel made with `make(chan int)` is **unbuffered**. That means:

- **A send blocks** until another goroutine is ready to receive.
- **A receive blocks** until another goroutine sends.

The two goroutines literally meet and hand off the value. This makes unbuffered channels also a **synchronization tool**, not just a way to pass data.

If everybody is blocked and no one can ever wake up, Go detects it and crashes:

Bad ❌:

```go
func main() {
    ch := make(chan int)
    ch <- 1 // <--- no one will ever receive this!
    fmt.Println(<-ch)
}
```

```text
fatal error: all goroutines are asleep - deadlock!
```

### - E. Buffered channels

You can give a channel a **buffer size**:

```go
ch := make(chan int, 3)

ch <- 1 // doesn't block
ch <- 2 // doesn't block
ch <- 3 // doesn't block
ch <- 4 // <--- blocks! buffer is full, waits until someone receives
```

- Sends only block when the **buffer is full**.
- Receives only block when the **buffer is empty**.

When to use a buffer? When you know exactly how many values will be sent (for example, one result per goroutine), or to limit how many things run at once (see section 8). **Don't add a buffer just to "make a deadlock go away"**. That usually hides a bug.

### - F. Closing a channel & ranging over it

The sender can call `close(ch)` to signal **"no more values are coming"**. The receiver can then loop over the channel with `range`, and the loop ends when the channel is closed and empty:

```go
func main() {
    ch := make(chan int)

    go func() {
        for i := range 5 {
            ch <- i
        }
        close(ch) // <--- without this, the range below would wait forever (deadlock)
    }()

    for value := range ch {
        fmt.Println(value) // 0, 1, 2, 3, 4
    }
}
```

You can also check if a channel was closed when receiving, using the "comma ok" form:

```go
value, ok := <-ch
if !ok {
    fmt.Println("channel is closed")
}
```

Rules regarding closing:

- **Only the sender closes** a channel. Never the receiver.
- **Sending on a closed channel panics.** Closing an already-closed channel also panics.
- **Receiving from a closed channel never blocks**. It immediately returns the zero value (with `ok == false`).
- **You don't have to close every channel.** Only close when a receiver needs to know that the values are done (like with `range`). Unused channels get garbage-collected anyway.

### - G. Channel directions

When passing channels into functions, you can restrict them to **send-only** or **receive-only**. The compiler then enforces it:

```go
func producer(out chan<- int) { // <--- can only SEND into `out`
    out <- 1
}

func consumer(in <-chan int) { // <--- can only RECEIVE from `in`
    fmt.Println(<-in)
}
```

Same trick as before: look at where the arrow points relative to `chan`. It makes function signatures self-documenting, so use it whenever you can.

### - H. Nil channels

A channel declared with `var` and never initialized is `nil` (similar to maps):

```go
var ch chan int // <--- nil!
```

**Sending to or receiving from a nil channel blocks forever.** That's almost always a bug, so always create channels with `make`.

---

## 6. `select`: waiting on multiple channels

### - A. The basics

`select` is like a `switch`, but every `case` is a channel operation. It **waits until one of the cases can proceed, and runs that one**. If several are ready at the same time, it picks one at random.

```go
select {
case msg := <-emailCh:
    fmt.Println("got email:", msg)
case msg := <-smsCh:
    fmt.Println("got sms:", msg)
}
```

In JS terms, this is `Promise.race(...)`.

### - B. Timeouts

The most common use of `select` is adding a timeout. `time.After(d)` returns a channel that receives a value after the duration `d`:

```go
ch := make(chan string, 1)

go func() {
    ch <- fetchUser(1)
}()

select {
case user := <-ch:
    fmt.Println("got:", user)
case <-time.After(2 * time.Second):
    fmt.Println("timed out!")
}
```

:::info
**Why is `ch` buffered (size 1) here?** If the timeout wins, nobody will ever read from `ch`. With an unbuffered channel, the goroutine would get stuck on `ch <- ...` **forever**. That's a **goroutine leak**: it never finishes and never gets garbage-collected. With a buffer of 1, the send succeeds even if no one is listening, and the goroutine exits.
:::

### - C. Non-blocking operations with `default`

If you add a `default` case, `select` doesn't wait. If no channel is ready, `default` runs immediately:

```go
select {
case msg := <-ch:
    fmt.Println("got:", msg)
default:
    fmt.Println("nothing ready, moving on")
}
```

### - D. `for` + `select`

A goroutine that keeps handling events until it's told to stop looks like this. You'll see this pattern **everywhere**:

```go
for {
    select {
    case job := <-jobs:
        process(job)
    case <-done:
        return // <--- exit the goroutine
    }
}
```

---

## 7. `context`: cancellation and timeouts

### - A. Why?

Say you handle an HTTP request, which starts 3 goroutines that call other services. Then the user closes their browser. You want to **stop all that work**, not let it keep running for nothing.

That's what the `context` package is for. It's **Go's version of `AbortController`/`AbortSignal`** from JavaScript.

### - B. Creating a context

```go
// The root context. Never cancelled. Use it in main() and in tests.
ctx := context.Background()

// A child that you cancel manually:
ctx, cancel := context.WithCancel(ctx)
defer cancel()

// A child that cancels itself after 2 seconds:
ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
defer cancel()
```

- Contexts form a **tree**. Cancelling a parent cancels all of its children.
- **Always `defer cancel()`**, even with a timeout. It frees resources right away instead of waiting for the timer. (`go vet` will warn you if you forget.)
- In an HTTP server, you don't create the root yourself. Each request already comes with one: `r.Context()`. It is cancelled when the client disconnects.

### - C. Using a context

**By convention, `ctx` is always the first parameter of a function**, and it's called `ctx`:

```go
func fetchUser(ctx context.Context, id int) (string, error)
```

Most of the standard library (and any decent library) accepts a context, and stops when it's cancelled:

```go
req, err := http.NewRequestWithContext(ctx, "GET", "https://api.example.com/users/1", nil)
```

In your own long-running code, listen to `ctx.Done()`. It's a channel that gets closed when the context is cancelled:

```go
func worker(ctx context.Context, jobs <-chan int) error {
    for {
        select {
        case job := <-jobs:
            process(job)
        case <-ctx.Done():
            return ctx.Err() // <--- context.Canceled or context.DeadlineExceeded
        }
    }
}
```

Rules regarding context:

- **Pass it explicitly** as the first argument. Don't store it inside a struct.
- **Never pass `nil`** as a context. If you're not sure what to pass, use `context.TODO()`.
- Use it for **cancellation and deadlines**. Don't use it as a bag for passing regular function arguments.

---

## 8. Common patterns

### - A. Run N things concurrently, collect all results (`Promise.all`)

```go
func main() {
    ids := []int{1, 2, 3, 4, 5}
    results := make([]string, len(ids))

    var wg sync.WaitGroup
    for i, id := range ids {
        wg.Go(func() {
            results[i] = fetchUser(id) // <--- each goroutine writes to its OWN index
        })
    }
    wg.Wait()

    fmt.Println(results)
}
```

Writing to **different indexes** of the same slice from different goroutines is safe. Only writing to the **same** memory is a race. This is often simpler than using a channel.

### - B. `Promise.all` with errors: `errgroup`

What if one of the calls fails? Then you want to get the error back, and ideally cancel the rest. That's exactly what `errgroup` does (from the semi-official `golang.org/x/sync` module):

```bash
go get golang.org/x/sync/errgroup
```

```go
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, ids []int) ([]string, error) {
    results := make([]string, len(ids))

    g, ctx := errgroup.WithContext(ctx)

    for i, id := range ids {
        g.Go(func() error {
            user, err := fetchUser(ctx, id)
            if err != nil {
                return err // <--- cancels ctx, so the other goroutines can stop early
            }
            results[i] = user
            return nil
        })
    }

    if err := g.Wait(); err != nil { // <--- waits for all, returns the FIRST error
        return nil, err
    }

    return results, nil
}
```

**In real-world code, `errgroup` is what you'll use most often** for "do these things concurrently".

### - C. Limiting concurrency (like `p-limit`)

Spawning 10,000 goroutines is cheap. Making 10,000 HTTP calls to the same API at the same time is not. To cap how many run at once:

With `errgroup`, just call `SetLimit`:

```go
g, ctx := errgroup.WithContext(ctx)
g.SetLimit(10) // <--- at most 10 goroutines running at a time
```

Without `errgroup`, use a buffered channel as a **semaphore**:

```go
sem := make(chan struct{}, 10) // <--- 10 "slots"

for _, id := range ids {
    wg.Go(func() {
        sem <- struct{}{}        // grab a slot (blocks when all 10 are taken)
        defer func() { <-sem }() // release the slot when done

        fetchUser(id)
    })
}
```

(`struct{}` is an empty type that takes zero memory. It's the idiomatic type for a channel where only the signal matters, not the value.)

### - D. Worker pool

A fixed number of workers that pull jobs from a shared channel. Useful for processing a stream of jobs, or a queue of unknown length:

```go
func main() {
    jobs := make(chan int)
    results := make(chan int)

    // 1. Start 3 workers
    var wg sync.WaitGroup
    for range 3 {
        wg.Go(func() {
            for job := range jobs { // <--- each worker keeps taking jobs until `jobs` is closed
                results <- job * 2
            }
        })
    }

    // 2. Send the jobs, then close the channel
    go func() {
        for i := range 10 {
            jobs <- i
        }
        close(jobs)
    }()

    // 3. Close `results` once ALL workers are done
    go func() {
        wg.Wait()
        close(results)
    }()

    // 4. Collect the results
    for result := range results {
        fmt.Println(result)
    }
}
```

Notice the order of closing: `jobs` is closed by its single sender. `results` has **many** senders (the workers), so no single worker can close it. Instead, a separate goroutine waits for all of them, and then closes it.

### - E. Background loop with a ticker

Something that runs every X seconds until shut down (like `setInterval`):

```go
func startHeartbeat(ctx context.Context) {
    ticker := time.NewTicker(5 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            fmt.Println("still alive")
        case <-ctx.Done():
            return
        }
    }
}

// in main:
go startHeartbeat(ctx)
```

---

## 9. Common pitfalls

### - A. Goroutine leaks

A goroutine that is stuck forever (blocked on a channel no one will ever use) **never gets cleaned up**. In a long-running server, they pile up until you run out of memory.

**Before starting any goroutine, ask yourself: "how and when will this goroutine end?"** If you don't have an answer, you have a leak. The usual answers are: a channel gets closed, a context gets cancelled, or the work simply finishes.

### - B. Panics in goroutines crash the entire program

In Node.js, an unhandled promise rejection is (usually) just a warning or one failed request. In Go, **a panic in any goroutine that isn't recovered kills the whole process**. A `recover()` in `main` does **not** catch panics from other goroutines. Each goroutine has to handle its own.

That's one more reason to return `error`s (with `errgroup`) instead of panicking.

### - C. Forgetting that the receiver must exist

Every send on an unbuffered channel needs a receiver. Every `range` over a channel needs someone to `close` it. Draw the flow of data for yourself: **who sends, who receives, who closes.**

### - D. Using concurrency where it isn't needed

Goroutines are cheap, but not free. Concurrent code is harder to read, test, and debug. Spawning a goroutine to add two numbers is slower than just adding them.

---

## 10. When should I use what?

### - A. Should I use concurrency at all?

Use it when you have:

- ✅ **Independent I/O calls** that could be waiting at the same time (calling 3 microservices, querying several DBs).
- ✅ **CPU-heavy work** that can be split into chunks (processing many files or images, big computations). Go will spread it across all cores.
- ✅ **Background work** (heartbeats, polling, cleanup jobs, consuming from a queue).
- ✅ **Serving many clients at once**. Note that `net/http` already runs **each request in its own goroutine** for you, so your handler code can (and should) be plain, synchronous code.

Don't use it when:

- ❌ The steps depend on each other (step 2 needs the result of step 1). Just call them in order.
- ❌ The work is tiny. The overhead outweighs the gain.
- ❌ You're adding it "just in case". Start sequential, measure, and add concurrency where it actually helps.

:::info
**Library tip**: write your functions **synchronously** (return the result and an `error`), and let the caller decide to run them in a goroutine. Don't return channels or spawn goroutines inside a library function unless that's its whole purpose.
:::

### - B. Channels or Mutex?

Both are idiomatic. Pick by what you're doing:

Use a **Mutex** (or `atomic`) when:

- You're **protecting state**: a cache, a counter, a map of connections.
- The code is basically "lock, read or update a value, unlock".

Use a **channel** when:

- You're **passing data or ownership** from one goroutine to another (producer → consumer, jobs → workers).
- You're **signaling events**: "done", "cancel", "a new message arrived".
- You need to **wait on several things at once** (`select`).

Rule of thumb: **if you're moving data, use a channel. If you're guarding data, use a mutex.** If the channel version needs 30 lines and the mutex version needs 5, go with the mutex.

### - C. Quick decision list

| I want to...                                 | Use                                    |
| -------------------------------------------- | -------------------------------------- |
| Run things in the background                 | `go func() { ... }()`                  |
| Wait for a bunch of goroutines               | `sync.WaitGroup`                       |
| Wait for a bunch of goroutines that may fail | `errgroup`                             |
| Limit how many run at once                   | `errgroup.SetLimit` / buffered channel |
| Get a value back from a goroutine            | channel                                |
| Protect a shared variable / map              | `sync.Mutex` / `sync.RWMutex`          |
| A shared counter                             | `sync/atomic`                          |
| Wait for whichever finishes first            | `select`                               |
| A timeout                                    | `context.WithTimeout` / `time.After`   |
| Cancel work that's no longer needed          | `context`                              |
| Process a stream of jobs with N workers      | worker pool (channel + `WaitGroup`)    |

---

## 11. Cheat sheet: JavaScript → Go

| JavaScript                   | Go                                           |
| ---------------------------- | -------------------------------------------- |
| `someAsyncFn()` (no await)   | `go someFn()`                                |
| `await promise`              | `value := <-ch`                              |
| `await Promise.all([...])`   | `sync.WaitGroup` / `errgroup`                |
| `Promise.race([...])`        | `select`                                     |
| `AbortController` / `signal` | `context.WithCancel` / `ctx.Done()`          |
| `setTimeout(fn, ms)`         | `time.AfterFunc(d, fn)`                      |
| `setInterval(fn, ms)`        | `time.NewTicker(d)`                          |
| `p-limit`                    | `errgroup.SetLimit` / buffered channel       |
| `worker_threads`             | not needed. Goroutines already use all cores |
| async iterators / streams    | `for v := range ch`                          |
