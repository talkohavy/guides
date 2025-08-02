# What Engine.IO brings to the table?

## 1. Handshake

At the beginning of the Engine.IO connection, the server sends some information:

```json
{
  "sid": "FSDjX-WRwSA4zTZMALqx",
  "upgrades": ["websocket"],
  "pingInterval": 25000,
  "pingTimeout": 20000
}
```

- the `sid` is the ID of the session, it must be included in the `sid` query parameter in all subsequent HTTP requests
- the `upgrades` array contains the list of all "better" transports that are supported by the server
- the `pingInterval` and `pingTimeout` values are used in the [heartbeat mechanism](#heartbeat-mechanism)

## 2. Upgrade mechanism

By default, the client establishes the connection with the HTTP long-polling transport.

**But, why?**

While WebSocket is clearly the best way to establish a bidirectional communication, experience has shown that **it is not always possible to establish a WebSocket connection**, due to **corporate proxies, personal firewall, antivirus software**...

From the user perspective, **an unsuccessful WebSocket connection can translate in up to 10 seconds of waiting** for the realtime application to begin exchanging data. **This hurts user experience**.

To summarize, **Engine.IO focuses on reliability and user experience first**, and marginal potential UX improvements and increased server performance second.

To upgrade, the client will:

- ensure its outgoing buffer is empty
- put the current transport in read-only mode
- try to establish a connection with the other transport
- if successful, close the first transport

## 3. Disconnection detection

The Engine.IO connection is considered as closed when:

- one HTTP request (either GET or POST) fails (for example, when the server is shutdown)
- the WebSocket connection is closed (for example, when the user closes the tab in its browser)
- `socket.disconnect()` is called on the server-side or on the client-side

There is also a heartbeat mechanism which checks that the connection between the server and the client is still up and running.

## 4. Heartbeat mechanism

1.  At a given interval (the `pingInterval` value sent in the handshake) the server sends a PING packet.
2.  The client has a few seconds (the `pingTimeout` value) to send a PONG packet back.
3.  If the server does not receive a PONG packet back, it will consider that the connection is closed.
4.  Conversely, if the client does not receive a PING packet within `pingInterval + pingTimeout`, it will consider the connection as closed.
