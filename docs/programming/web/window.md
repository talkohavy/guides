# Window

## `window.self` & WindowProxy

- `window.self` === `window`
- `self` is just a reference to the **global** `window` **object** in browsers.
- `WindowProxy` is an internal mechanism that makes things like iframes and cross-origin windows _appear_ like windows, while actually handling some safety and redirection under the hood.

**So what's self?**

In the browser:

```js
console.log(self === window); // true
```

It's literally just another name for `window`. People often use `self` inside web workers (where there's no `window`), but in the main thread, it's basically the same as `window`.

So this:

```js
if (window.self === window.top) {
  console.log('This window is not in an iframe.');
}
```

...is a way to check if you're not inside an iframe.

**Then what the heck is `WindowProxy`?**

That's where things get weird and internal.

When you access `window.frames[0]` or `window.open(...)`, you get back an object that _looks_ like a window, but it's actually a `WindowProxy`.  
**A `WindowProxy` is like a magic wrapper** that forwards your calls to the actual `Window` object - but only if you're allowed to.

**Why?**

- It helps enforce **cross-origin security**.
- If you try to access properties on a window from another domain, the proxy can block you.
- If the frame navigates to another page (even the same origin), the proxy stays the same, but the underlying `Window` object changes.

The idea is: **the thing you have a reference to is stable** (`WindowProxy`), even though what's behind it might change (`Window`).

**Bottom line**

You almost never have to worry about `WindowProxy` directly unless you're doing iframe or cross-origin work. If you're just wondering what `self` is — it's a simple alias for `window`. Nothing fancy. Just the beginning of a deep dive 😄

## `window.open()`

The open() method of the Window interface loads a specified resource into a new or existing browsing context (that is, a tab, a window, or an iframe) under a specified name.

### Syntax

```js
open()
open(url)
open(url, target)
open(url, target, windowFeatures)
```

---

## `window.parent`

The `Window.parent` property is a reference to the parent of the current window or subframe.

If a window does not have a parent, its parent property is a reference to itself.

When a window is loaded in an `<iframe>`, `<object>`, or `<frame>`, its parent is the window with the element embedding the window.

---

## `window.top`

Returns a reference to the topmost window in the window hierarchy.

---

## `window.isSecureContext`

`window.isSecureContext` returns true when the page is being served in a secure context, which usually means:

- The page is served over **HTTPS**
- Or it's running on **localhost** (which is treated as secure)
