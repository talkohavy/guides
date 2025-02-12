# Crypto

## 1. Introduction

Node comes with a built-in package called crypto.
The node:crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
Before talking about crypto, we need to discuss 7 cryptography concepts.

---

## 2. Cryptography Concepts

### - Concept 1: HASH

#### A. Description

A **hash** is simply applying a function on a certain content, and receiving back a mumbled string that looks like garbage. The important part is that - if we apply the same **hash function** on the same input, we'd get the same output.

A unique feature of a hash is that it's **one way**. In contrast to encryption, one cannot decipher a hashed content, since the **output isn't unique**. Two _different_ inputs can generate the _same output_.

A common usage for hashes is storing passwords in a database. In such case, even if the database has been breached, the passwords can never be recovered.

#### B. Hash in Nodejs

##### - Step 1: createHash

How can we use hash in node?  
We start off by importing the `createHash` function from the crypto package:

```js
const { createHash } = require('crypto');
```

Next, we generate a custom function, which we'd name as "myHash":

```js
// This is an incomplete code!
function myHash(input){
  return createHash();
}
```

The function above returns a hash string as the output.

##### - Step 2: choose a hashing algorithm

The next step is to define the hashing algorithm you want to use.

```javascript
// This is an incomplete code!
function hash(input){
  return createHash('sha256');
}
```

The algorithm is dependent on the available algorithms supported by the version of `openssl` on the platform.

You can run:

```bash
openssl list --digest-algorithms
```

to display available algorithms.

Famous algorithm options are:

- `sha256`
- `sha512`
- `md5`
- `argon2` (not built-in to node's crypto)

In the example code above, I'm using "sha256", which stands for "**Secure Hash Algorithm**". This algorithm returns a **hash value**, which is also called a **digest**, with 256 bits.

The algorithm you choose is important! OFor example, one of the algorithms to choose from is `md5`. As computers have become faster, and the internet more vast, the `md5` algorithm has become obsolete. Remember, cryptography is always evolving. `sha256` is a good option, but there are even better solutions like `argon2`, although it's not built-in to node's crypto.  
Once we have our hashing algo, we can call `update` and pass in input value:

##### - Step 3: call `update(input)`

The `update` method accepts an input, the input we want to be hashed:

```javascript
// This is an incomplete code!
function hash(value){
  return createHash('sha256').update(value);
}
```

##### - Step 4: call `digest(encoding)`

We return an output by invoking the `digest` method, along with the **encoding** we want to return:

```javascript
function hash(value){
  return createHash('sha256').update(value).digest('hex');
}
```

Key things to notice here:

- We invoke `createHash` every time on every new input. We do not call `createHash` just once, and use it on multiple inputs. If we did that, we would get an error! `Error [ERR_CRYPTO_HASH_FINALIZED]: Digest already called`.
- We have two separate methods: `update` & `digest`. The `update(data)` method allows you to incrementally add chunks of data to the hash function. This is useful for steaming support which grants performance optimization.
- The digest(encoding) method finalizes the hash computation and produces the final output (typically in 'hex', 'base64', or a raw Buffer). Once digest() is called **the hash computation is finalized**. You can no longer call `update()` on that hash instance (you'd need to create a new one to hash more data).

As the name suggests, the `digest` function digests (calculates) all of the data passed, which you want to be hashed. If an encoding is provided, a _string_ will be returned; otherwise a _Buffer_ is returned.

Here is the list of all encoding options that digest accepts:

- `hex` (what we will use)
- `base64` (what you'll commonly see)
- `utf8` (utf-8 is an alias)
- `utf16le` (utf-16le is an alias)
- `latin1`

Now that you have this function, you can pass in an input, like a password:

```javascript
const password = 'hi-mom!';
const hash1 = hash(password);

console.log(hash1); // output: 7a5d84e61a2234b450185fde58c237bb13e93d93d90f669b114d
```

So you'll get this long string of numbers and letters, that hide its original meaning. Now, if we create another hash, and compare the two, we'll know that the original value is the same, if the two hashes match-up:

```javascript
// compare two hashed passwords:
const password2 = 'hi-mom!';
const hash2 = hash(password);
const isMatch = hash1 === hash2
console.log(isMatch)
// would print out: true
```

That's super useful, but a hash by itself isn't actually sufficient for storing a password in a database. And that brings us to our next topic - **salt**!

### - Concept 2: SALT

#### A. Description

As mentioned above, a hash is super useful, but by itself, a hash isn't sufficient enough for storing passwords in a database. We need `salt`!

The fact that a hashing function always returns the same value is also a problem when it comes to passwords. Especially when you let stupid humans come up with them, like "password123".

If a hacker obtains the database, and the passwords are hashed, they can often just go to something like a **rainbow table**, that has a bunch of pre-computed hashes and find a bunch of commonly used passwords.  
A `salt` is just a random value that's added to the password before it's hashed, and therefore making it much harder to guess.

#### B. Implementation in nodejs

In nodejs, we have a function called `scryptSync` (prefer using `scrypt` instead to prevent blocking the main thread).

`scryptSync` is a built-in function in Node.js inside the `crypto` module that derives a cryptographic key from a password. It is mainly used for securely hashing passwords and generating encryption keys. `scryptSync` is a hashing function, but it's specifically **a key derivation function (KDF)** rather than just a simple hash function like SHA-256.

How is it different from `createHash`?

- `createHash(algorithm)` (e.g., SHA-256) is a simple hashing function that produces a fixed-length hash. It is fast but **not ideal for password storage** because it's vulnerable to brute-force attacks.

- `scryptSync(password, salt, keyLength, options?)` **is slow by design** and includes a "salt" to prevent precomputed attacks (rainbow tables). It is better suited for **password hashing** because it is computationally expensive, making brute-force attacks harder.

#### C. Usage Example in node

In node, we can hash a password with salt by importing `scryptSync` & `randomBytes` functions from `crypto`:

```javascript
const { scryptSync, randomBytes } = require('crypto');
```

Then we'll define the functions signUp & login:

```javascript
const { scryptSync, randomBytes } = require('crypto');

function signUp(email,password){}

function login(email,password){}
```

They both take an email and a password as their arguments.  
When a user signs up, we'll generate a `salt`, which is just a random set of characters, using the `randomBytes` function:

```javascript
const { scryptSync, randomBytes } = require('crypto');

function signUp(email,password){
  const salt = randomBytes(16).toString('hex');
}

function login(email,password){}
```

Then we will use `scryptSync` to hash both the salt and the password:

```javascript
const { scryptSync, randomBytes } = require('crypto');

function signUp(email,password){
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');
}

function login(email,password){}
```

We provide `scryptSync` with 3 things:

1.  the original password
2.  the salt
3.  a _key length_ (which is \_recommended to be 64)

Without getting into more details, `scryptSync` makes it more **computational intensive to crack using brute force**, and it's actually been used as **proof of work algorithms used in cryptocurrency mining**.  
So now that we have a hashed password, we also need to store the salt with it, and we can do that by just pre-pending it to the existing string, separated by a semi-colon:

```javascript
const { scryptSync, randomBytes } = require('crypto');

function signUp(email,password){
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');

  const user = { email, password: `${salt}:${hashedPassword}` }
}

function login(email,password){}
```

Now, when the user goes to log in, we can grab the salt from the database, and recreate the original hash, like so:

```javascript
const { scryptSync, randomBytes } = require('crypto');

function signUp(email,password){
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');

  const user = { email, password: `${salt}:${hashedPassword}` };

  users.push(user);

  return user;
}

function login(email,password){
  const user = users.find((item) => item.email === email);

  const [salt,key] = user.password.split(':');
}
```

A standard user login flow:

1. The client supplies an email & a password.
2. We use ONLY the email to get the user record from the database
3. Split the "password" column to both the salt & the hashed password
4. Use the salt and _provided_ password to regenerate the hashed password.
5. Compare between the stored hashedPassword, and the regeneratedHashedPassword - `hashedPassword === regeneratedHashedPassword`
6. If true, login was successful! Else, throw 401 unauthorized error.

As an extra added security precaution, we will replace step 5, which is just a simple compare action, with a better one. We will use the `timingSafeEqual` function.

A **timing attack** is where a hacker measures the amount of time it takes to perform an operation, to obtain information about the value. This function helps prevents that type of attack. How?

The `timingSafeEqual` function compares the bytes that represent the 2 given inputs **using a constant-time algorithm**.

```javascript
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

function signUp(email,password){ ... }

function login(email,password){
  const user = users.find((item) => item.email === email);

  const [salt,hashedPassword] = user.password.split(':');
  const rawHashedPasswordBuffer = scryptSync(rawPassword, salt, 64);

  const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');
  const match = timingSafeEqual(rawHashedPasswordBuffer, hashedPasswordBuffer);
  if(match) return 'login success!';

  return 'login failed...';
}
```

The `crypto.timingSafeEqual()` function is used to determine whether two variables are equal without exposing timing information that may allow an attacker to guess one of the values. A constant-time algorithm underpins it. That's how basic email-password authentication works on the web, but a related topic you might come across is Hashed-based Message Authentication Code (**HMAC**).

### - Concept 3: HMAC

#### A. Description

What is **HMAC**?

1. It Stands for: **Hashed Based Message Authentication Code**
2. It's a hash that also requires a password/key.
3. It's used for signing a message, preventing against tampering & forged messages (as its name suggest - **Message Authentication**).

An example is a Json Web Token (JWT), used for authentication on the web. When a user logs in on a trusted server, the server generates a token using a special key chosen by the developer. Then, the client and server can pass that token back and forth, and the server can trust it because it knows that only someone with the exact same secret key could have generated that hash signature.

#### B. Is `scryptSync` an `HMAC`?

No, `scryptSync` is not an `HMAC`.

At a high level, both `HMAC` and `scryptSync` involve a secret input and a hashing function, **but they serve different cryptographic purposes**. Let's break it down further.

One might say that other other than the fact that one is fast (`HMAC`) and the other is slow by design (`scryptSync`), they both seem very much alike. That it's basically like using a permanent fixed salt.

It's true that the _secret key_ can resemble a _fixed salt_ in some ways:

- Both modify the hashing process to introduce uniqueness.
- Both prevent certain attacks (e.g., precomputed attacks like rainbow tables).
- Both take an additional input (`HMAC`: a key, `scryptSync`: a salt).

However, there are critical differences that make this analogy imperfect:

| Feature                | `scryptSync` (**KDF**)              | `HMAC` (Message Authentication)        |
| ---------------------- | ----------------------------------- | -------------------------------------- |
| **Purpose**            | Key derivation (password hashing)   | Message integrity & authenticity       |
| **What It Produces**   | A derived cryptographic key         | A message authentication code (MAC)    |
| **Input Components**   | Password + Salt + Work Factor       | Secret Key + Message                   |
| **Salt/Key Behavior**  | Salt must be random per user        | Secret key is fixed per system         |
| **Prevention Against** | Brute-force & Rainbow Table attacks | Tampering & Forged Messages            |
| **Processing Time**    | Slow (designed to be expensive)     | Fast (designed for quick verification) |

✅ Why not use a fixed salt for `scrypt`?

**A fixed salt** is just like hashing a password without one — it offers no real protection against precomputed attacks.

✅ Why not use a random salt for `HMAC`?

Each `HMAC` computation should be deterministic, meaning that the same input should always yield the same result, otherwise it can't be verified.

✅ What Happens If You Swap Them?

- If you use **`HMAC` for password hashing**, it's too fast and vulnerable to brute-force.
- If you use **`scryptSync` for message authentication**, it’s too slow and inefficient.

#### C. Example usage in nodejs

In node, we can import the `createHmac` function:

```javascript
const { createHmac } = require('crypto');
```

Then we'll define a secret key, along with the message that we want to hash:

```javascript
const { createHmac } = require('crypto');

const key = 'super-secret!'; // Store it some-place safe! Like a .env file
const message = 'boo!';
```

Now we use the `hmac` function to create a hash, similar to as we did with the `hash` function before:

```javascript
const { createHmac } = require('crypto');

const key = 'super-secret!';
const message = 'boo !';

const hash1 = createHmac('sha256', key).update(message).digest('hex');
const hash2 = createHmac('sha256', key).update(message).digest('hex');

console.log(hash1);
console.log(hash2);
console.log(hash1 === hash2); // true
```

The only difference we notice here is that we also provide this `key` param to `createHmac`. The important thing to notice here, is that we would only get the same hash, if the same message **AND** key/password combination is used. If we had the same message, but with a different key, we would get a different hash as a result.

Here is a simple implementation of jwt-like, using `hmac`:

```js
import { createHmac } from 'node:crypto';

function base64UrlEncode(buffer) {
  return buffer.toString('base64url'); // Base64url encoding (removes padding and special chars)
}

function base64UrlDecode(base64url) {
  return Buffer.from(base64url, 'base64url').toString();
}

function sign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };

  // Convert header and payload to base64url
  const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)));

  // Create signature using HMAC-SHA256
  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  // Return the full JWT-like token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verify(token, secret) {
  const [encodedHeader, encodedPayload, receivedSignature] = token.split('.');

  // Recompute the signature
  const expectedSignature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  // Compare signatures
  if (receivedSignature === expectedSignature) {
    return JSON.parse(base64UrlDecode(encodedPayload)); // Valid token, return decoded payload
  } else {
    throw new Error('Invalid signature');
  }
}

// Example usage
const secret = 'super-secret-key';
const payload = { userId: 123, role: 'admin' };

// Signing a token
const token = sign(payload, secret);
console.log('Token:', token);

// Verifying a token
try {
  const decoded = verify(token, secret);
  console.log('Decoded:', decoded);
} catch (err) {
  console.error(err.message);
}
```

That's pretty cool!  
But what happens when you want to completely scramble the text, and not just base64 it, and be able to talk to the other party secretly? You both need to share a secret key, to be able to read the original hidden message. That's where **encryption** comes in.

### - Concept 4: SYMMETRIC ENCRYPTION

#### A. Description

What is encryption exactly?  
With encryption, we take a message, scramble up the bytes to make it unreadable, that's called the **Cyphertext** - an encrypted text transformed from plaintext using an encryption algorithm. Then we provide a key/password allowing somebody else to decrypt it.

It's also typically randomized, so that each time you encrypt, you'd get an entirely different encrypted output, even if the key and message are the same. The first encryption example we'll look at is the Symmetric one, which means that there's a shared password between the two parties. Both the sender and the receiver of the message need to have the exact same key.

#### B. Example usage in nodejs

To implement this in node, we're going to import:

- `createCipheriv`
  for when encrypting a message (btw, iv stands for "initial vector").
- `randomBytes`
  for randomness at each encryption (the SALT).
- `createDecipheriv`
  for when decrypting a message.

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');
```

So, first we have the message itself, the one that we're trying to encrypt:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
```

Then we'll define "key" as **32 randomBytes**:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
const key = randomBytes(32);
```

Next we'll create the initial vector as **16 randomBytes**:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
const key = randomBytes(32);
const iv = randomBytes(16);
```

The iv will **randomize** the output when its encrypted, so that when identical sequence attacks occur, they will never produce the same cyphertext, making it more difficult for a hacker to break the encryption. Now, we can use these values to create a `cipher`. Like a hash, it is dependent upon an algorithm, although encryption algorithms are inherently different than hashing algorithms (Advanced Encryption Standard - AES), so you'll notice an entirely different set of options here:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);
```

Now, you can _use_ the `cipher` to _encrypt a message_ by calling `cypher.update`, or even multiple messages if you want to, then finish it off by calling `cipher.final`, and _add that value to the end of the encrypted message_, and finalize the `cipher`:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

// Encrypt:
const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
```

At this point, the `cipher` _can no longer be used to encrypt data_!
Now, to decipher it, create a `decipher` object using `createDecipheriv`, with the same key and initial vector (iv). Use the same basic pattern of `update` and `final` to convert the encrypted message back into plain text:

```javascript
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

const message = 'I like turtles';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

// Encrypt:
const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

const decipher = createDecipheriv('aes256', key, iv);

// Decrypt:
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');
```

And that's how you encrypt and decrypt a message in node.

### - Concept 5: KEYPAIRS

There's a big limitation to symmetric encryption, and that's the fact that both the sender and receiver of the message, need to share a password. It's just not practical for two different parties to agree upon a shared password.

Once again, math comes to the rescue, and this time in the form of a public-key crypto-system. Instead of one key, it uses two keys that are mathematically linked.
A **public key**, and a **private key**.

key can be shared with other people. In node, we can generate a private & public key pair using the `generateKeyPair` function.

```javascript
const { generateKeyPairSync } = require('crypto');
```

The first argument is the crypto-system you wanna use:

```javascript
const { generateKeyPairSync } = require('crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa');
```

which in our case will be 'rsa', and you're not gonna believe what the initials stand for:  
**rsa = Rivest + Shamir + Adleman**  
Fucking names! Adi Shamir is an Israeli Jewish, born in 1952, B.sc. in computer science and Mathematics.  
Anyways,  
Within the _options_ of the function we can define a bunch of settings, like the length of the key in bits, and also the encoding of the public & private keys. We'll go with the recommended settings here, and have it return a format of 'pem' (which stands for Privacy Enhanced Mail) to show us the keys in base64 format:

```javascript
const { generateKeyPairSync } = require('crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048, // the length of your key in bits,
  publicKeyEncoding: {
    type: 'spki', // recommended to be 'spki' by the Node.js docs
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8', // recommended to be 'pkcs8' by the Node.js docs
    format: 'pem',
    // cipher: 'aes-256-cbc',
    // passpharse: 'top secret',
  },
});

console.log(publicKey);
console.log(privateKey);

module.exports = { privateKey, publicKey }
```

You could also add a passphrase to your private key for added security (the cipher & passphrase options which are commented out above).

### - Concept 6: ASYMMETRIC ENCRYPTION

And that brings us to asymmetric encryption!  
You use asymmetric encryption any time you go to a website using an https. The browser will automatically find a public key of an SSL certificate installed on the website.

In git, when pushing to a git repository, your private key and the other party's public key are used to encrypt the data which you send over. That prevents hackers from gaining anything useful from it in transit.

On websites, HTTPS uses asymmetric encryption to establish the identity of the parties and to exchange a symmetric key. Then symmetric encryption is used since it's faster.

The implementation in node is very simple. We import `publicEncrypt`, and `privateDecrypt` from node crypto, along with the _public & private keys_ that we generated previously:

```javascript
const { privateEncrypt, publicDecrypt } = require('crypto');
const { publicKey, privateKey } = require('./keypair');
```

we can then encrypt a message or put it in a mailbox by combining the **publicKey** with the **message** itself.

```javascript
// The Frontend:
const { publicDecrypt } = require('crypto');
const { publicKey } = require('./keypair'); // got back from the server! Like an SSL Cert!

const message = 'the british are coming!';

const encryptedData = publicEncrypt(publicKey, Buffer.from(message));

console.log(encryptedData.toString('hex'));
// Send the encrypted message to the server!
```

Notice that we're not providing the message in its original format, rather use a buffer format. It needs to be that way. The `publicEncrypt` function will _encrypt the message_ so that only the owner of the mailbox could read it. At some point in the future, the recipient may want to read the original message, which can be done by calling `privateDecrypt`, along with the _privateKey_ and the `encryptedData`:

```javascript
// The Backend:
const { privateDecrypt } = require('crypto');
const { privateKey } = require('./keypair');

const encryptedData = got it from the frontend….

const decryptedData = privateDecrypt(privateKey, encryptedData);

console.log(decryptedData.toString('utf-8'));
```

This is the "unlock mailbox" operation.

### - Concept 7: SIGNING

Now, encryption is fun, but in many cases you don't actually need to encrypt data, but rather validate that it came from a trusted party. That's where signing comes in.

What is a digital signature?

Let's imagine you're expecting a letter in the mail, with some sensitive information. You need to be able to trust that that letter came from the right person. So you require them to sign it with blood. It also can't be tempered with, so they put a special seal on it...

@@@@@@
envelope signing image
@@@@@@

...that if broken, will indicate that it's been tempered with.  
Digital signatures work in the same basic way.

@@@@@@
blood image
@@@@@@

The sender of the message will use their private key to sign a hash of the original message. The private key guarantees authenticity, like blood, and the hash guarantees that the message can't be tempered with, because it would produce an entirely different signature. The recipient can then use the publicKey to validate the authenticity of the message.

@@@@@@
verify image
@@@@@@

In node, we can create a signature with the createSign function:

```javascript
const { createSign } = require('crypto');
```

then pass in the algorithm that uses the rsa crypto-system sha256 for hashing:

```javascript
const { createSign } = require('crypto');

// SIGN:
const signer = createSign('rsa-sha256');
```

We then update it with the message we want to sign, and create the actual signature with the private key.

```javascript
const { createSign } = require('crypto');
const { privateKey } = require('./keypair');

// SIGN:
const signer = createSign('rsa-sha256');
signer.update(message);
const signature = signer.sign(privateKey, 'hex');
```

We can now attach the signature to the original message, and send it to someone. The message itself can remain un-encrypted, because what this use case is saying: "all I care about is you being who you say you are". When the other side gets it, he can create a verifier, update the original message, and then verify the signature with the sender's public key:

```javascript
const { createSign, createVerify } = require('crypto');
const { privateKey, publicKey } = require('./keypair');

// SIGN:
const signer = createSign('rsa-sha256');
signer.update(message);
const signature = signer.sign(privateKey, 'hex');

// VERIFY:
const verifier = createVerify('rsa-sha256');
verifier.update(message);
const isVerified = verifier.verify(publicKey, signature, 'hex');
```

If the signature was forged, or the message got changed, the verifier will fail. And that gives us 7 cryptography concepts that every developer should know:

@@@@@@
all concepts image
@@@@@@

## 3. Summary

### - A. Create Hash

Command structure:

```javascript
function hash(value){
  return createHash('sha256').update(value).digest('hex');
}

const password = 'hi-mom!';
const hash1 = hash(password);

console.log(hash1);
// would print: 7a5d84e61a2234b450185fde58c237bb13e93d93d90f669b114d

// compare two hashed passwords:
const password2 = 'hi-mom!';
const hash2 = hash(password);
const isMatch = hash1 === hash2;
console.log(isMatch); // would print out: true
```

#### • Algorithm:

The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.

- sha256
- sha512
- md5
- argon2 (not built-in to node's crypto)

#### • Encoding:

Here is the list of all encoding options that digest accepts:

- hex (what we will use)
- base64 (an option you'll commonly see)
- utf8 (utf-8 is an alias)
- utf16le (utf-16le is an alias)
- latin1

### - B. Create Salt

```javascript
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

async function signUp( email, password ){
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');

  const user = { email, hashedPassword, salt };
  const data = await Users.register(user);

  return data;
}

async function login(email,password){
  const user = await Users.findUserByEmail(email);
  const { salt, hashedPassword } = user;

  const rawHashedPasswordBuffer = scryptSync(rawPassword, salt, 64);
  const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');
  const match = timingSafeEqual(rawHashedPasswordBuffer, hashedPasswordBuffer);

  return match ? 'login success!' : 'login failed...';
}
```
