# Web Worker

## Motivation

Since javascript is a single threaded it is difficult to make heavy long computations because the whole browser is frozen.

The best solution to fix it, is move any heavy logic to be calculated on the backend. It is always preferred to put the load on the server, and not on the browser of the client. but it is not always possible, and that's when we can use **web workers**.

The main idea is to instantiate a **web worker**, start calculations there, and when those calculations are ready, it'll notify our application that it's done.

The benefits from that is that the main thread won't be blocked, and as a result our website would still be working.

## Create a Web Worker
