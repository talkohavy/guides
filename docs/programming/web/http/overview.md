# An overview of HTTP

# TLDR;

- HTTP is a **protocol** for **fetching resources**.
- HTTP is a client-server protocol.
- HTTP is an extensible protocol.
- HTTP is an application layer protocol that is sent over TCP.
- HTTP is generally designed to be simple and human-readable.
- HTTP is stateless, but not sessionless. However, while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions.
- HTTP requires the underlying transport protocol to be reliable, (not lose messages, or at least present an error in such cases). Among the two most common transport protocols on the Internet, **TCP** is reliable and **UDP** isn't. HTTP therefore relies on the TCP standard, which is connection-based.
- Before a client and server can exchange an HTTP request/response pair, they must establish a TCP connection, a process which requires several round-trips.
- The default behavior of HTTP/1.0 is to open a separate TCP connection for each HTTP request/response pair. This is less efficient than sharing a single TCP connection when multiple requests are sent in close succession.

# Description

HTTP is a **protocol** for **fetching resources** such as HTML documents.

It is the foundation of any data exchange on the Web and it is a client-server protocol, which means requests are initiated by the recipient, usually the Web browser. A complete document is typically constructed from resources such as text content, layout instructions, images, videos, scripts, and more.

Look at the drawing below:

![http overview](/img/fetching-a-page.svg)

- the client requests the page (index.html).
- the html contains fetchable tags.
- the client requests css, images, & videos that are on the page.
- the client can also request resources on a different server.

Clients and servers communicate by exchanging individual messages (as opposed to a stream of data). The messages sent by the client are called **requests** and the messages sent by the server as an answer are called **responses**.

## Background

Designed in the early 1990s, HTTP is an extensible protocol which has evolved over time. It is an application layer protocol that is sent over TCP, or over a TLS-encrypted TCP connection, though any reliable transport protocol could theoretically be used. Due to its extensibility, it is used to not only fetch hypertext documents, but also images and videos or to post content to servers, like with HTML form results. HTTP can also be used to fetch parts of documents to update Web pages on demand.

## Components of HTTP-based systems

### Client: the user-agent

The **user-agent** is any tool that acts on behalf of the user. This role is primarily performed by the Web browser, but it may also be performed by programs used by engineers and Web developers to debug their applications.

The browser is **always** the entity initiating the request. It is never the server (though some mechanisms have been added over the years to simulate server-initiated messages).

To display a Web page, the browser sends an original request to fetch the HTML document that represents the page. It then parses this file, making additional requests corresponding to execution scripts, layout information (CSS) to display, and sub-resources contained within the page (usually images and videos). The Web browser then combines these resources to present the complete document, the Web page. Scripts executed by the browser can fetch more resources in later phases and the browser updates the Web page accordingly.

A Web page is a hypertext document. This means some parts of the displayed content are links, which can be activated (usually by a click of the mouse) to fetch a new Web page, allowing the user to direct their user-agent and navigate through the Web. The browser translates these directions into HTTP requests, and further interprets the HTTP responses to present the user with a clear response.

### The Web server

On the opposite side of the communication channel is the server, which **serves** the document as requested by the client. A server appears as only a single machine virtually; but it may actually be a collection of servers sharing the load (load balancing), or other software (such as caches, a database server, or e-commerce servers), totally or partially generating the document on demand.

### Proxies

Between the Web browser and the server, numerous computers and machines relay the HTTP messages. Due to the layered structure of the Web stack, most of these operate at the transport, network or physical levels, becoming transparent at the HTTP layer and potentially having a significant impact on performance. Those operating at the application layers are generally called proxies. These can be transparent, forwarding on the requests they receive without altering them in any way, or non-transparent, in which case they will change the request in some way before passing it along to the server. Proxies may perform numerous functions:

- caching (the cache can be public or private, like the browser cache)
- filtering (like an antivirus scan or parental controls)
- load balancing (to allow multiple servers to serve different requests)
- authentication (to control access to different resources)
- logging (allowing the storage of historical information)

## Basic aspects of HTTP

### HTTP is simple

HTTP is generally designed to be simple and human-readable, even with the added complexity introduced in HTTP/2 by encapsulating HTTP messages into frames. HTTP messages can be read and understood by humans, providing easier testing for developers, and reduced complexity for newcomers.

### HTTP is extensible

Introduced in HTTP/1.0, **HTTP headers** make this protocol easy to extend and experiment with. New functionality can even be introduced by an agreement between a client and a server about a new header's semantics.

### HTTP is stateless, but not sessionless

HTTP is stateless: there is no link between two requests being successively carried out on the same connection. This immediately has the prospect of being problematic for users attempting to interact with certain pages coherently, for example, using e-commerce shopping baskets. But while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions. Using header extensibility, HTTP Cookies are added to the workflow, allowing session creation on each HTTP request to share the same context, or the same state.

### HTTP connections

A connection is controlled at the transport layer, and therefore is fundamentally out of scope for HTTP. HTTP doesn't require the underlying transport protocol to be connection-based; it only requires it to be reliable, or not lose messages (at minimum, presenting an error in such cases). Among the two most common transport protocols on the Internet, TCP is reliable and UDP isn't. HTTP therefore relies on the TCP standard, which is connection-based.

Before a client and server can exchange an HTTP request/response pair, they must establish a TCP connection, a process which requires several round-trips. The default behavior of HTTP/1.0 is to open a separate TCP connection for each HTTP request/response pair. This is less efficient than sharing a single TCP connection when multiple requests are sent in close succession.

In order to mitigate this flaw, HTTP/1.1 introduced pipelining (which proved difficult to implement) and persistent connections: the underlying TCP connection can be partially controlled using the Connection header. HTTP/2 went a step further by multiplexing messages over a single connection, helping keep the connection warm and more efficient.

## What can be controlled by HTTP

Here is a list of common features controllable with HTTP:

- **Caching**: How documents are cached can be controlled by HTTP. The server can instruct proxies and clients about what to cache and for how long. The client can instruct intermediate cache proxies to ignore the stored document.

- **Relaxing the origin constraint**: To prevent snooping and other privacy invasions, Web browsers enforce strict separation between websites. Only pages from the **same origin** can access all the information of a Web page. Though such a constraint is a burden to the server, HTTP headers can relax this strict separation on the server side, Web servers can override this policy using HTTP headers like `Access-Control-Allow-Origin`, which allows specified external domains to access resources.  
  Key Takeaways:

  - Browsers enforce the Same-Origin Policy to prevent unauthorized access across domains.
  - HTTP headers (e.g., CORS headers) allow servers to relax this policy when needed.
  - Cross-origin access can be useful for integrating external data sources securely.
  - Security measures are still necessary when allowing cross-origin access to avoid vulnerabilities.

- **Authentication**: Some pages may be protected so that only specific users can access them. Basic authentication may be provided by HTTP, either using the `WWW-Authenticate` and similar headers, or by setting a specific session using `HTTP cookies`.

## HTTP flow

When a client wants to communicate with a server, either the final server or an intermediate proxy, it performs the following steps:

1. Open a TCP connection: The TCP connection is used to send a request, or several requests, and receive an answer. The client may open a new connection, reuse an existing connection, or open several TCP connections to the servers.

2. Send an HTTP message: HTTP messages (before HTTP/2) are human-readable. With HTTP/2, these simple messages are encapsulated in **frames**, making them impossible to read directly, but the principle remains the same. For example:

   ```
   GET / HTTP/1.1
   Host: luckylove.co.il
   Accept-Language: fr
   ```

3. Read the response sent by the server, such as:

   ```
   HTTP/1.1 200 OK
   Date: Sat, 09 Oct 2010 14:28:02 GMT
   Server: Apache
   Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
   ETag: "51142bc1-7449-479b075b2891b"
   Accept-Ranges: bytes
   Content-Length: 29769
   Content-Type: text/html
    <!doctype html>… (here come the 29769 bytes of the requested web page)
   ```

4. Close or reuse the connection for further requests.

## HTTP Messages

HTTP messages, as defined in HTTP/1.1 and earlier, are human-readable. In HTTP/2, these messages are embedded into a binary structure, a frame`, allowing optimizations like compression of headers and multiplexing.

There are two types of HTTP messages, **requests** and **responses**, each with its own format.

### Requests

An example HTTP request:

![http overview](/img/request.svg)

Requests consist of the following elements:

- **An HTTP method**, usually a verb like `GET`, `POST`, or a noun like `OPTIONS` or `HEAD` that defines the operation the client wants to perform. Typically, a client wants to fetch a resource (using `GET`) or post the value of an HTML form (using `POST`), though more operations may be needed in other cases.

- **The path of the resource to fetch**; the URL of the resource stripped from elements that are obvious from the context, for example without the protocol (`http://`), the domain (here, `luckylove.co.il`), or the TCP port (here, `80`).

- **The version of the HTTP protocol**.

- **Optional headers** that convey additional information for the servers.

- **A body**, for some methods like `POST`, similar to those in responses, which contain the resource sent.

### Responses

An example response:

![http overview](/img/http-response.svg)

Responses consist of the following elements:

- **The version of the HTTP protocol** they follow.
- A status code, indicating if the request was successful or not, and why.
- A status message, a non-authoritative short description of the status code.
- HTTP headers, like those for requests.
- Optionally, a body containing the fetched resource.

## Example requests

Fetching the root page of developer.mozilla.org, (https://developer.mozilla.org/), and telling the server that the user-agent would prefer the page in French, if possible:

```
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr

```

Observe that final empty line, this separates the data block from the header block. As there is no `Content-Length` provided in an HTTP header, this data block is presented empty, marking the end of the headers, allowing the server to process the request the moment it receives this empty line.

For example, sending the result of a form:

```
POST /contact_form.php HTTP/1.1
Host: developer.mozilla.org
Content-Length: 64
Content-Type: application/x-www-form-urlencoded

name=Joe%20User&request=Send%20me%20one%20of%20your%20catalogue
```

## Example responses

Successful web page response:

```bash
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 55743
Connection: keep-alive
Cache-Control: s-maxage=300, public, max-age=0
Content-Language: en-US
Date: Thu, 06 Dec 2018 17:37:18 GMT
ETag: "2e77ad1dc6ab0b53a2996dfd4653c1c3"
Server: meinheld/0.6.1
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Vary: Accept-Encoding,Cookie
Age: 7

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>A simple webpage</title>
</head>
<body>
  <h1>Simple HTML webpage</h1>
  <p>Hello, world!</p>
</body>
</html>
```

Notification that the requested resource has permanently moved:

```bash
HTTP/1.1 301 Moved Permanently
Server: Apache/2.4.37 (Red Hat)
Content-Type: text/html; charset=utf-8
Date: Thu, 06 Dec 2018 17:33:08 GMT
Location: https://developer.mozilla.org/ (this is the new link to the resource; it is expected that the user-agent will fetch it)
Keep-Alive: timeout=15, max=98
Accept-Ranges: bytes
Via: Moz-Cache-zlb05
Connection: Keep-Alive
Content-Length: 325 (the content contains a default page to display if the user-agent is not able to follow the link)

<!doctype html>… (contains a site-customized page helping the user to find the missing resource)
```

Notification that the requested resource doesn't exist:

```bash
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
Content-Length: 38217
Connection: keep-alive
Cache-Control: no-cache, no-store, must-revalidate, max-age=0
Content-Language: en-US
Date: Thu, 06 Dec 2018 17:35:13 GMT
Expires: Thu, 06 Dec 2018 17:35:13 GMT
Server: meinheld/0.6.1
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Vary: Accept-Encoding,Cookie
X-Cache: Error from cloudfront

<!doctype html>… (contains a site-customized page helping the user to find the missing resource)
```
