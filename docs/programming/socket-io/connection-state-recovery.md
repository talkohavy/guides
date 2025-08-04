# Connection state recovery

Connection state recovery is a feature which allows restoring a client's state after a temporary disconnection, including any missed packets.

## Disclaimer

Under real conditions, a Socket.IO client will inevitably experience temporary disconnections, regardless of the quality of the connection.

This feature will help you cope with such disconnections, but unless you want to store the packets and the sessions forever (by setting `maxDisconnectionDuration` to `Infinity`), you can't be assured that the recovery will always be successful.

That's why you will still need to handle the case where the states of the client and the server must be synchronized.

## Usage

Connection state recovery **must be enabled by the server**:

```ts
const io = new Server(httpServer, {
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
});
```

Upon an unexpected disconnection (i.e. no manual disconnection with `socket.disconnect()`), the server will store the `id`, the rooms and the `data` attribute of the socket.

Then upon reconnection, the server will try to restore the state of the client. The `recovered` attribute indicates whether this recovery was successful:

_Server_

```ts
io.on("connection", (socket) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
  } else {
    // new or unrecoverable session
  }
});
```

_Client_

```ts
socket.on("connect", () => {
  if (socket.recovered) {
    // any event missed during the disconnection period will be received now
  } else {
    // new or unrecoverable session
  }
});
```

You can check that the recovery is working by forcefully closing the underlying engine:

```ts
import { io } from "socket.io-client";

const socket = io({
  reconnectionDelay: 10000, // defaults to 1000
  reconnectionDelayMax: 10000 // defaults to 5000
});

socket.on("connect", () => {
  console.log("recovered?", socket.recovered);

  setTimeout(() => {
    if (socket.io.engine) {
      // close the low-level connection and trigger a reconnection
      socket.io.engine.close();
    }
  }, 10000);
});
```

## Compatibility with existing adapters

| Adapter                      | Support?                       |
| ---------------------------- | ------------------------------ |
| Built-in adapter (in memory) | YES ✅                         |
| Redis adapter                | NO                             |
| Redis Streams adapter        | YES ✅                         |
| MongoDB adapter              | YES ✅ (since version `0.3.0`) |
| Postgres adapter             | WIP                            |
| Cluster adapter              | WIP                            |

## How it works under the hood

- the server sends a session ID `during the handshake` (which is different from the current id attribute, which is public and can be freely shared)

Example:

```bash
40{"sid":"GNpWD7LbGCBNCr8GAAAB","pid":"YHcX2sdAF1z452-HAAAW"}

where

4         => the Engine.IO message type
0         => the Socket.IO CONNECT type
GN...AB   => the public id of the session
YH...AW   => the private id of the session
```

- the server also includes an offset in _each packet_ (added at the end of the data array, for backward compatibility)

Example:

```bash
42["foo","MzUPkW0"]

where

4         => the Engine.IO message type
2         => the Socket.IO EVENT type
foo       => the event name (socket.emit("foo"))
MzUPkW0   => the offset
```

:::note
For the recovery to succeed, the server must send at least one event, in order to initialize the offset on the client side.

:::

- upon temporary disconnection, the server stores the client state for a given delay (implemented at the adapter level)
- upon reconnection, the client sends both the session ID and the last offset it has processed, and the server tries to restore the state

Example:

```bash
40{"pid":"YHcX2sdAF1z452-HAAAW","offset":"MzUPkW0"}

where

4         => the Engine.IO message type
0         => the Socket.IO CONNECT type
YH...AW   => the private id of the session
MzUPkW0   => the last processed offset
```
