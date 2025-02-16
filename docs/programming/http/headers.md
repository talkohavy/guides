# HTTP Headers

![request headers](/img/request-headers.svg)

Some headers are exclusively used in requests, while others can be sent in both requests and responses, or might have a more specific categorization:

- Request headers provide additional context to a request or add extra logic to how it should be treated by a server (e.g., conditional requests).

- Representation headers are sent in a request if the message has a body, and they describe the original form of the message data and any encoding applied. This allows the recipient to understand how to reconstruct the resource as it was before it was transmitted over the network.

![response headers](/img/response-headers.svg)

Like request headers, there are many different headers that can appear in responses, and they are categorized as:

- Response headers that give additional context about the message or add extra logic to how the client should make subsequent requests. For example, headers like `Server` include information about the server software, while `Date` includes when the response was generated. There is also information about the resource being returned, such as its content type (`Content-Type`), or how it should be cached (`Cache-Control`).

- Representation headers if the message has a body, they describe the form of the message data and any encoding applied. For example, the same resource might be formatted in a particular media type such as XML or JSON, localized to a particular written language or geographical region, and/or compressed or otherwise encoded for transmission. This allows a recipient to understand how to reconstruct the resource as it was before it was transmitted over the network.
