# Creating a Self-Signed Certificate

**<font size="5">Creating a Certificate With OpenSSL</font>**

## 0. TLDR;

You need a self-signed certificate.

### - Step 1: create 2 private-keys - 1 for the CA & 1 for the server

For the CA:

```bash
openssl genrsa -out rootCA.key 4096
```

For the server:

```bash
openssl genrsa -out server.key 4096
```

### - Step 2: Create a root CA Certificate

```bash
openssl req -x509 -key rootCA.key -sha256 -days 1825 -out rootCA.crt -subj "/CN=MyCA"
```

### - Step 3: Create a Certificate Signing Request (CSR)

```bash
openssl req -key server.key -new -out server.csr
```

Example input:

```bash
country: il
state: ''
city: New-R-Gan
Organization name: luckylove
Organizational Unit Name: ''
Common name: luckylove1.co.il
Email-Address: talkohavy@gmail.com
A-challenge-password: w1234
Company-name: luckylove
```

### - Step 4: Create a Server Certificate

```bash
openssl x509 -CA rootCA.crt -CAkey rootCA.key -in server.csr -req -days 365 -out server.crt
```

The `-days` option specifies the number of days that the certificate will be valid.

### - Step 4.5: Check out its contents

```bash
openssl x509 -in server.crt -text -noout
```

### - Step 5: Create PEM file

```bash
cat server.crt server.key > server.pem
```

The server settings will most likely require 2 files:

-- `server.pem` (which includes `server.crt` & `server.key`)
-- `rootCA.crt`

---

## 1. Connection Flow

We want to achieve a secure connection between a client and a server. For that, we need 3 things, a client, a server, and some high authority which both the client and the server trusts.

Since we never want to send other people our private key, all 3 of them need to have a public key.

What are the prerequisites to having a secure connection?

- The certificate authority (CA) needs to have a private key, a master certificate, that can sign other certificates.
- The server needs to have a private key, and a certificate signing request (csr).
- The server needs to send the `csr` over to the `CA` to generate a signed certificate (`server.crt`).
- The client needs to have a private key, and a certificate signing request (csr).
- The client needs to send the `csr` over to the `CA` to generate a signed certificate (`client.crt`).
- Both the client & server have a copy of `rootCA.crt` locally installed.

How does a connection flow look like?

### - Step 1: Client Says "Hello" (Connection Initiation)

The client begins the connection process by saying to the server: "Hey, I want to connect to you, but I want to do it securely using TLS."

### - Step 2: Server Responds with its Identity

The server responds by saying: "Sure, I support TLS! Here's my server certificate (`server.crt`). You can use this to confirm who I am."  
The server certificate includes:

- The server's identity (e.g., `CN=YourMongoDBServer`).
- The server's public key (used for encryption).
- A signature from the `CA` (to prove it's legitimate).

### - Step 3: Client Verifies the Server's Identity

The client Verifies the Server's Identity (the `server.crt`) using the `rootCA.crt` to check whether the server's certificate can be trusted:

- **Is this certificate valid?** The client ensures the server certificate hasn't expired and is properly signed.
- **Who signed it?** The client checks whether the CA that signed the server certificate is the same trusted CA whose certificate is in `rootCA.crt`.
- **Does the identity match?** The client checks that the `CN` (Common Name) in the server certificate matches the hostname (`localhost` in this case).

If the server's certificate passes these checks, **the client saves the server's public key** for later use, and says: "Okay, I trust you. Let's keep talking".

If the certificate is invalid (e.g., expired, not signed by the CA, or the CN doesn't match), the client refuses to connect.

### - Step 3.5: Server Verifies the Client's Identity

If the server is configured to require mutual authentication, the client sends over its `client.crt` to be examined, and now the server performs a similar process:

- 1. The server examines the client's certificate (`client.crt`) using the `rootCA.crt` to verify that:

  - It's signed by the trusted `CA` (from the server's configuration).
  - It hasn't expired.

- 2. The server checks whether the client's identity (from the `CN` in the client certificate) is allowed to connect.

If the client's certificate passes these checks, **the server saves the client's public key** for later use, and says: "Okay, I trust you too. Let's continue".

If the client's certificate is invalid, the server terminates the connection.

### - Step 4: TLS Handshake (Establishing a Secure Channel)

At this point:

1. The client and server have both verified each other's identities.
2. They now need to agree on encryption keys to secure their communication:

- They use each other's public keys (from the certificates) **to securely exchange a shared session key** (also known as the **pre-master key**).
- This session key is used to encrypt and decrypt all communication for the rest of the session.
- Once the shared secret (session key) is established, **all further communication is encrypted using symmetric encryption** (like `AES`), which is fast and efficient.
- The session key is used for encryption/decryption, and it is not part of the certificates.

This connection flow ensures:

- **Authentication**: Both sides trust each other.
- **Integrity**: No one can tamper with the messages without detection.
- **Encryption**: All communication is scrambled so no one can intercept and read it.

---

## 2. Creating a Private Key

First, we'll create a private key. A private key helps to enable encryption, and is the most important component of our certificate. Let's create a password-protected, 4096-bit RSA private key (domain.key) with the openssl command:

### - A. Create an unencrypted Private Key

```bash
openssl genrsa -out private.key 4096
```

An example output:

```bash
-----BEGIN PRIVATE KEY-----
MIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICAQCiCnDh3cyac+iZ
c+ugEUconmpZHuw9iTCP9BFMu3iKOMasbGCAdxk5noaNVs9S1T+qMfhfKDHlIRjb
buvjn0JLx4HDHLa0233z9cvn8YmRnZUY0lzL8DdQJoawQ4Im0GctQMAKmGVM0GNO
Oy5EfTvfjQSUagqNrolTGgJAwirJQvGOrMlTJ2kN7GjqG+TQkqcDTnn7SPSikL7L
BSDBFCqSU86twfGfqQI2gpY9jepNPmwtx3UgmiTrwJ1Lbu2QZxf/s2+3xl4eP1ny
# ...
EQnXsglVJ+Zn3cEbxqfdcCh+21oNtKnGgyrXIRn0o/jpvE1KthpmFU3qhm8MP/4N
+cHVrSJVZE8LIevQ8OBMu8W+I02wkf+yq4DzW5yEJ6LKCZfRyvAgEeH4+pSVXvIR
6s2wHB2AQ+VdZoud7C57pK9HNM/7jeDvsptROWiFaMVnp0HPreTvX3RYGtDt2ul4
dA0vngyFvnnswjHUc+9zlmDOFyW8Eg==
-----END PRIVATE KEY-----
```

Notice the title which says: **-----BEGIN PRIVATE KEY-----**. That's how you know that the private key in not encrypted, because an encrypted key starts with: **-----BEGIN ENCRYPTED PRIVATE KEY-----**

### - B. Create an encrypted Private Key

You can also create an encrypted Private Key, by using one of the following flags:

-aes128, -aes192, -aes256, -aria128, -aria192, -aria256, -camellia128, -camellia192, -camellia256, -des, -des3, -idea

Each flags marks a different encryption option. When choosing to encrypt the private key you **MUST** provide a passphrase. This is required in order to encrypt the key. These options encrypt the private key with specified cipher before outputting it. If none of these options is specified no encryption is used (just like we did above). If encryption is selected, you'll be prompted to provide a pass phrase, if one is not supplied via the `-passout` argument.

```bash
openssl genrsa -des3 -out private.key 4096
```

An example output:

```bash
-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIJpDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQuI81YpJrz6WBt9bu
QdeExAICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQIb4o7RkR+rRoEgglI
9P9W9+YIFdoIQOPI3gARRxD5PQU0A+wedwGZyulCYo5oR/gCGQAdX+p7jVGMuP3p
# ...
6sIsTWWfIPfWvfTnGoD+s+oCv7UBr0c9y3y92S01mZoAu/1Ia/HSXpIKvblJ1bG8
5/ROkbpxDxd6n6GeShDQnVN+5UUk+910u+Brk/G6GBZe7+GblYV0Nbao+EdFg37T
9F5mHITPiyjzVGyW5ITpE7ebNIhKox0b
-----END ENCRYPTED PRIVATE KEY-----
```

---

## 3. Creating the Certificate Authority (CA)

### Intro

We can be our own certificate authority (CA) by creating a **self-signed root CA certificate**, and then installing it as a trusted certificate in the local browser.  
The next commands will set up your Certificate Authority, which is the trusted entity that signs other certificates (server and client certificates).

Let's create a private key (rootCA.key) and a self-signed root CA certificate (`rootCA.crt`) from the command line:

### - Step 1: Generate the CA's Private Key

```bash
openssl genrsa -out ca.key 4096
```

This private key is the "secret ingredient" of your CA. It must be kept safe because it's used to sign certificates and validate identities.

### - step 2: Create the CA Certificate

#### - The Command:

```bash
openssl req -x509 -key rootCA.key -sha256 -days 1825 -out rootCA.crt -subj "/CN=MyCA"
```

- `req`: openSSL sub-command which stands for "request." It is used to generate a certificate.
- `-x509`: This option outputs a certificate instead of a certificate request. This is typically used to generate test certificates. This option implies the `-new` flag if `-in` is not given.
- `-key ca.key`: Uses the private key (ca.key) we just generated to sign the new certificate or certificate request. The corresponding public key is placed in the new certificate or certificate request, resulting in a self-signature (Unless `-in` is given, see `-in`).
- `-sha256`: Specifies the hashing algorithm (SHA-256 is secure and widely used).
- `-days 365`: Sets the validity period of the certificate to 365 days.
- `-out rootCA.crt`: Saves the generated certificate to `rootCA.crt`.
- `-subj "/CN=MyCA"`: Provides the "Subject" field of the certificate, where CN is the Common Name (e.g., the name of your CA).
- `-new`: Implied by -x509. Indicates that this is a new certificate request.

#### - Description

Creating the CA certificate will help us generate certificates for both the client and the server. Each one will "send" the CA:

- a public key
- a csr

for which the CA will generate a signed certificate for them to use.  
Plus, each side (client & server) will get the CA's public key, with which they could verify each other's certificates.

---

## 4. Creating a Certificate Signing Request

### Intro:

Both the client & server each need to:

- have a private key of their own.
- create a csr (certificate signing request).

```bash
openssl req -key private.key -new -out request.csr
```

### In Practice:

Using it in practice would mean:

```bash
openssl req -key client.key -new -out client.csr
```

And:

```bash
openssl req -key server.key -new -out server.csr
```

### More Info:

If the private.key included a passphrase, you'll be asked to enter it here.  
Now you'll be asked to provide some CSR information to complete the process.  
The CSR information will include:

- "Common Name" (CN), which is an important field, and should be the EXACT **Fully Qualified Domain Name** (FQDN) of our domain.
- A challenge password.
- An company name (optional). Can leave empty.

**We can also create both the private key and CSR with a single command:**

```bash
openssl req -newkey rsa:2048 -keyout private.key -out request.csr
```

Or, if we want our private key unencrypted, we can add the `-nodes` option:

```bash
openssl req -newkey rsa:2048 -nodes -keyout private.key -out request.csr
```

NOTE! The `-nodes` flag is only relevant if you're creating a new private key! The `-nodes` flag is ignored when using it along with the `-key` flag, which grabs an already existing key as value.  
The `-nodes` flag in the openssl req command means "no DES encryption". Specifically, it tells OpenSSL not to encrypt the private key when generating the certificate or a Certificate Signing Request (CSR). Without `-nodes`, OpenSSL will prompt you to set a passphrase to encrypt the private key.

---

## 5. Creating a Server/Client Certificate

### Intro:

Let's now sign those `csr`s, using the CA, and generate certificates:  
(**recommended**)

```bash
openssl x509 -CA rootCA.crt -CAkey rootCA.key -in request.csr -req -days 365 -out certificate.crt
```

Or... (**not recommended**)

```bash
openssl x509 -signkey rootCA.key -in request.csr -req -days 365 -out certificate.crt
```

### In practice:

We will use this command to create one certificate for the server, and one certificate for the client.

So in practice, it'll be:

```bash
openssl x509 -CA rootCA.crt -CAkey rootCA.key -in client.csr -req -days 365 -out client.crt
```

And:

```bash
openssl x509 -CA rootCA.crt -CAkey rootCA.key -in server.csr -req -days 365 -out server.crt
```

### More Info:

The `-days` option specifies the number of days that the certificate will be valid.

---

## 6. Creating a Self-Signed Certificate

Instead of all that we did above, we can simply create a Self-Signed Certificate. A self-signed certificate is **a certificate that's created by an entity, for that entity, signed by that entity's own private key**. It can be used to encrypt data just as well as CA-signed certificates, but our users will be shown a warning that says the certificate isn't trusted.

Let's create a self-signed certificate from an existing private:

```bash
openssl req -key private.key -new -x509 -days 365 -out certificate.crt
```

**The above command will create an on-demand CSR on-the-fly**. We would of course still need to provide the CSR information as a prompt. We can even create a private key and a self-signed certificate with just a single command:

```bash
openssl req -newkey rsa:2048 -keyout private.key -x509 -days 365 -out certificate.crt
```

---

## 7. Create a PEM file

### - A. Intro

**PEM** stands for **Privacy-Enhanced Mail**, but don't let the name fool you — it's widely used for certificates and cryptographic data today. A **PEM** file is simply a text file that encodes:

- Certificates
- Private keys
- Other cryptographic information

**PEM** is the most widely used format. Text-based and Base64-encoded. Easy to read and combine.  
Other formats are: **DER** and **PFX/PKCS#12**.

**PEM** files are easy to recognize because they:

- Use Base64 encoding to store binary data.
- Contain special header and footer lines, such as:
  - For a certificate:
  ```bash
  -----BEGIN CERTIFICATE-----
  (Base64-encoded certificate data)
  -----END CERTIFICATE-----
  ```
  - For a private key:
  ```bash
  -----BEGIN PRIVATE KEY-----
  (Base64-encoded private key data)
  -----END PRIVATE KEY-----
  ```

### - B. Creation

We combine `server.crt` and `server.key` into a PEM file:

```bash
cat server.crt server.key > server.pem
```

We do the same for the client:

```bash
cat client.crt client.key > client.pem
```

### -C. What is the Combine Step?

The "combine step" involves merging a **certificate file** (`.crt`) with its corresponding **private key** file (`.key`) into a single file, typically in the **PEM** format.

Why is it Needed?

Certificates and Keys Work Together:

- A certificate (`.crt`) is the **public-facing proof of identity**.
- A private key (`.key`) is the secret ingredient that allows the server or client to use the certificate securely.
- Together, they form a "key pair" used to establish encrypted and authenticated connections.

The server (or client) needs access to both the certificate and the private key **in one place** for secure communication.

By combining them, tools like `mongod` or `mongosh` only need to reference one file (e.g., `server.pem`), simplifying configuration and avoiding mismatches between separate `.crt` and `.key` files.

---

## 8. View Certificates

We can use the openssl command to view the contents of our certificate in plain text:

```bash
openssl x509 -in certificate.crt -text -noout
```

It works even if it's inside a `.pem` file:

```bash
openssl x509 -in cert.pem -noout -text
```

---

### Q&A

#### Q1: When a certificate expires, does the server to create a new csr? or can it use the previous one?

Technically, you **can reuse the previously created CSR** if:

- The private key has not changed.
- The CSR still contains accurate and relevant information.

However, **this is not recommended** because:

- The old CSR might have outdated information (e.g., expiration dates or organizational changes).
- Best practices suggest creating a fresh CSR to avoid confusion and errors.
