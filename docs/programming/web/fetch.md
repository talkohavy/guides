# Fetch API

## Setting headers

Request headers give the server information about the request: for example, the Content-Type header tells the server the format of the request's body.

To set request headers, assign them to the headers option.

You can pass an object literal here containing header-name: header-value properties:

```js
const response = await fetch('https://example.org/post', {
  headers: {
    'Content-Type': 'application/json',
  },
  // ...
});
```

Alternatively, you can construct a `Headers` object, add headers to that object using `Headers.append()`, then assign the Headers object to the headers option:

```js
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const response = await fetch("https://example.org/post", {
  headers: myHeaders,
  // ...
});
```

Many headers are set automatically by the browser and can't be set by a script: these are called Forbidden header names. If the `mode` option is set to `no-cors`, then the set of permitted headers is further restricted.

## Forbidden header names
