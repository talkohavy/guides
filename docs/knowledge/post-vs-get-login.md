# Why use POST and not GET for login requests?

The reason is **security**, **data size**, and **HTTP protocol semantics**.

## 1. **Security Concerns (Sensitive Data in the Body vs. URL)**

- **Sensitive Data Exposure**: **GET** uses query params. Query params are part of the url. Urls are usually logged, wether it in browser history, server logs, or intermediary proxies. As a result, sensitive information like usernames and passwords could be exposed in these logs, which is a major security risk.
- **POST** sends the data in the request body, which **does not get logged in URLs** or browser history. This makes it a safer way to transmit sensitive data like passwords.

## 2. **Semantics of HTTP Methods**

- **GET**: According to the HTTP specification, a **GET** request is used to **retrieve data**. It's **idempotent**, meaning that multiple requests should not have side effects (such as changing data on the server). When you log in, you're attempting to **authenticate** the user and **alter** their session state on the server, which is a state-changing operation.
- **POST**: A **POST** request is used to **submit data** that **modifies** the state on the server (like creating a session or logging the user in). It's a more appropriate method for a log in action.

## 3. **URL Length Limits**

- **GET** requests have a **URL length limit**, which is typically around 2,000 characters in most browsers. **POST** does not have this limitation.

## 4. **Caching and Bookmarking**

- **GET** requests are **cacheable** and can be bookmarked. This could lead to unintended consequences if login requests were cached, as it would expose the login data in URLs that could be reused or shared accidentally. On the other hand, **POST** requests are **not cacheable** and cannot be bookmarked, which makes them more suitable for actions like logging in. Now before you say anything, Yes, it's technically possible to cache POST requests, you can write a server that caches POST requests. However, when I say that POST requests are not cacheable, I'm referring to the default behavior and conventions established by the HTTP/1.1 specs and typical web infrastructure, including caching mechanisms in browsers and CDNs.
