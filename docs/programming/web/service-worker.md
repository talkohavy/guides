# Service Worker

## Quick comparison - Web Worker V.S. Service Worker

**Service Workers** are a special type of **Web Workers**.

**Service Workers** also run on a background thread, decoupled from the DOM, however, as opposed to **Web Workers**, they do not die after the page is closed, they keep on living/running - depending on the operating system.

---

## Motivation

**Service Workers** are basically javascript running in a background process.

**Service Workers** is a technology that allows us to cache some resources in our application, and make our website available offline because we cached those resources.

**Service Workers** also allow us to make interactions with the offline website, save data from those interactions, so that when we come back online we can send this data to the server.

---

## Core Building Blocks

- Service Workers
- Background Synchronization
- Web Push
- Application Manifest
- Geo location API
- Media API

---

## Important to know

Service workers also run on a single thread, separate from the thread running the normal javascript code from your html page. They have their own thread.

- Service Workers run on an additional thread, **decoupled** from HTML pages.
- Service Workers have a certain scope where they apply to (i.e. the domain of your page).
- The initial registration of a worker is done by normal javascript coming from your HTML.
- Service Workers continue to live on even after pages have been closed, or sometimes for example on mobile phones, even after you close off the browser.
- Service Workers are processes that run in the background.
- Service Workers cannot interact with the DOM.
- Service Workers are not attached to a page.
- Service Workers are all about events, they react to events.
- Service Workers only work on HTTPS. `localhost` is an exception to that rule.

---

## Service Worker Events

### - `fetch`

It is triggered whenever the browser initiates a fetch (http) request.

It is worth mentioning:

- an `img` tag sends a fetch request, which triggers the `fetch` event.
- `XMLHttpRequest` does not trigger a `fetch` event.
- The `Axios` package is built upon `XMLHttpRequest`, hence won't trigger the `fetch` event.

Since most requests go through the service worker (as soon as you start listening at least), you have ways of manipulating these requests, you can block them, you can return cached assets, etc.

### - `push notifications`

Every browser window has its own push web push server.

You can send push notifications to these servers from your own server, and then these vendor service of the browser vendors will send this push notifications to your client application. And in the service worker you can listen for such a push event

### - `notification interaction`

If a user interacts with a notification, for example he taps on the notification, you can also listen to that interaction in the service worker, to do something with it, i.e. show an example page, load something from the cache, whatever you wanna do. So you can react to user interaction with notifications in the service worker.

### - `background synchronization`

Imagine you don't have a really good internet connection, and you just happened to send a post. Now if the internet connection is bad, that will fail. Now some browsers allow you to use background synchronization, which means you store a certain action, if it can't be executed right now, and you execute it once internet connection has been reestablished.

---

## Service Worker Lifecycle

...
