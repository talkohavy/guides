# HTTP messages

HTTP messages are the mechanism used to exchange data between a server and a client in the HTTP protocol. There are two types of messages: requests sent by the client to trigger an action on the server, and responses, the answer that the server sends in response to a request.

Developers rarely, if ever, build HTTP messages from scratch. Applications such as a browser, proxy, or web server use software designed to create HTTP messages in a reliable and efficient way. How messages are created or transformed is controlled via APIs in browsers, configuration files for proxies or servers, or other interfaces.

In HTTP protocol versions up to HTTP/2, messages are text-based, and are relatively straightforward to read and understand after you've familiarized yourself with the format. In HTTP/2, messages are wrapped in binary framing, which makes them slightly harder to read without certain tools. However the underlying semantics of the protocol are the same, so you can learn the structure and meaning of HTTP messages based on the text-based format of HTTP/1.x messages, and apply this understanding to HTTP/2 and beyond.

## Anatomy of an HTTP message

To understand how HTTP messages work, we'll look at HTTP/1.1 messages and examine the structure. The following illustration shows what messages in HTTP/1.1 look like:

![http overview](/img/http-message-anatomy.svg)

Both requests and responses share a similar structure:

1. A _start-line_ is a single line that describes the:
   - HTTP version
   - the request method (for a request), or the outcome of the request (for a response).
2. An optional set of _HTTP headers_ containing metadata that describes the message.
3. An empty line indicating the metadata of the message is complete.
4. An optional body containing data associated with the message.

## HTTP request message

```bash
POST /users HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 50

name=FirstName%20LastName&email=bsmth%40example.com

```

The start-line is called a **request-line** and is made of three parts:

```
<method> <request-target> <protocol>
```

In HTTP/2 and above, the protocol version isn't included in messages since it is understood from the connection setup.

## HTTP response message

```bash
HTTP/1.1 201 Created
Content-Type: application/json
Location: http://example.com/users/123

{
  "message": "New user created",
  "user": {
    "id": 123,
    "firstName": "Example",
    "lastName": "Person",
    "email": "bsmth@example.com"
  }
}

```

The start-line is called a **status line** in responses, and has three parts:

```
<protocol> <status-code> <status-text>
```

## Response body

A response body is included in most messages when responding to a client. In successful requests, the response body contains the data that the client asked for in a GET request. If there are problems with the client's request, it's common for the response body to describe why the request failed, and hint as to whether it's permanent or temporary.

Response bodies may be:

- Single-resource bodies defined by the two headers: `Content-Type` and `Content-Length`, or of unknown length and encoded in chunks with `Transfer-Encoding` set to `chunked`.

- Multiple-resource bodies, consisting of a body that contains multiple parts, each containing a different piece of information. Multipart bodies are typically associated with HTML Forms, but may also be sent in response to Range requests.
