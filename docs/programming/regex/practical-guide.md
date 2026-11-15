# Practical Guide

:::info
Every question below is a "Get all instances of" query. Every "Get" query can turn into an "Is there? / Are there?" question, with just a matter of flipping the string and the regex, and using the `test` function which returns a boolean.

For example:

```ts
const str = "hello world";
const regex = /hello/
// The "Get" question would be:
str.match(regex);
// The "Is there?" question:
regex.test(str);
```

If the `match` operation **were to return `null`**, the `test` operation **would return `false`**.  
If the `match` operation **were to return an array**, the `test` operation **would return `true`**.

:::

## 1. Exact word

Query: Get all instances of exact word

Pure regex:

```ts
/world/
```

In JavaScript:

```ts
"hello world".match(/world/g);
// returns: ['world']
```

---

## 2. Exactly 1 character (any char)

Query: Get all instances of exactly 1 character (any char) which is inside a curly braces

Pure regex:

```ts
/{.}/
```

In JavaScript:

```ts
"{a}sd s{1}d s{_}d s{!}d s{ }d".match(/{.}/g);
// returns: (3) ['{a}', '{1}', '{_}']
```

---

## 3. Exactly 1 character (alphanumeric + \_)

Query: Get all instances of exactly 1 character (number / letter / underscore) which inside a curly braces

Pure regex:

```ts
/{\w}/
```

In JavaScript:

```ts
"{a}sd s{1}d s{_}d s{!}d s{ }d".match(/{\w}/g);
// returns: (3) ['{a}', '{1}', '{_}']
```

---

## 4. At least 1 character

Query: Get all instances of at least 1 character inside a curly braces

Pure regex:

```ts
/{.+}/
```

In JavaScript:

```ts
"{a}sd s{1}d s{_}d s{!}d s{ }d ggg{}".match(/{.+?}/g);
// returns: ['{a}sd s{1}d s{_}d s{!}d s{ }']
```

Notice!

You've expected to get: `['{a}', '{1}', '{_}', '{!}', '{ }']`, but instead got 1 long string! That is because the `.` operation is **eager**! It tries the longest possible match.

To make it find every one of those matches, you need to add a `?` after the `+`:

```ts
"{a}sd s{1}d s{_}d s{!}d s{ }d".match(/{.+?}/g);
// returns: (5) ['{a}', '{1}', '{_}', '{!}', '{ }']
```
