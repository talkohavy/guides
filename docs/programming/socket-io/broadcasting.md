# Broadcasting

Send an event to everyone:

```ts
// this will emit the event to all connected sockets
io.emit('hello', 'world');
```

Send to everyone except the emitting socket:

```ts
io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});
```
