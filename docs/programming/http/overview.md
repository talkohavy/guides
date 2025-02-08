# An overview of HTTP

# TLDR;

- HTTP is a **protocol** for **fetching resources**.
- HTTP is a client-server protocol.
- HTTP is an extensible protocol.
- HTTP is an application layer protocol that is sent over TCP.
- HTTP is generally designed to be simple and human-readable.
- HTTP is stateless, but not sessionless. However, while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions.
- HTTP requires the underlying transport protocol to be reliable, (not lose messages, or at least present an error in such cases). Among the two most common transport protocols on the Internet, **TCP** is reliable and **UDP** isn't. HTTP therefore relies on the TCP standard, which is connection-based.

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
