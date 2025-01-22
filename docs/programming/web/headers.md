# Headers

## 1. What can HTTP Headers affect?

Headers can affect:

- How the **browser** processes the response.
- How the **server** interprets the request.
- The **security**, **caching**, and **performance** of web applications.

## 2. Categories of Headers

Headers can generally be grouped into these categories:

1. **Request Headers**: Sent by the client (browser). They provide information about the request or the client itself.
2. **Response Headers**: Sent by the server. They provide _metadata_ about the response.
3. **General Headers**: Sent by either the client or the server. They do not describe the body of the message.
4. **Entity Headers**: Provide information about the body of the request or response.

## 3. Key Headers and Their Roles

A. Security-Related Headers

Security headers play a crucial role in protecting both the client and the server:

- Content-Security-Policy (CSP): Controls which resources (scripts, images, styles) the browser can load. Helps mitigate XSS attacks.
  - Example: Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com

* Strict-Transport-Security (HSTS): Forces the browser to interact with the server over HTTPS only.

  - Example: Strict-Transport-Security: max-age=31536000; includeSubDomains

* X-Content-Type-Options: Prevents MIME-type sniffing, ensuring that files are served with the correct type.

  - Example: X-Content-Type-Options: nosniff

* X-Frame-Options: Prevents the site from being embedded in an iframe, mitigating clickjacking.

  - Example: X-Frame-Options: DENY

* Referrer-Policy: Controls the amount of referrer information sent with requests.
  - Example: Referrer-Policy: no-referrer-when-downgrade

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
