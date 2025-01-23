# Creating a Self-Signed

**<font size="5">Creating a Certificate With OpenSSL</font>**

## 1. Overview

OpenSSL is an open-source command-line tool that allows users to perform various SSL-related tasks. In this tutorial, we'll learn how to create a self-signed certificate with OpenSSL.

## 2. Creating a Private Key

First, we'll create a private key. A private key helps to enable encryption, and is the most important component of our certificate. Let's create a password-protected, 4096-bit RSA private key (domain.key) with the openssl command:

```bash
openssl genrsa -des3 -out private.key 4096
```

We'll enter a password when prompted. If we want our private key unencrypted, we can simply remove the -des3 option from the command.

## 3. Creating a Certificate Signing Request

**If we want our certificate signed, we need a certificate signing request (CSR)**. The CSR includes the public key and some additional information (such as organization and country).  
Let's create a CSR (domain.csr) from our existing private key:

```bash
openssl req -key private.key -new -out request.csr
```

We'll enter our private key password and some CSR information to complete the process. An important field is "Common Name", which should be the exact Fully Qualified Domain Name (FQDN) of our domain. "A challenge password" and "An optional company name" can be left empty.  
**We can also create both the private key and CSR with a single command:**

```bash
openssl req -newkey rsa:2048 -keyout private.key -out request.csr
```

If we want our private key unencrypted, we can add the -nodes option:

```bash
openssl req -newkey rsa:2048 -nodes -keyout private.key -out request.csr
```

## 4. Creating a Self-Signed Certificate

A self-signed certificate is **a certificate that's signed with its own private key**. It can be used to encrypt data just as well as CA-signed certificates, but our users will be shown a warning that says the certificate isn't trusted.  
Let's create a self-signed certificate (domain.crt) with our existing private key and CSR:

```bash
openssl x509 -signkey private.key -in request.csr -req -days 365 -out certificate.crt
```

The -days option specifies the number of days that the certificate will be valid.  
We can create a self-signed certificate with just a private key:

```bash
openssl req -key private.key -new -x509 -days 365 -out certificate.crt
```

**The above command will create a temporary CSR**. We still have the CSR information prompt, of course. We can even create a private key and a self-signed certificate with just a single command:

```bash
openssl req -newkey rsa:2048 -keyout private.key -x509 -days 365 -out certificate.crt
```

## 5. Creating a CA-Signed Certificate With Our Own CA

We can be our own certificate authority (CA) by creating a self-signed root CA certificate, and then installing it as a trusted certificate in the local browser.

### 5.1. Create a Self-Signed Root CA

Let's create a private key (rootCA.key) and a self-signed root CA certificate (rootCA.crt) from the command line:

```bash
openssl req -x509 -sha256 -days 1825 -newkey rsa:2048 -keyout rootCA.key -out rootCA.crt
```

### 5.2. Sign Our CSR With Root CA

First, we'll create a configuration text-file (domain.ext) with the following content:

```bash
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = domain
```

The "DNS.1" field should be the domain of our website.  
Then we can sign our CSR (domain.csr) with the root CA certificate and its private key:

```bash
openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in domain.csr -out domain.crt -days 365 -CAcreateserial -extfile domain.ext
```

As a result, the CA-signed certificate will be in the domain.crt file.

## 6. View Certificates

We can use the openssl command to view the contents of our certificate in plain text:

```bash
openssl x509 -text -noout -in certificate.crt
```

## 7. Conclusion

So here are all the commands for creating a certificate, and without making any shortcuts:

### - Step 0: make sure you have the `openssl` tool

Open up Everything, and search for openssl.exe.  
We're gonna need its path in order to execute openssl commands.  
Make sure that the path has no spaces in it (i.e. Program Files is no good!).  
Create a new folder on your desktop. This is where all the files are gonna be outputted. Open cmd in that folder.  
For every command that's gonna follow, replace the "openssl" keyword with the full path from above, including the "openssl.exe" in it.

### - Step 1: create a private-key

First, we'll create a private key. A private key helps to enable encryption, and is the most important component of our certificate. Let's create a password-protected, 2048-bit RSA private key (domain.key) with the openssl command:

```bash
openssl genrsa -des3 -out private.key 2048
```

### - Step 2: Create a Certificate Signing Request (CSR)

**If we want our certificate signed, we need a certificate signing request (CSR)**. The CSR includes the public key and some additional information (such as organization and country).
Let's create a CSR (domain.csr) from our existing private key:

```bash
openssl req -key private.key -new -out request.csr
```

We'll enter our private key password and some CSR information to complete the process.
An important field is "Common Name", which should be the exact Fully Qualified Domain Name (FQDN) of our domain. This is what I gave:

```bash
pass_phrase: a9fEcdcf
country: il
state: <empty|enter>
city: ramatgan
Organiztion name: luckylove
Organizational Unit Name: <empty|enter>
Common name: luckylove1.co.il
Email Address: talkohavy@gmail.com
A challenge password: wG8jxMUMu3V5
Company name: luckylove
```

### - Step 3: Create a Self-Signed Certificate

A self-signed certificate is **a certificate that's signed with its own private key**. It can be used to encrypt data just as well as CA-signed certificates, but our users will be shown a warning that says the certificate isn't trusted.
Let's create a self-signed certificate (domain.crt) with our existing private key and CSR:

```bash
openssl x509 -signkey private.key -in request.csr -req -days 365 -out certificate.crt
```

The -days option specifies the number of days that the certificate will be valid.
