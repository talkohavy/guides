# SocketIO V.S. WebSockets

## Feature 1: HTTP long-polling fallback

The connection will fall back to HTTP long-polling in case the WebSocket connection cannot be established.

This feature was the #1 reason people used Socket.IO when the project was created more than ten years ago (!), nad it still is to this day.

## Feature 2: Automatic reconnection

Under some particular conditions, the WebSocket connection between the server and the client can be interrupted with both sides being unaware of the broken state of the link.

**That's why Socket.IO includes a heartbeat mechanism**, which periodically checks the status of the connection.

And when the client eventually gets disconnected, it automatically reconnects with an exponential back-off delay, in order not to overwhelm the server.

## Feature 3: Packet buffering

The packets are automatically buffered when the client is disconnected, and will be sent upon reconnection.

## Feature 4: Acknowledgements

Socket.IO provides a convenient way to send an event and receive a response. You can even **add a timeout** in which the event has to end or else it's considered as not acknowledged.

## Feature 5: Broadcasting

On the server-side, you can send an event to **all connected clients** or to a **subset of clients**:

```ts
// to all connected clients
io.emit("hello");

// to all connected clients in the "news" room
io.to("news").emit("hello");
```

This also works when scaling to multiple nodes.

## Feature 6: Multiplexing (namespaces)

Namespaces allow you to split the logic of your application over a single shared connection. This can be useful for example if you want to create an "admin" channel that only authorized users can join.

```ts
io.on("connection", (socket) => {
  // classic users
});

io.of("/admin").on("connection", (socket) => {
  // admin users
});
```
