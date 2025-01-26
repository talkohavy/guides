# SSL & TLS

## TLS: Transport Layer Security

TLS is an updated, more secure version of SSL. We still refer to our security certificates as SSL because it's a more common term, but when you buy SSL from DigiCert, you get the most trusted, up-to-date TLS certificates.

## HTTPS: Hyper Text Protocol Secure

HTTPS appears in the URL when a website is secured by an SSL/TLS certificate. Users can view the details of the certificate, including the issuing authority and the corporate name of the website owner, by clicking the lock symbol on the browser bar.

## Why do you need SSL?

SSL isn't just for e-commerce. It secures all types of information transferred to and from your website.

## How does TLS/SSL increase trust?

Not all TLS/SSL certificates are created equal. Beyond encryption, TLS certificates also authenticate the identity of a website owner. This provides an added layer of security which users can see if they look inside of it. Certificates are offered with three levels of this identity verification:

- Extended Validation SSL Certificates
- Organization Validation SSL Certificates
- Domain Validation SSL Certificates

## How do SSL certificates work?

SSL certificates establish an encrypted connection between a website/server and a browser with what’s known as an “SSL handshake.” For visitors to your website, the process is invisible — and instantaneous.

### - Authentication

For every new session a user begins on your website, their browser and your server exchange and validate each other’s SSL certificates.

### - Encryption

Your server shares its public key with the browser, which the browser then uses to create and encrypt a pre-master key. This is called the key exchange.

### - Decryption

The server decrypts the pre-master key with its private key, establishing a secure, encrypted connection used for the duration of the session.
