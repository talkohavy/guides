# time

## 1. What is `time`?

`time` is the package for **dates, times, and durations**: getting the current time, measuring how long something took, waiting, and formatting dates.

```go
import "time"
```

It's built around two types, and it's worth getting them straight from the start:

- **`time.Time`**: a moment in time. "November 17, 2026 at 14:30".
- **`time.Duration`**: a length of time. "90 minutes".

---

## 2. Durations

### - A. Creating a duration

The package has constants for each unit, and you create durations by multiplying them:

```go
time.Second
500 * time.Millisecond
90 * time.Minute            // <--- prints as 1h30m0s
2*time.Hour + 30*time.Minute // <--- prints as 2h30m0s
```

The available units: `time.Nanosecond`, `time.Microsecond`, `time.Millisecond`, `time.Second`, `time.Minute`, `time.Hour`. (There's no `time.Day`, because not every day has 24 hours, thanks to daylight saving time.)

You can also parse a duration from a string, which is handy for config files:

```go
d, err := time.ParseDuration("1h15m30s") // <--- 1h15m30s <nil>
```

### - B. Reading a duration

```go
d := 90 * time.Minute

d.Hours()   // <--- 1.5
d.Minutes() // <--- 90
```

`Seconds()`, `Hours()` and `Minutes()` return a `float64`. `Milliseconds()` returns an `int64`.

### - C. Gotcha: multiplying by a variable

This works:

```go
time.Sleep(3 * time.Second)
```

But this doesn't:

```go
n := 3
time.Sleep(n * time.Second) // <--- Error! ❌
```

> invalid operation: n \* time.Second (mismatched types int and time.Duration)

Why does the first one work? Because `3` is a constant without a fixed type, so Go can treat it as a `Duration`. But `n` is a variable of type `int`, and Go never mixes types automatically. Convert it yourself:

```go
time.Sleep(time.Duration(n) * time.Second) // <--- ✅
```

---

## 3. `Sleep`: pause execution

```go
fmt.Println("Uploading...")
time.Sleep(2 * time.Second)
fmt.Println("Done!")
```

`Sleep` pauses the **current goroutine** for the given duration.

**Note:** `Sleep` is fine for simulating slow work in examples, or for adding a delay between retries. But don't use it to "wait" for other goroutines to finish. That's what `sync.WaitGroup` is for (see [Concurrency](../concurrency.md)).

---

## 4. `Now` & `Since`: measuring how long something took

### - A. Basic usage

```go
start := time.Now()

doSomeWork()

elapsed := time.Since(start)
fmt.Println("This took:", elapsed) // <--- This took: 1.501483s
```

`time.Since(start)` returns a `time.Duration` (not a number of milliseconds), and it prints itself in a human-friendly format: `1.501483s`, `250ms`, `2m3s`, etc.

### - B. Rounding the result

The raw duration is often too precise to be readable. Round it:

```go
elapsed.Round(time.Millisecond) // <--- 1.501s
elapsed.Truncate(time.Second)   // <--- 1s
```

---

## 5. Working with dates

### - A. Creating a `time.Time`

```go
now := time.Now()

t := time.Date(2026, time.November, 17, 14, 30, 0, 0, time.UTC)
fmt.Println(t) // <--- 2026-11-17 14:30:00 +0000 UTC
```

The arguments of `time.Date` are: year, month, day, hour, minute, second, nanosecond, and time zone.

### - B. Reading parts of it

```go
t.Year()    // <--- 2026
t.Month()   // <--- November
t.Day()     // <--- 17
t.Weekday() // <--- Tuesday
t.Hour()    // <--- 14
t.Unix()    // <--- 1794925800 (seconds since January 1st, 1970)
```

### - C. Date math

```go
tomorrow := t.Add(24 * time.Hour)  // <--- add a Duration
nextMonth := t.AddDate(0, 1, 0)    // <--- add years, months, days

christmas := time.Date(2026, time.December, 25, 0, 0, 0, 0, time.UTC)
fmt.Println(christmas.Sub(t))      // <--- 897h30m0s (the Duration between two times)
```

**Use `AddDate` for days, months and years.** It knows that months have different lengths.

### - D. Comparing

```go
t.Before(christmas) // <--- true
t.After(christmas)  // <--- false
t.Equal(t)          // <--- true
```

**Use `Equal` to compare times, not `==`**. Two `Time` values can represent the same moment, but in different time zones, and `==` would say they're different.

---

## 6. Formatting & parsing dates

### - A. The weird part: the reference date

Most languages format dates with codes like `YYYY-MM-DD`. Go doesn't. Instead, you write out **one specific date**, in the format you want:

> **Mon Jan 2 15:04:05 MST 2006**

Every part of it is a different number, and that's how Go knows which part is which:

| Part   | Value  | Easy way to remember |
| ------ | ------ | -------------------- |
| Month  | `01`   | 1                    |
| Day    | `02`   | 2                    |
| Hour   | `15`   | 3 (PM)               |
| Minute | `04`   | 4                    |
| Second | `05`   | 5                    |
| Year   | `2006` | 6                    |

So the layout is just "1 2 3 4 5 6", written in whatever format you need.

### - B. `Format`: time to string

```go
t.Format("2006-01-02")                 // <--- "2026-11-17"
t.Format("02/01/2006 15:04")           // <--- "17/11/2026 14:30"
t.Format("Mon, Jan 2 2006 at 3:04 PM") // <--- "Tue, Nov 17 2026 at 2:30 PM"
```

There are also ready-made layouts, so you don't have to remember them:

```go
t.Format(time.DateOnly) // <--- "2026-11-17"
t.Format(time.DateTime) // <--- "2026-11-17 14:30:00"
t.Format(time.TimeOnly) // <--- "14:30:00"
t.Format(time.RFC3339)  // <--- "2026-11-17T14:30:00Z" (the standard for APIs and JSON)
```

**Gotcha:** if you use any other date as the layout, you get garbage, and no error:

```go
t.Format("2026-11-17") // <--- "17176-1111-117" ❗
```

### - C. `Parse`: string to time

`Parse` uses the same kind of layout, to describe what the input looks like:

```go
t, err := time.Parse("2006-01-02", "2026-12-25")
fmt.Println(t) // <--- 2026-12-25 00:00:00 +0000 UTC
```

If the input doesn't match the layout, you get an error:

```go
_, err := time.Parse("2006-01-02", "25/12/2026")
fmt.Println(err)
// parsing time "25/12/2026" as "2006-01-02": cannot parse "25/12/2026" as "2006"
```

---

## 7. Cheat sheet

| Function / method              | What it does                          |
| ------------------------------ | ------------------------------------- |
| `time.Now()`                   | The current time                      |
| `time.Since(t)`                | Duration since `t` (for measuring)    |
| `time.Sleep(d)`                | Pause for a duration                  |
| `time.Date(...)`               | Create a specific time                |
| `time.ParseDuration(s)`        | String like `"1h30m"` to a `Duration` |
| `d.Round(unit)`                | Round a duration, for readability     |
| `t.Add(d)` / `t.AddDate()`     | Move a time forward (or backward)     |
| `t2.Sub(t1)`                   | Duration between two times            |
| `t.Before` / `After` / `Equal` | Compare two times                     |
| `t.Format(layout)`             | Time to string (layout: `2006-01-02`) |
| `time.Parse(layout, s)`        | String to time                        |
