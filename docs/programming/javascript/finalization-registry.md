# FinalizationRegistry

## Description

A `FinalizationRegistry` object lets you set a callback when a value is garbage-collected.

`FinalizationRegistry` provides a way to request that a _cleanup callback_ get called at some point when a value registered with the registry has been reclaimed (garbage-collected). (Cleanup callbacks are sometimes called _finalizers_.)

:::note
Note: Cleanup callbacks should not be used for essential program logic.
:::

## Usage

You create the registry passing in the callback:

```js
const registry = new FinalizationRegistry((heldValue) => {
  // …
});
```

Then you register any value you want a cleanup callback for by calling the register method, passing in the value and a held value for it:

```js
registry.register(target, "some value");
```

The registry does not keep a strong reference to the value, as that would defeat the purpose (if the registry held it strongly, the value would never be reclaimed). In JavaScript, objects and non-registered symbols are garbage collectable, so they can be registered in a `FinalizationRegistry` object as the target or the token.

If `target` is reclaimed, your cleanup callback may be called at some point with the held value you provided for it ("some value" in the above). The held value can be any value you like: a primitive or an object, even `undefined`. If the held value is an object, the registry keeps a strong reference to it (so it can pass it to your cleanup callback later).

If you might want to unregister a registered target value later, you pass a third value, which is the _unregistration token_ you'll use later when calling the registry's `unregister` function to unregister the value. The registry only keeps a weak reference to the unregister token.

```js
registry.register(target, "some value", target);
// …

// some time later, if you don't care about `target` anymore, unregister it
registry.unregister(target);
```

It doesn't have to be the same value, though; it can be a different one:

```js
registry.register(target, "some value", token);
// …

// some time later
registry.unregister(token);
```

## Avoid where possible

Correct use of `FinalizationRegistry` takes careful thought, and it's best avoided if possible. It's also important to avoid relying on any specific behaviors not guaranteed by the specification. When, how, and whether garbage collection occurs is down to the implementation of any given JavaScript engine. Any behavior you observe in one engine may be different in another engine, in another version of the same engine, or even in a slightly different situation with the same version of the same engine. Garbage collection is a hard problem that JavaScript engine implementers are constantly refining and improving their solutions to.

Developers shouldn't rely on cleanup callbacks for essential program logic. Cleanup callbacks may be useful for reducing memory usage across the course of a program, but are unlikely to be useful otherwise.
