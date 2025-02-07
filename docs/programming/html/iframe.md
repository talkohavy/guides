# iframe

## 1. Description

The `<iframe>` HTML element represents a nested **browsing context**, embedding another HTML page into the current one.

## 2. Browsing context

A **browsing context** is an environment in which a browser displays a **Document**. In modern browsers, it usually is a _tab_, but it can be a _window_, a _popup_, a _web application_, or even a part of a page such as a _frame_ or an _iframe_.

Each **browsing context** has an origin (that of the active document) and an ordered history of previously displayed documents. Communication and resource sharing between browsing contexts is constrained, in particular between cross-origin contexts. For example, a `BroadcastChannel` can only be opened and used to communicate between same origin-contexts.

A **browsing context** may be part of a **browsing context group**, which is a set of **browsing contexts** that share common context like history, cookies, storage mechanisms and so on. The browsing contexts within a group retain references to each other and can therefore inspect each other's global objects and post each other messages.

By default, a document opened from a **browser context group** is opened in the same group whether or not it is `cross-origin` or `same-origin`. The `Cross-Origin-Opener-Policy` can be used to control whether the document is instead opened in its own new browsing context group and `cross-origin isolated` from other contexts (in particular cross-origin contexts). The can mitigate the risk of cross-origin attacks and the side-channel attacks referred to as XS-Leaks.

## Back to iframe

Each embedded browsing context has its own `document` and allows URL navigations. The navigations of each embedded browsing context are linearized into the **session history** of the _topmost_ browsing context. The browsing context that embeds the others is called the **parent browsing context**. The _topmost_ browsing context — the one with no parent — is usually the browser window, represented by the Window object.

:::warning
**Warning**: Because each browsing context is a complete document environment, every `<iframe>` in a page requires increased memory and other computing resources. While theoretically you can use as many `<iframe>`s as you like, check for performance problems.
:::

## 3. History

The **History** interface of the _History API_ allows manipulation of the browser _session history_, that is the pages visited in the tab or frame that the current page is loaded in.

There is only one instance of `history` (It is a singleton.) accessible via the global object `history`.

:::note
This interface is only available on the main thread (`Window`). It cannot be accessed in `Worker` or `Worklet` contexts.
:::
