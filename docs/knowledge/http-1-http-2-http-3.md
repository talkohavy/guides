# Http 1.1, Http 2.0, and Http 3.0

What's the difference between Http 1.1, Http 2.0, and Http 3.0?

<img src={require('@site/static/img/http-1-http-2-http-3/http-versions-timeline.png').default} alt="http versions - timeline 1997 2015 2022" width="400" />

They all do the same basic thing - let your browser talk to web servers.

But the way they handle requests, connections, and data, is completely different.

And that evolution explains why the modern web got so much faster.

Imagine you open a website. Your browser needs HTML, css, JavaScript, images and fonts. That's dozens, sometimes hundreds of requests.

## 1. Http 1.1

Let's start with Http 1.1. Introduces in the 1990s, it **sends requests and responses over TCP connections**. And it **can reuse the same connection** instead of opening a new one every time.

<img src={require('@site/static/img/http-1-http-2-http-3/http-1-keep-alive-single-connection.png').default} alt="http 1.1 - keep-alive single connection" width="400" />

**But there's a problem. On a single connection responses come back in order**. Your browser requests a large image, then a small css file. While the image is still transferring, the css file is stuck waiting behind it. **This is called head-of-line blocking**.

<img src={require('@site/static/img/http-1-http-2-http-3/http-1-head-of-line-blocking.png').default} alt="http 1.1 - head-of-line blocking" width="400" />

So browsers open several connections to the same server, but all those connections add extra overhead.

<img src={require('@site/static/img/http-1-http-2-http-3/http-1-six-parallel-connections.png').default} alt="http 1.1 - six parallel connections" width="400" />

Now enter Http 2.

## 2. Http 2

**It's big improvement is multiplexing**.

<img src={require('@site/static/img/http-1-http-2-http-3/http-2-multiplexing.png').default} alt="http 2 - multiplexing" width="400" />

Https 2 splits messages into small pieces called **frames**. **Each request and response gets its own stream**, and **many streams share one single TCP connection**. So an image, a css and a JavaScript **can all arrive mixed together**. No more waiting for one full response before the next.

<img src={require('@site/static/img/http-1-http-2-http-3/http-2-streams-one-tcp-connection.png').default} alt="http 2 - streams share one tcp connection" width="400" />

**Http 2 also compresses headers**. So repeated information isn't sent again and again. **But here's the catch**: **Http still 2 runs on TCP**, and **TCP guarantees that data arrives in order**, so if one packet from the image file gets lost, TCP can hold back the CSS and JavaScript until that image packet is recovered!

<img src={require('@site/static/img/http-1-http-2-http-3/http-2-lost-packet-held-by-tcp.png').default} alt="http 2 - lost packet held by tcp" width="400" />

The blocking just moved down a level! Now comes Http 3.

## 3. Http 3

Instead of TCP, **it runs on a protocol called QUIC, built on top of UDP**. But it's not just a normal unreliable UDP, **QUIC** handles it's own reliability, encryption, and congestion control. **And it's biggest advantage: independent streams!**

<img src={require('@site/static/img/http-1-http-2-http-3/http-3-quic-independent-streams.png').default} alt="http 3 - quic independent streams" width="200" />

If a packet from the image file gets lost, QUIC recovers it without blocking anything else. Your css and JavaScript keep arriving.

<img src={require('@site/static/img/http-1-http-2-http-3/http-3-lost-packet-only-stream-waits.png').default} alt="http 3 - lost packet only this stream waits" width="250" />

Http 3 also connects securely faster, especially to sites you've visited before. And it supports connection migration. Imagine browsing on your phone over Wi-Fi, then walking outside and switching to mobile data. With TCP that usually means a brand new connection.

<img src={require('@site/static/img/http-1-http-2-http-3/tcp-network-switch-new-connection.png').default} alt="tcp - new address new connection" width="400" />

**QUIC** can often keep the same one alive.

<img src={require('@site/static/img/http-1-http-2-http-3/quic-connection-migration-same-id.png').default} alt="quic - connection migration same connection id" width="400" />

## 4. Full Mental Model

So here's the full mental model:

<img src={require('@site/static/img/http-1-http-2-http-3/mental-model-comparison.png').default} alt="mental model - http 1.1 vs http 2 vs http 3" width="400" />

Http 1.1 reuses connections, but responses on each one wait in line.

<img src={require('@site/static/img/http-1-http-2-http-3/mental-model-http-1.png').default} alt="mental model - http 1.1 connections wait in line" width="150" />

Http 2 lets many streams share one TCP connection.

<img src={require('@site/static/img/http-1-http-2-http-3/mental-model-http-2.png').default} alt="mental model - http 2 one shared pipe" width="150" />

Http 3 moves to QUIC. So one lost packet no longer blocks everything else.

<img src={require('@site/static/img/http-1-http-2-http-3/mental-model-http-3.png').default} alt="mental model - http 3 quic independent streams" width="150" />

But Http 3 isn't automatically faster everywhere. It still depends on the network, the server, and the browser, to all 3 speak the same language.

The real evolution isn't what each HTTP version does, it's how efficiently it moves information between your browser and the server.
