# Acknowledgements

## Introduction

Acknowledgements comes in two flavors:

- With a callback function
- With a Promise

## Type 1: With a callback

### From client to server

**Client**

```ts
socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
  if (err) {
    // the server did not acknowledge the event in the given delay
  } else {
    console.log(response.status); // 'ok'
  }
});
```

**Server**

```ts
io.on('connection', (socket) => {
  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });
});
```

---

### From server to client

**Server**

```ts
io.on('connection', (socket) => {
  socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
    if (err) {
      // the client did not acknowledge the event in the given delay
    } else {
      console.log(response.status); // 'ok'
    }
  });
});
```

**Client**

```ts
socket.on('request', (arg1, arg2, callback) => {
  console.log(arg1); // { foo: 'bar' }
  console.log(arg2); // 'baz'
  callback({
    status: 'ok'
  });
});
```

### Type 2: With a promise

The `emitWithAck()` method provides the same functionality, but returns a Promise which will resolve once the other side acknowledges the event:

### From client to server

**Client**

```ts
try {
  const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
  console.log(response.status); // 'ok'
} catch (e) {
  // the server did not acknowledge the event in the given delay
}
```

**Server**

```ts
io.on('connection', (socket) => {
  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });
});
```

---

### From server to client

**Server**

```ts
io.on('connection', async (socket) => {
  try {
    const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
    console.log(response.status); // 'ok'
  } catch (e) {
    // the client did not acknowledge the event in the given delay
  }
});
```

**Client**

```ts
socket.on('request', (arg1, arg2, callback) => {
  console.log(arg1); // { foo: 'bar' }
  console.log(arg2); // 'baz'
  callback({
    status: 'ok'
  });
});
```
