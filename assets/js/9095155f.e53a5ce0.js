"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[2137],{8561:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>c,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"programming/certificates","title":"Creating a Self-Signed Certificate","description":"Creating a Certificate With OpenSSL","source":"@site/docs/programming/certificates.md","sourceDirName":"programming","slug":"/programming/certificates","permalink":"/guides/docs/programming/certificates","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/certificates.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- Crypto","permalink":"/guides/docs/programming/crypto"},"next":{"title":"- CSS","permalink":"/guides/docs/programming/css"}}');var s=i(6070),r=i(7010);const c={},a="Creating a Self-Signed Certificate",l={},o=[{value:"0. TLDR;",id:"0-tldr",level:2},{value:"- Step 1: create 2 private-keys - 1 for the CA &amp; 1 for the server",id:"--step-1-create-2-private-keys---1-for-the-ca--1-for-the-server",level:3},{value:"- Step 2: Create a root CA Certificate",id:"--step-2-create-a-root-ca-certificate",level:3},{value:"- Step 3: Create a Certificate Signing Request (CSR)",id:"--step-3-create-a-certificate-signing-request-csr",level:3},{value:"- Step 4: Create a Server Certificate",id:"--step-4-create-a-server-certificate",level:3},{value:"- Step 4.5: Check out its contents",id:"--step-45-check-out-its-contents",level:3},{value:"- Step 5: Create PEM file",id:"--step-5-create-pem-file",level:3},{value:"1. Connection Flow",id:"1-connection-flow",level:2},{value:"- Step 1: Client Says &quot;Hello&quot; (Connection Initiation)",id:"--step-1-client-says-hello-connection-initiation",level:3},{value:"- Step 2: Server Responds with its Identity",id:"--step-2-server-responds-with-its-identity",level:3},{value:"- Step 3: Client Verifies the Server&#39;s Identity",id:"--step-3-client-verifies-the-servers-identity",level:3},{value:"- Step 3.5: Server Verifies the Client&#39;s Identity",id:"--step-35-server-verifies-the-clients-identity",level:3},{value:"- Step 4: TLS Handshake (Establishing a Secure Channel)",id:"--step-4-tls-handshake-establishing-a-secure-channel",level:3},{value:"2. Creating a Private Key",id:"2-creating-a-private-key",level:2},{value:"- A. Create an unencrypted Private Key",id:"--a-create-an-unencrypted-private-key",level:3},{value:"- B. Create an encrypted Private Key",id:"--b-create-an-encrypted-private-key",level:3},{value:"3. Creating the Certificate Authority (CA)",id:"3-creating-the-certificate-authority-ca",level:2},{value:"Intro",id:"intro",level:3},{value:"- Step 1: Generate the CA&#39;s Private Key",id:"--step-1-generate-the-cas-private-key",level:3},{value:"- step 2: Create the CA Certificate",id:"--step-2-create-the-ca-certificate",level:3},{value:"- The Command:",id:"--the-command",level:4},{value:"- Description",id:"--description",level:4},{value:"4. Creating a Certificate Signing Request",id:"4-creating-a-certificate-signing-request",level:2},{value:"Intro:",id:"intro-1",level:3},{value:"In Practice:",id:"in-practice",level:3},{value:"More Info:",id:"more-info",level:3},{value:"5. Creating a Server/Client Certificate",id:"5-creating-a-serverclient-certificate",level:2},{value:"Intro:",id:"intro-2",level:3},{value:"In practice:",id:"in-practice-1",level:3},{value:"More Info:",id:"more-info-1",level:3},{value:"6. Creating a Self-Signed Certificate",id:"6-creating-a-self-signed-certificate",level:2},{value:"7. Create a PEM file",id:"7-create-a-pem-file",level:2},{value:"- A. Intro",id:"--a-intro",level:3},{value:"- B. Creation",id:"--b-creation",level:3},{value:"-C. What is the Combine Step?",id:"-c-what-is-the-combine-step",level:3},{value:"8. View Certificates",id:"8-view-certificates",level:2},{value:"Q&amp;A",id:"qa",level:3},{value:"Q1: When a certificate expires, does the server to create a new csr? or can it use the previous one?",id:"q1-when-a-certificate-expires-does-the-server-to-create-a-new-csr-or-can-it-use-the-previous-one",level:4}];function h(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"creating-a-self-signed-certificate",children:"Creating a Self-Signed Certificate"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:(0,s.jsx)("font",{size:"5",children:"Creating a Certificate With OpenSSL"})})}),"\n",(0,s.jsx)(n.h2,{id:"0-tldr",children:"0. TLDR;"}),"\n",(0,s.jsx)(n.p,{children:"You need a self-signed certificate."}),"\n",(0,s.jsx)(n.h3,{id:"--step-1-create-2-private-keys---1-for-the-ca--1-for-the-server",children:"- Step 1: create 2 private-keys - 1 for the CA & 1 for the server"}),"\n",(0,s.jsx)(n.p,{children:"For the CA:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl genrsa -out rootCA.key 4096\n"})}),"\n",(0,s.jsx)(n.p,{children:"For the server:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl genrsa -out server.key 4096\n"})}),"\n",(0,s.jsx)(n.h3,{id:"--step-2-create-a-root-ca-certificate",children:"- Step 2: Create a root CA Certificate"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'openssl req -x509 -key rootCA.key -sha256 -days 1825 -out rootCA.crt -subj "/CN=MyCA"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"--step-3-create-a-certificate-signing-request-csr",children:"- Step 3: Create a Certificate Signing Request (CSR)"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -key server.key -new -out server.csr\n"})}),"\n",(0,s.jsx)(n.p,{children:"Example input:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"country: il\nstate: ''\ncity: New-R-Gan\nOrganization name: luckylove\nOrganizational Unit Name: ''\nCommon name: luckylove1.co.il\nEmail-Address: talkohavy@gmail.com\nA-challenge-password: w1234\nCompany-name: luckylove\n"})}),"\n",(0,s.jsx)(n.h3,{id:"--step-4-create-a-server-certificate",children:"- Step 4: Create a Server Certificate"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'openssl x509 -CA rootCA.crt -CAkey rootCA.key -in server.csr -req -days 365 -subj "/CN=localhost" -out server.crt\n'})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"-days"})," option specifies the number of days that the certificate will be valid.",(0,s.jsx)(n.br,{}),"\n","The ",(0,s.jsx)(n.code,{children:"-subj"})," option is optional, but is recommended, since some tools will give a warning notice for an empty subject, like ",(0,s.jsx)(n.code,{children:"mongosh"}),". Its value ",(0,s.jsx)(n.strong,{children:"MUST"})," match the domain name of the server. For example, if we're talking about a mongodb server, to which the client connects with ",(0,s.jsx)(n.code,{children:"mongosh --host localhost:27017"}),", the ",(0,s.jsx)(n.code,{children:"CN"})," value needs to be ",(0,s.jsx)(n.code,{children:"localhost"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"--step-45-check-out-its-contents",children:"- Step 4.5: Check out its contents"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -in server.crt -text -noout\n"})}),"\n",(0,s.jsx)(n.h3,{id:"--step-5-create-pem-file",children:"- Step 5: Create PEM file"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat server.crt server.key > server.pem\n"})}),"\n",(0,s.jsx)(n.p,{children:"The server settings will most likely require 2 files:"}),"\n",(0,s.jsxs)(n.p,{children:["-- ",(0,s.jsx)(n.code,{children:"server.pem"})," (which includes ",(0,s.jsx)(n.code,{children:"server.crt"})," & ",(0,s.jsx)(n.code,{children:"server.key"}),")\n-- ",(0,s.jsx)(n.code,{children:"rootCA.crt"})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"1-connection-flow",children:"1. Connection Flow"}),"\n",(0,s.jsx)(n.p,{children:"We want to achieve a secure connection between a client and a server. For that, we need 3 things, a client, a server, and some high authority which both the client and the server trusts."}),"\n",(0,s.jsx)(n.p,{children:"Since we never want to send other people our private key, all 3 of them need to have a public key."}),"\n",(0,s.jsx)(n.p,{children:"What are the prerequisites to having a secure connection?"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The certificate authority (CA) needs to have a private key, a master certificate, that can sign other certificates."}),"\n",(0,s.jsx)(n.li,{children:"The server needs to have a private key, and a certificate signing request (csr)."}),"\n",(0,s.jsxs)(n.li,{children:["The server needs to send the ",(0,s.jsx)(n.code,{children:"csr"})," over to the ",(0,s.jsx)(n.code,{children:"CA"})," to generate a signed certificate (",(0,s.jsx)(n.code,{children:"server.crt"}),")."]}),"\n",(0,s.jsx)(n.li,{children:"The client needs to have a private key, and a certificate signing request (csr)."}),"\n",(0,s.jsxs)(n.li,{children:["The client needs to send the ",(0,s.jsx)(n.code,{children:"csr"})," over to the ",(0,s.jsx)(n.code,{children:"CA"})," to generate a signed certificate (",(0,s.jsx)(n.code,{children:"client.crt"}),")."]}),"\n",(0,s.jsxs)(n.li,{children:["Both the client & server have a copy of ",(0,s.jsx)(n.code,{children:"rootCA.crt"})," locally installed."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"How does a connection flow look like?"}),"\n",(0,s.jsx)(n.h3,{id:"--step-1-client-says-hello-connection-initiation",children:'- Step 1: Client Says "Hello" (Connection Initiation)'}),"\n",(0,s.jsx)(n.p,{children:'The client begins the connection process by saying to the server: "Hey, I want to connect to you, but I want to do it securely using TLS."'}),"\n",(0,s.jsx)(n.h3,{id:"--step-2-server-responds-with-its-identity",children:"- Step 2: Server Responds with its Identity"}),"\n",(0,s.jsxs)(n.p,{children:["The server responds by saying: \"Sure, I support TLS! Here's my server certificate (",(0,s.jsx)(n.code,{children:"server.crt"}),'). You can use this to confirm who I am."',(0,s.jsx)(n.br,{}),"\n","The server certificate includes:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The server's identity (e.g., ",(0,s.jsx)(n.code,{children:"CN=YourMongoDBServer"}),")."]}),"\n",(0,s.jsx)(n.li,{children:"The server's public key (used for encryption)."}),"\n",(0,s.jsxs)(n.li,{children:["A signature from the ",(0,s.jsx)(n.code,{children:"CA"})," (to prove it's legitimate)."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--step-3-client-verifies-the-servers-identity",children:"- Step 3: Client Verifies the Server's Identity"}),"\n",(0,s.jsxs)(n.p,{children:["The client Verifies the Server's Identity (the ",(0,s.jsx)(n.code,{children:"server.crt"}),") using the ",(0,s.jsx)(n.code,{children:"rootCA.crt"})," to check whether the server's certificate can be trusted:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Is this certificate valid?"})," The client ensures the server certificate hasn't expired and is properly signed."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Who signed it?"})," The client checks whether the CA that signed the server certificate is the same trusted CA whose certificate is in ",(0,s.jsx)(n.code,{children:"rootCA.crt"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Does the identity match?"})," The client checks that the ",(0,s.jsx)(n.code,{children:"CN"})," (Common Name) in the server certificate matches the hostname (",(0,s.jsx)(n.code,{children:"localhost"})," in this case)."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["If the server's certificate passes these checks, ",(0,s.jsx)(n.strong,{children:"the client saves the server's public key"}),' for later use, and says: "Okay, I trust you. Let\'s keep talking".']}),"\n",(0,s.jsx)(n.p,{children:"If the certificate is invalid (e.g., expired, not signed by the CA, or the CN doesn't match), the client refuses to connect."}),"\n",(0,s.jsx)(n.h3,{id:"--step-35-server-verifies-the-clients-identity",children:"- Step 3.5: Server Verifies the Client's Identity"}),"\n",(0,s.jsxs)(n.p,{children:["If the server is configured to require mutual authentication, the client sends over its ",(0,s.jsx)(n.code,{children:"client.crt"})," to be examined, and now the server performs a similar process:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The server examines the client's certificate (",(0,s.jsx)(n.code,{children:"client.crt"}),") using the ",(0,s.jsx)(n.code,{children:"rootCA.crt"})," to verify that:"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["It's signed by the trusted ",(0,s.jsx)(n.code,{children:"CA"})," (from the server's configuration)."]}),"\n",(0,s.jsx)(n.li,{children:"It hasn't expired."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsxs)(n.li,{children:["The server checks whether the client's identity (from the ",(0,s.jsx)(n.code,{children:"CN"})," in the client certificate) is allowed to connect."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["If the client's certificate passes these checks, ",(0,s.jsx)(n.strong,{children:"the server saves the client's public key"}),' for later use, and says: "Okay, I trust you too. Let\'s continue".']}),"\n",(0,s.jsx)(n.p,{children:"If the client's certificate is invalid, the server terminates the connection."}),"\n",(0,s.jsx)(n.h3,{id:"--step-4-tls-handshake-establishing-a-secure-channel",children:"- Step 4: TLS Handshake (Establishing a Secure Channel)"}),"\n",(0,s.jsx)(n.p,{children:"At this point:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"The client and server have both verified each other's identities."}),"\n",(0,s.jsx)(n.li,{children:"They now need to agree on encryption keys to secure their communication:"}),"\n"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["They use each other's public keys (from the certificates) ",(0,s.jsx)(n.strong,{children:"to securely exchange a shared session key"})," (also known as the ",(0,s.jsx)(n.strong,{children:"pre-master key"}),")."]}),"\n",(0,s.jsx)(n.li,{children:"This session key is used to encrypt and decrypt all communication for the rest of the session."}),"\n",(0,s.jsxs)(n.li,{children:["Once the shared secret (session key) is established, ",(0,s.jsx)(n.strong,{children:"all further communication is encrypted using symmetric encryption"})," (like ",(0,s.jsx)(n.code,{children:"AES"}),"), which is fast and efficient."]}),"\n",(0,s.jsx)(n.li,{children:"The session key is used for encryption/decryption, and it is not part of the certificates."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"This connection flow ensures:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Authentication"}),": Both sides trust each other."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Integrity"}),": No one can tamper with the messages without detection."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Encryption"}),": All communication is scrambled so no one can intercept and read it."]}),"\n"]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"2-creating-a-private-key",children:"2. Creating a Private Key"}),"\n",(0,s.jsx)(n.p,{children:"First, we'll create a private key. A private key helps to enable encryption, and is the most important component of our certificate. Let's create a password-protected, 4096-bit RSA private key (domain.key) with the openssl command:"}),"\n",(0,s.jsx)(n.h3,{id:"--a-create-an-unencrypted-private-key",children:"- A. Create an unencrypted Private Key"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl genrsa -out private.key 4096\n"})}),"\n",(0,s.jsx)(n.p,{children:"An example output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"-----BEGIN PRIVATE KEY-----\nMIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICAQCiCnDh3cyac+iZ\nc+ugEUconmpZHuw9iTCP9BFMu3iKOMasbGCAdxk5noaNVs9S1T+qMfhfKDHlIRjb\nbuvjn0JLx4HDHLa0233z9cvn8YmRnZUY0lzL8DdQJoawQ4Im0GctQMAKmGVM0GNO\nOy5EfTvfjQSUagqNrolTGgJAwirJQvGOrMlTJ2kN7GjqG+TQkqcDTnn7SPSikL7L\nBSDBFCqSU86twfGfqQI2gpY9jepNPmwtx3UgmiTrwJ1Lbu2QZxf/s2+3xl4eP1ny\n# ...\nEQnXsglVJ+Zn3cEbxqfdcCh+21oNtKnGgyrXIRn0o/jpvE1KthpmFU3qhm8MP/4N\n+cHVrSJVZE8LIevQ8OBMu8W+I02wkf+yq4DzW5yEJ6LKCZfRyvAgEeH4+pSVXvIR\n6s2wHB2AQ+VdZoud7C57pK9HNM/7jeDvsptROWiFaMVnp0HPreTvX3RYGtDt2ul4\ndA0vngyFvnnswjHUc+9zlmDOFyW8Eg==\n-----END PRIVATE KEY-----\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Notice the title which says: ",(0,s.jsx)(n.strong,{children:"-----BEGIN PRIVATE KEY-----"}),". That's how you know that the private key in not encrypted, because an encrypted key starts with: ",(0,s.jsx)(n.strong,{children:"-----BEGIN ENCRYPTED PRIVATE KEY-----"})]}),"\n",(0,s.jsx)(n.h3,{id:"--b-create-an-encrypted-private-key",children:"- B. Create an encrypted Private Key"}),"\n",(0,s.jsx)(n.p,{children:"You can also create an encrypted Private Key, by using one of the following flags:"}),"\n",(0,s.jsx)(n.p,{children:"-aes128, -aes192, -aes256, -aria128, -aria192, -aria256, -camellia128, -camellia192, -camellia256, -des, -des3, -idea"}),"\n",(0,s.jsxs)(n.p,{children:["Each flags marks a different encryption option. When choosing to encrypt the private key you ",(0,s.jsx)(n.strong,{children:"MUST"})," provide a passphrase. This is required in order to encrypt the key. These options encrypt the private key with specified cipher before outputting it. If none of these options is specified no encryption is used (just like we did above). If encryption is selected, you'll be prompted to provide a pass phrase, if one is not supplied via the ",(0,s.jsx)(n.code,{children:"-passout"})," argument."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl genrsa -des3 -out private.key 4096\n"})}),"\n",(0,s.jsx)(n.p,{children:"An example output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIJpDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQuI81YpJrz6WBt9bu\nQdeExAICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQIb4o7RkR+rRoEgglI\n9P9W9+YIFdoIQOPI3gARRxD5PQU0A+wedwGZyulCYo5oR/gCGQAdX+p7jVGMuP3p\n# ...\n6sIsTWWfIPfWvfTnGoD+s+oCv7UBr0c9y3y92S01mZoAu/1Ia/HSXpIKvblJ1bG8\n5/ROkbpxDxd6n6GeShDQnVN+5UUk+910u+Brk/G6GBZe7+GblYV0Nbao+EdFg37T\n9F5mHITPiyjzVGyW5ITpE7ebNIhKox0b\n-----END ENCRYPTED PRIVATE KEY-----\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"3-creating-the-certificate-authority-ca",children:"3. Creating the Certificate Authority (CA)"}),"\n",(0,s.jsx)(n.h3,{id:"intro",children:"Intro"}),"\n",(0,s.jsxs)(n.p,{children:["We can be our own certificate authority (CA) by creating a ",(0,s.jsx)(n.strong,{children:"self-signed root CA certificate"}),", and then installing it as a trusted certificate in the local browser.",(0,s.jsx)(n.br,{}),"\n","The next commands will set up your Certificate Authority, which is the trusted entity that signs other certificates (server and client certificates)."]}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a private key (rootCA.key) and a self-signed root CA certificate (",(0,s.jsx)(n.code,{children:"rootCA.crt"}),") from the command line:"]}),"\n",(0,s.jsx)(n.h3,{id:"--step-1-generate-the-cas-private-key",children:"- Step 1: Generate the CA's Private Key"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl genrsa -out ca.key 4096\n"})}),"\n",(0,s.jsx)(n.p,{children:'This private key is the "secret ingredient" of your CA. It must be kept safe because it\'s used to sign certificates and validate identities.'}),"\n",(0,s.jsx)(n.h3,{id:"--step-2-create-the-ca-certificate",children:"- step 2: Create the CA Certificate"}),"\n",(0,s.jsx)(n.h4,{id:"--the-command",children:"- The Command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'openssl req -x509 -key rootCA.key -sha256 -days 1825 -out rootCA.crt -subj "/CN=MyCA"\n'})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"req"}),': openSSL sub-command which stands for "request." It is used to generate a certificate.']}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-x509"}),": This option outputs a certificate instead of a certificate request. This is typically used to generate test certificates. This option implies the ",(0,s.jsx)(n.code,{children:"-new"})," flag if ",(0,s.jsx)(n.code,{children:"-in"})," is not given."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-key ca.key"}),": Uses the private key (ca.key) we just generated to sign the new certificate or certificate request. The corresponding public key is placed in the new certificate or certificate request, resulting in a self-signature (Unless ",(0,s.jsx)(n.code,{children:"-in"})," is given, see ",(0,s.jsx)(n.code,{children:"-in"}),")."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-sha256"}),": Specifies the hashing algorithm (SHA-256 is secure and widely used)."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-days 365"}),": Sets the validity period of the certificate to 365 days."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-out rootCA.crt"}),": Saves the generated certificate to ",(0,s.jsx)(n.code,{children:"rootCA.crt"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:'-subj "/CN=MyCA"'}),': Provides the "Subject" field of the certificate, where CN is the Common Name (e.g., the name of your CA).']}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"-new"}),": Implied by -x509. Indicates that this is a new certificate request."]}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"--description",children:"- Description"}),"\n",(0,s.jsx)(n.p,{children:'Creating the CA certificate will help us generate certificates for both the client and the server. Each one will "send" the CA:'}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"a public key"}),"\n",(0,s.jsx)(n.li,{children:"a csr"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["for which the CA will generate a signed certificate for them to use.",(0,s.jsx)(n.br,{}),"\n","Plus, each side (client & server) will get the CA's public key, with which they could verify each other's certificates."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"4-creating-a-certificate-signing-request",children:"4. Creating a Certificate Signing Request"}),"\n",(0,s.jsx)(n.h3,{id:"intro-1",children:"Intro:"}),"\n",(0,s.jsx)(n.p,{children:"Both the client & server each need to:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"have a private key of their own."}),"\n",(0,s.jsx)(n.li,{children:"create a csr (certificate signing request)."}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -key private.key -new -out request.csr\n"})}),"\n",(0,s.jsx)(n.h3,{id:"in-practice",children:"In Practice:"}),"\n",(0,s.jsx)(n.p,{children:"Using it in practice would mean:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -key client.key -new -out client.csr\n"})}),"\n",(0,s.jsx)(n.p,{children:"And:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -key server.key -new -out server.csr\n"})}),"\n",(0,s.jsx)(n.h3,{id:"more-info",children:"More Info:"}),"\n",(0,s.jsxs)(n.p,{children:["If the private.key included a passphrase, you'll be asked to enter it here.",(0,s.jsx)(n.br,{}),"\n","Now you'll be asked to provide some CSR information to complete the process.",(0,s.jsx)(n.br,{}),"\n","The CSR information will include:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:['"Common Name" (CN), which is an important field, and should be the EXACT ',(0,s.jsx)(n.strong,{children:"Fully Qualified Domain Name"})," (FQDN) of our domain."]}),"\n",(0,s.jsx)(n.li,{children:"A challenge password."}),"\n",(0,s.jsx)(n.li,{children:"An company name (optional). Can leave empty."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"We can also create both the private key and CSR with a single command:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -newkey rsa:2048 -keyout private.key -out request.csr\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Or, if we want our private key unencrypted, we can add the ",(0,s.jsx)(n.code,{children:"-nodes"})," option:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -newkey rsa:2048 -nodes -keyout private.key -out request.csr\n"})}),"\n",(0,s.jsxs)(n.p,{children:["NOTE! The ",(0,s.jsx)(n.code,{children:"-nodes"})," flag is only relevant if you're creating a new private key! The ",(0,s.jsx)(n.code,{children:"-nodes"})," flag is ignored when using it along with the ",(0,s.jsx)(n.code,{children:"-key"})," flag, which grabs an already existing key as value.",(0,s.jsx)(n.br,{}),"\n","The ",(0,s.jsx)(n.code,{children:"-nodes"}),' flag in the openssl req command means "no DES encryption". Specifically, it tells OpenSSL not to encrypt the private key when generating the certificate or a Certificate Signing Request (CSR). Without ',(0,s.jsx)(n.code,{children:"-nodes"}),", OpenSSL will prompt you to set a passphrase to encrypt the private key."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"5-creating-a-serverclient-certificate",children:"5. Creating a Server/Client Certificate"}),"\n",(0,s.jsx)(n.h3,{id:"intro-2",children:"Intro:"}),"\n",(0,s.jsxs)(n.p,{children:["Let's now sign those ",(0,s.jsx)(n.code,{children:"csr"}),"s, using the CA, and generate certificates:",(0,s.jsx)(n.br,{}),"\n","(",(0,s.jsx)(n.strong,{children:"recommended"}),")"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -CA rootCA.crt -CAkey rootCA.key -in request.csr -req -days 365 -out certificate.crt\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Or... (",(0,s.jsx)(n.strong,{children:"not recommended"}),")"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -signkey rootCA.key -in request.csr -req -days 365 -out certificate.crt\n"})}),"\n",(0,s.jsx)(n.h3,{id:"in-practice-1",children:"In practice:"}),"\n",(0,s.jsx)(n.p,{children:"We will use this command to create one certificate for the server, and one certificate for the client."}),"\n",(0,s.jsx)(n.p,{children:"So in practice, it'll be:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -CA rootCA.crt -CAkey rootCA.key -in client.csr -req -days 365 -out client.crt\n"})}),"\n",(0,s.jsx)(n.p,{children:"And:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'openssl x509 -CA rootCA.crt -CAkey rootCA.key -in server.csr -req -days 365 -subj "/CN=localhost" -out server.crt\n'})}),"\n",(0,s.jsx)(n.h3,{id:"more-info-1",children:"More Info:"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"-days"})," option specifies the number of days that the certificate will be valid.",(0,s.jsx)(n.br,{}),"\n","The ",(0,s.jsx)(n.code,{children:"-subj"})," option is optional, but is recommended, since some tools will give a warning notice for an empty subject, like ",(0,s.jsx)(n.code,{children:"mongosh"}),". Its value ",(0,s.jsx)(n.strong,{children:"MUST"})," match the domain name of the server. For example, if we're talking about a mongodb server, to which the client connects with ",(0,s.jsx)(n.code,{children:"mongosh --host localhost:27017"}),", the ",(0,s.jsx)(n.code,{children:"CN"})," value needs to be ",(0,s.jsx)(n.code,{children:"localhost"}),"."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"6-creating-a-self-signed-certificate",children:"6. Creating a Self-Signed Certificate"}),"\n",(0,s.jsxs)(n.p,{children:["Instead of all that we did above, we can simply create a Self-Signed Certificate. A self-signed certificate is ",(0,s.jsx)(n.strong,{children:"a certificate that's created by an entity, for that entity, signed by that entity's own private key"}),". It can be used to encrypt data just as well as CA-signed certificates, but our users will be shown a warning that says the certificate isn't trusted."]}),"\n",(0,s.jsx)(n.p,{children:"Let's create a self-signed certificate from an existing private:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -key private.key -new -x509 -days 365 -out certificate.crt\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"The above command will create an on-demand CSR on-the-fly"}),". We would of course still need to provide the CSR information as a prompt. We can even create a private key and a self-signed certificate with just a single command:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl req -newkey rsa:2048 -keyout private.key -x509 -days 365 -out certificate.crt\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"7-create-a-pem-file",children:"7. Create a PEM file"}),"\n",(0,s.jsx)(n.h3,{id:"--a-intro",children:"- A. Intro"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"PEM"})," stands for ",(0,s.jsx)(n.strong,{children:"Privacy-Enhanced Mail"}),", but don't let the name fool you \u2014 it's widely used for certificates and cryptographic data today. A ",(0,s.jsx)(n.strong,{children:"PEM"})," file is simply a text file that encodes:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Certificates"}),"\n",(0,s.jsx)(n.li,{children:"Private keys"}),"\n",(0,s.jsx)(n.li,{children:"Other cryptographic information"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"PEM"})," is the most widely used format. Text-based and Base64-encoded. Easy to read and combine.",(0,s.jsx)(n.br,{}),"\n","Other formats are: ",(0,s.jsx)(n.strong,{children:"DER"})," and ",(0,s.jsx)(n.strong,{children:"PFX/PKCS#12"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"PEM"})," files are easy to recognize because they:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Use Base64 encoding to store binary data."}),"\n",(0,s.jsxs)(n.li,{children:["Contain special header and footer lines, such as:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"For a certificate:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"-----BEGIN CERTIFICATE-----\n(Base64-encoded certificate data)\n-----END CERTIFICATE-----\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"For a private key:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"-----BEGIN PRIVATE KEY-----\n(Base64-encoded private key data)\n-----END PRIVATE KEY-----\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--b-creation",children:"- B. Creation"}),"\n",(0,s.jsxs)(n.p,{children:["We combine ",(0,s.jsx)(n.code,{children:"server.crt"})," and ",(0,s.jsx)(n.code,{children:"server.key"})," into a PEM file:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat server.crt server.key > server.pem\n"})}),"\n",(0,s.jsx)(n.p,{children:"We do the same for the client:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat client.crt client.key > client.pem\n"})}),"\n",(0,s.jsx)(n.h3,{id:"-c-what-is-the-combine-step",children:"-C. What is the Combine Step?"}),"\n",(0,s.jsxs)(n.p,{children:['The "combine step" involves merging a ',(0,s.jsx)(n.strong,{children:"certificate file"})," (",(0,s.jsx)(n.code,{children:".crt"}),") with its corresponding ",(0,s.jsx)(n.strong,{children:"private key"})," file (",(0,s.jsx)(n.code,{children:".key"}),") into a single file, typically in the ",(0,s.jsx)(n.strong,{children:"PEM"})," format."]}),"\n",(0,s.jsx)(n.p,{children:"Why is it Needed?"}),"\n",(0,s.jsx)(n.p,{children:"Certificates and Keys Work Together:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["A certificate (",(0,s.jsx)(n.code,{children:".crt"}),") is the ",(0,s.jsx)(n.strong,{children:"public-facing proof of identity"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["A private key (",(0,s.jsx)(n.code,{children:".key"}),") is the secret ingredient that allows the server or client to use the certificate securely."]}),"\n",(0,s.jsx)(n.li,{children:'Together, they form a "key pair" used to establish encrypted and authenticated connections.'}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["The server (or client) needs access to both the certificate and the private key ",(0,s.jsx)(n.strong,{children:"in one place"})," for secure communication."]}),"\n",(0,s.jsxs)(n.p,{children:["By combining them, tools like ",(0,s.jsx)(n.code,{children:"mongod"})," or ",(0,s.jsx)(n.code,{children:"mongosh"})," only need to reference one file (e.g., ",(0,s.jsx)(n.code,{children:"server.pem"}),"), simplifying configuration and avoiding mismatches between separate ",(0,s.jsx)(n.code,{children:".crt"})," and ",(0,s.jsx)(n.code,{children:".key"})," files."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"8-view-certificates",children:"8. View Certificates"}),"\n",(0,s.jsx)(n.p,{children:"We can use the openssl command to view the contents of our certificate in plain text:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -in certificate.crt -text -noout\n"})}),"\n",(0,s.jsxs)(n.p,{children:["It works even if it's inside a ",(0,s.jsx)(n.code,{children:".pem"})," file:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"openssl x509 -in cert.pem -noout -text\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"qa",children:"Q&A"}),"\n",(0,s.jsx)(n.h4,{id:"q1-when-a-certificate-expires-does-the-server-to-create-a-new-csr-or-can-it-use-the-previous-one",children:"Q1: When a certificate expires, does the server to create a new csr? or can it use the previous one?"}),"\n",(0,s.jsxs)(n.p,{children:["Technically, you ",(0,s.jsx)(n.strong,{children:"can reuse the previously created CSR"})," if:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The private key has not changed."}),"\n",(0,s.jsx)(n.li,{children:"The CSR still contains accurate and relevant information."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["However, ",(0,s.jsx)(n.strong,{children:"this is not recommended"})," because:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The old CSR might have outdated information (e.g., expiration dates or organizational changes)."}),"\n",(0,s.jsx)(n.li,{children:"Best practices suggest creating a fresh CSR to avoid confusion and errors."}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},7010:(e,n,i)=>{i.d(n,{R:()=>c,x:()=>a});var t=i(758);const s={},r=t.createContext(s);function c(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);