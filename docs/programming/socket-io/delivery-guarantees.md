# Delivery Guarantees

## 1. Message ordering

**Socket.IO guarantees message ordering**, no matter which low-level transport is used (even during an upgrade from HTTP long-polling to WebSocket).

This is achieved thanks to:

- the guarantees provided by the underlying TCP connection
- the careful design of the **upgrade mechanism**

## 2. Message arrival

### - At most once

By default, Socket.IO provides an **at most once** guarantee of delivery:

- If the **connection is broken while an event is being sent**, then there is no guarantee that the other side has received it and there will be no retry upon reconnection
- a disconnected client will **buffer events until reconnection** (though the previous point still applies)
- **There is no such buffer on the server!**, which means that any event that was missed by a disconnected client will not be transmitted to that client upon reconnection

:::info
As of now, additional delivery guarantees must be implemented in your application.

:::

### - At least once

#### From client to server

From the client side, you can achieve an at least once guarantee with the `retries` option:

```ts
const socket = io({
  retries: 3,
  ackTimeout: 10000
});
```

The client will try to send the event (up to `retries + 1` times), until it gets an acknowledgement from the server.

:::caution
Even in that case, any pending event will be lost if the user refreshes its tab.

:::

#### From server to client

For events sent by the server, additional delivery guarantees can be implemented by:

- assigning a unique ID to each event
- persisting the events in a database
- storing the offset of the last received event on the client side, and send it upon reconnection

Example:

_Client_

```ts
const socket = io({
  auth: {
    offset: undefined
  }
});

socket.on("my-event", ({ id, data }) => {
  // do something with the data, and then update the offset
  socket.auth.offset = id;
});
```

_Server_

```ts
io.on("connection", async (socket) => {
  const offset = socket.handshake.auth.offset;
  if (offset) {
    // this is a reconnection
    for (const event of await fetchMissedEventsFromDatabase(offset)) {
      socket.emit("my-event", event);
    }
  } else {
    // this is a first connection
  }
});

setInterval(async () => {
  const event = {
    id: generateUniqueId(),
    data: new Date().toISOString()
  }

  await persistEventToDatabase(event);
  io.emit("my-event", event);
}, 1000);
```
