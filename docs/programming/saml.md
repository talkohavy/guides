---
sidebar_label: '18. SAML'
sidebar_position: 17
---

# Guide on SAML

## 1. SAML: The Good Parts

- Web SSO
- SLO (Single-Log-Out)
- Artifact Binding

---

## 2. SAML Flow

The user access an application in the browser, and says "hey i would like to use this website". He now needs to authenticate. The service provider then generates a SAML AuthenticationRequest, and sends it to the IdP. Upon successful authentication, the IdP sends back a SAML Response, containing an Assertion that describes the user.

For Web SSO, the SAML AuthenticationRequest is sent directly to the IdP’s Single-Sign-On endpoint, and the response is sent to the service provider’s **Assertion Consumer Service Endpoint**, otherwise known as the ACS Endpoint. You can also send a RelayState, which gets round-tripped between the SP and the IdP. This is like a State parameter, which was initially designed for remembering information about the initial request that the user made. For instance, it could say "Hey, before the user sent the authentication request, he was trying to access the /accounts page".

This is a full browser redirect, where the user finds himself meeting a login page. Once they authenticate themselves, the IdP will generate a SAML response, that will contain what’s known as a SAML assertion. The assertion will contain details about how the user authenticated, and the user’s identity. Again, this is a redirect where the service provider finds itself with both the SAML response and the user themselves. If everything checks out, the service provider can start a session for the user, provide them with a cookie, and let them in.

The next service provider that the user attempts to use will again create a SAML authentication request, and redirect to the identity provider. However, this time the identity provider already knows who the user is. The user has their own single-sign-on session with the identity provider. As a result, the identity provider will automatically create a response and assertion without the need for user interaction.

## 3. SAML V.S. OpenID Connect

...

---

## 4. The SAML Authentication Request

### - The Required Fields

The attribute & elements mentioned below are the bare minimum of what a SAML AuthenticationRequest should include:

```xml
<saml2p:AuthnRequest
  xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_e3jyf1c2"
  Version="2.0"
  IssueInstant="2020-08-21T09:24:16Z"
  Destination="https://idp.local/saml/sso"
  AssertionConsumerServiceURL="https://idp.local/saml/acs"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
>
    <saml2:Issuer>https://sp.local</saml2:Issuer>
</saml2p:AuthnRequest>
```

#### • Namespace

Since this is our first SAML message, let's take note of the 2 xml namespaces of `SAML protocol` and `SAML assertion`:

```
xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:assertion"
```

Typically, the outer elements describe the **protocol message** fall under the `protocol namespace` (saml2p), where-as the inner elements that describe **the issuer/user** fall under the `assertion namespace` (saml2).

The namespace prefix can be anything you want within reason. There are some outdated integration documents out there that will require you to to use specific prefixes they came up with.

#### • ID, Version, IssueInstant

Now for the first 3 attributes on the SAML protocol message:

```
ID="_e3jyf1c2"
Version="2.0"
IssueInstant="2020-08-21T09:24:16Z"
```

This 3 attributes are required for every single SAML message type, from **AuthenticationRequests** to **LogoutResponses**.

- **ID** = An id for the specific request. A request id.
- **Version** = The version of the SAML protocol.
- **IssueInstant** = The UTC datetime for when the message was created.

While some SAML messages allow you to include an explicit expiry, it's good practice to evaluate the `IssueInstant` independently. For instance, if you received a request that is over 30 minutes old, then it's a good signal that something is amiss and that you should no longer trust the request.

#### • Destination

Another value present on all SAML messages is the `Destination` attribute.

```
Destination="https://idp.local/saml/sso"
```

This attribute's value should be _the URL to which this message was sent to_. Officially? This attribute is optional, but without it, the message contains no indication of who it is intended for. If this value is not what you'd expect, that's another signal that something is wrong, and that you should stop processing the request. Unfortunately, _because_ this is optional within the SAML specification, not everyone support this attribute. For a modern SAML implementation, I would recommend requiring the `Destination` attribute when validating SAML messages, and merely _disable_ the validation step for those providers that do not support it.

#### • AssertionConsumerServiceURL & ProtocolBinding

Now let's move on to **attributes** specific to **authentication requests**, which are the `AssertionConsumerServiceURL` & the `ProtocolBinding`:

```
AssertionConsumerServiceURL="https://idp.local/saml/acs"
ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
```

These are two things which the **Service Provider** describes to the **Identity Provider**, about where it wants the response to be sent to, and how it wants the response to be sent. This is using one of the `ProtocolBinding` types we saw earlier. An `AssertionConsumerServiceURL` (ACS) and its associating binding types, must be known to the **Identity Provider** ahead of time. These cannot be arbitrary URLs that you want the user to be redirected to after login, but rather an endpoint dedicated to handling SAML responses and assertions. These do not always need to be sent together. Only one can be present, at which point the identity provider is expected to figure out the missing piece.That being said, you typically see these sent together.  
An alternative to the ACS URL and `ProtocolBinding`, is the `AssertionConsumerServiceIndex`. This references a URL and binding pair by its index, by it's unique identifier. This approach is not as common as the explicit URL and binding type. If none of these 3 are present in an authentication request, the identity provider will use the default ACS url and binding type, that has been configured for that service provider.

#### • Issuer

And finally, for a standard authentication request, you have the **Issuer** element:

```xml
<saml2:Issuer>https://sp.local</saml2:Issuer>
```

This value contains the SP's ID, not the user ID! It's the ID of the service provided which created the SAML authentication request. This ID is, of course, known to the IDP ahead of time. Without this, the Identity Provider won't understand who is making the request, or how to validate it.

### - The Optional Fields

Now that we've seen how a standard request looks like, let's take a quick look at some of the popular optional extras that can be used to override the default behavior of an identity provider.

#### • ForceAuthn

This is a boolean value. As its name suggests, **ForceAuthn** is where the service provider's _asking the identity provider to force authentication, even if the user has a an active single-sign-on session_, ignore that, and ask to re-authenticate. Forcing the user to re-identify themselves again can be really useful, when the service provider is authorizing access to a particularly sensitive data. For example, let's say the user is trying to access the service provider's admin area, but they haven't proven their identity in the last 6 hours. As a result, the SP is dubious that the original user is still using their application, and issues a SAML authentication request containing the **ForceAuthn** attribute.

#### • RequestedAuthnContext

A similar concept to the **ForceAuthn** is the **RequestedAuthnContext**. Whereas **ForceAuthn** asks the user to re-authenticate, the **RequestedAuthnContext** ensuures that the user authenticates in a particular way. For instance, that they use a second factor. By default, the user must have authenticated using at least one of the requested methods. This can be overridden using the **Comparison** attribute, where alternative values are `minimum`, `better`, or the slightly bizarre `maximum`.

```
Comparison (`minimum`, `better`, `maximum`)
```

Typically, you only see exact.

#### • IDPList

This IDPList allows for home realm discovery. A technique where the service provider can ask the identity provider to authenticate the user using a specific upstream identify provider. For example, let's say that the SP wants its identity provider to authenticate the user using Google's social authentication. By specifying this in the IDPList, the service provider let's the identity provider know that it can skip the login screen, where the user _could_ authenticate using local credentials, or... let's say Facebook, and instead send them directly to Google. In the same was as **ForceAuthn**, this can also be useful for security decisions. Let's examine the Admin portal example once again. This is somewhere that wouldn't trust users who authenticated using their social media account. It might require that users authenticate using their corporate Active Directory credentials. This is where defining an IDPList comes in handy, by, again, ignoring the current SSO session, and ensuring that a specific identity provider re-authenticates the user.

---

## 5. The SAML Response & Assertion

Let's take a look at a typical SAML response & assertion:

```xml
<saml2p:Response
    xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml2="urn:oasis:names:tc:SAML:2.0:protocol"
    ID="3Dg45X1H"
    Version="2.0"
    IssueInstant="2020-08-21T09:24:16Z"
    Destination="https://localhost:5001/saml/acs"
    InResponseTo="_e3jyf1c2"
>
    <!-- The Issuer: -->
    <saml2:Issuer>https://localhost:5000</saml2:Issuer>

    <!-- The Status: -->
    <saml2p:Status>
        <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success" />
    </saml2p:Status>

    <!-- The Assertion: -->
    <saml2p:Assertion
        ID="_e3jyf1c2"
        Version="2.0"
        IssueInstant="2020-08-21T09:24:16Z"
    >

        <!-- The Issuer: -->
        <saml2:Issuer>https://localhost:5000</saml2:Issuer>

        <!-- The Subject (a.k.a. the user): -->
        <saml2:Subject>

            <!-- The user's name id -->
            <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
                4732361818
            </saml2:NameID>

            <!-- The user's name id -->
            <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">

                <!-- The user's confirmation data -->
                <saml2:SubjectConfirmationData
                    NotOnOrAfter="2020-08-21T09:24:16Z"
                    InResponseTo="_e3jyf1c2"
                    Recipient="https://localhost:5001/saml/acs"
                />

            </saml2:SubjectConfirmation>

        </saml2:Subject>

        <!-- Conditions -->
        <saml2:Conditions
            NotBefore="2020-08-21T09:24:16Z"
            NotOnOrAfter="2020-08-21T09:24:16Z"
        >

            <!-- AudienceRestriction -->
            <saml2:AudienceRestriction
                NotBefore="2020-08-21T09:24:16Z"
                NotOnOrAfter="2020-08-21T09:24:16Z"
            >

                <!-- Audience -->
                <saml2:Audience>https://localhost:5001</saml2:Audience>

            </saml2:AudienceRestriction>

        </saml2:Conditions>

        <!-- Attribute Statement -->
        <saml2:AttributeStatement>

            <!-- Attribute Value 1 -->
            <saml2:Attribute Name="urn:oasis:names:tc:SAML:attribute:pairwise-id">
                <saml2:AttributeValue>c8b7bc2981d</saml2:AttributeValue>
            </saml2:Attribute>

            <!-- Attribute Value 2 -->
            <saml2:Attribute Name="https://...">
                <saml2:AttributeValue>Scott Johnson</saml2:AttributeValue>
            </saml2:Attribute>

        </saml2:AttributeStatement>

        <!-- Authentication Statement -->
        <saml2:AuthnStatement
            AuthnInstant="2020-10-21-T13:13:13Z"
            SessionIndex="_af123"
        >

            <!-- Authentication Context -->
            <saml2:AuthnContext>

                <!-- Authentication Context Class Ref -->
                <saml2:AuthnContextClassRef>
                    "urn:oasis:names:tc:SAML:2.0:ac:classes:Password"
                </saml2:AuthnContextClassRef>

            </saml2:AuthnContext>

        </saml2:AuthnStatement>



    </saml2p:Assertion>


</saml2p:Response>
```

The outer element is the SAML response.  
This is always the protocol message type returned to a service provider when responding to an AuthenticationRequest. This is true for both success and failure. By now you should be able to recognize most of the initial attributes from the authentication request that you saw before.

Just like the `request`, the `response` uses the SAML `protocol` and `assertion` namespaces. It has **ID**, **Version**, and **IssueInstant** attributes, and an optional **Destination** attribute, which this time points at an assertion consumer service endpoint (ACS) on the service provider.

A `response` also contains the **InResponseTo** value. When responding to an authentication request, this attributes must be present, and must match the ID of the original authentication request. The **InResponseTo** value is essential to validation. By linking a response to an individual request, you prevent the injection of stolen responses. This would involve a similar process to the RelayState we saw earlier, but unlike the RelayState, **InResponseTo** is always included in the SAML messages themselves.

A SAML response also contains an **Issuer** element, however this time it is the entity ID of the identity provider, because that is who is generating the SAML message.

SAML authentication doesn't always go to plan, which is why SAML responses also contain a **Status** element. This itself contains a **StatusCode**, an optional **StatusMessage**, which can often be displayed to the user, and an optional **StatusDetails**. If this a success response, then we have a success **StatusCode**. And if things go wrong, you can send back one of the many error **StatusCode**s, a **StatusMessage**, and a **StatusDetails**.  
In my experience, while there may be many ErrorStatus in the SAML specification, what mainly matters to the SP is whether or not the response was a success. _In order to be a valid response, the response MUST contains an assertion_.

An **assertion** is yet another XML construct. The assertion has its own **ID**, **IssueInstant**, and **Issuer**. This is because a SAML response can contain many assertions, and not all necessarily from the same place.

At the beginning of this course, we said that we would only talk about modern SAML implementations, focusing on Single-Sign-On use cases. As a result, we're going to move forward with the assumption that **a SAML response will only ever contain a single SAML assertion, and that it represents a user**.

This covers our SSO scenario.

A SAML assertion contains a **Subject**, **Conditions**, an **AttributeStatement**, and an **AuthnStatement**.

#### • Subject

The Subject contains the ID of the principal. Our user. The one which our assertion describes. It also contains some details about how you should verify that Subject. Then there's the NameID, which contains a value that represents the user, and the format that value is in. You can then confirm the subject by using the method specified in the **SubjectConfirmation**. In this case it uses the `Bearer` method, which means that possession of the assertion and the subject is enough to verify the assertion, and that you don't need to perform any further actions other than some basic data validation here. An alternative might be to use some sort of proof-of-possession technique, where an assertion and its subject could be further verified to ensure that it was not injected into the browser session in some way.

#### • AuthnStatement

Describe the authentication event itself. The AuthnInstant value tells you when the user last authenticated themselves. This can be useful for long-lived Single-Sign-On sessions, where the user only authenticates once a day. If you think back to our admin portal use-case, where the service provider decided to force re-authentication this is the value that informed that decision.

We then have a **SessionIndex**, which is the ID of the user's Single-Sign-On session at the identity provider. And we'll see this again when we'll discuss **Single-Log-Out**. This may often times be accompanied by a session `NotOnOrAfter` attribute, which is when the user session will end within the identity provider. The service provider could end their session at the same time, but it is not mandatory.

Another useful bit of data is the **AuthnContext**. This describes how the user authenticated using the same values as we saw in the authentication request's requested AuthnContext. If your service provider asks for a specific kind of an authentication mechanism, then this is the value it will need to check to ensure that the identity provider did what it asked.

Last but not least we have the identity data itself in the form of an **AttributeStatement**. This contains many attributes that describe the user's identity. If you come from an OpenID Connect background, these are pretty much **claims**. Name-value pairs where the name is the type. With SAML you can add more context to the attribute name with an optional NameID format, and a friendly name.

#### • NameID

SAML name identifiers are another large part of the SAML specification, that has changed over time to be a lot simpler. In the original specification, SAML defines many different NameID formats and ways to resolve or manage to NameID. However, many SAML implementation take a similar approach to modern protocols, such as OpenID Connect. Rather than support many different formats, the identity provider simply uses the unique ID they hold for that user. This ID should not contain personal information, such as the user's name or email address, and it should not be changeable. As a result, you can get away with using the unspecified NameID format, which leaves it to the recipient to decide how to handle it and any account linking or creation processes. For large-scale identity providers who have concerns about users being tracked across service providers, you can use a pair-wise identifier. This is defined be newer SAML specifications, and allows you to issue a user a unique identifier per service provider. This means that a service provider will always receive the same ID for a specific user, but the same user in another service provider would be represented by a different ID.

Some systems require the **Email Address** as the **NameID**. This can be supported using the email address NameID format, but be aware that you are now using a personal insformation as a unique identifier, and that email addresses can be changed. I recommend avoiding the email address as the NameID wherever possible, and only using an email address as the NameID when dealing with SAML implementations that require it.

---

## 6. SAML Signing

### - A. What Signing give you

As an extra measure of security, the SP and the IDP exchange public keys, and sign messages going back and forth from one another. Yes, you could and should implement the transport layer security, (TLS = Transport Layer Security), but that will only protect the payload while it is in transit. It also doesn't help when you have multiple third parties, who could potentially impersonate one another. This all means that you need some sort of message-level protection, which your applications can verify using provider-specific data, long after transport security has been terminated. SAML achieves this using XML digital signatures and public key cryptography. To create a signature the issuer of the message first runs the message through a hash function, and uses that to create a signature, generated using a private key, that only they know. It then embeds that signature within the message it signed:

```xml
<message>
    <Signature />
</message>
```

When the recipient receives the signed message, it runs it through the same hashing algorithm as the issuer, and uses the issuer's public key to verify the signature. If it validates, this proves that the data was not tempered with, and that it was issued by the known trusted party. An XML signature element typically looks like this:

```xml
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <signedInfo>
        <!-- Canonicalization Method -->
        <CanonicalizationMethod Algorithm="http://..." />

        <!-- Signature Method -->
        <SignatureMethod Algorithm="http://..." />

        <!-- Reference -->
        <Reference URI="#_af23e-7f08-e3bg">

            <!-- Transformation Algorithms -->
            <Transforms>

                <!-- Algorithm 1 -->
                <Transform Algorithm="http://..." />

                <!-- Algorithm 2 -->
                <Transform Algorithm="http://..." />

            </Transforms>

            <DigestMethod Algorithm="http://...#sha256" />

            <DigestValue>mo4/6DT2mT5...KLi=</DigestValue>
        </Reference>
    </signedInfo>

    <!-- Signature Value -->
    <SignatureValue>xmY0cs3gglPjjETZ...fVQ</SignatureValue>
</Signature>
```

The **SignedInfo** element describing how the signature was created, and the **SignatureValue** containing the signature itself.

The **Canonicalization** & **Transforms** tell you how to encode the XML, so that you can generate the exact same value to pass into that hashing algorithm, as the issuer did. In SAML, canonicalization is always exclusive, with or without comments. Transforms are always envelope signatures, and/or exclusive canonicalization. SAML XML signatures must also have a **Reference** value (the URI above) that contains the ID of the element that the signature is for. This MUST reference the parent element of the signature.

We also have the signing algorithm (**SignatureMethod**) that was used to generate the signature. In this case we have rsa-sha256, which means that we used the sha256 hashing algorithm to generate the hash, and RSA for signature generation and validation.

Signature elements can also contain a **KeyInfo** element, which describes the public key the recipient should use to validate the signature. This can contain hints like a key name, but if it contains an actual key, you should only use it as a hint or for debugging. You MUST NOT use it to verify the signature. Keys embedded in the payload itself could have been placed there by an attacker. Only ever trust keys that were provided to you ahead of time.

### - B. Signing a SAML Authentication Request

**Should I sign everything?**

So digital signatures offer a major benefit to the overall security of SAML, but does that mean you need to sign everything?

Let's start with a SAML authentication request:

```xml
<!-- I copy-pasted this from above! -->
<saml2p:AuthnRequest
  xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="_e3jyf1c2"
  Version="2.0"
  IssueInstant="2020-08-21T09:24:16Z"
  Destination="https://idp.local/saml/sso"
  AssertionConsumerServiceURL="https://idp.local/saml/acs"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
>
    <saml2:Issuer>https://sp.local</saml2:Issuer>
</saml2p:AuthnRequest>
```

If this was unsigned, what could and attacker do with it?  
To be fair? There isn't that much of an attack vector here. The urls of the request (Destination, AssertionConsumerServiceURL, and saml2:Issuer) are not arbitrary values. They're all agreed upon ahead of time. If the service provider implemented the cross-site request forgery countermeasures we saw earlier then it is unlikely that modifying the request ID to perform any injection attacks would be possible.

The benefits to signing authentication requests are:

1. Prevent service provider impersonation. It is ensuring that only the service provider can request SAML assertions, and that a malicious third-party cannot.
2. User data leakage. This keeps user data out of the hands of an attacker. However you could argue that assertion encryption would also give you this protection, albeit after user authentication.

In my experience i've seen a 50-50 split in variations in integrations that require SAML request signing. Personally, I recommend enabling it by default, and only ever disabling it for those providers who cannot support it.

### - C. Signing a SAML Response

This one is a lot more obvious. If you don't sign this, the attacker could modify the NameID, and attributes, to impersonate any user, but which part do you sign? The response? Just the assertion? Or both? [Recall the SAML Response format here](#5-the-saml-response--assertion)

If you sign the **entire response message**, then you are inherently also protecting the **assertion**. But what if the **assertion** needs to be refused at some point? After all, it is designed for that, with its own set of timings, validation, and confirmation conditions. In this case you would end up with some unsigned XML, where those values and the user data can start being modified again.

But if you only sign the **assertion**, how do you trust the outer response?

My advice is to always sign the **assertion** itself, and the **outer most element** that contains the assertion.

---

## 7. Quick Summary

- `AssertionConsumerServiceUrl` = Where they want the response to be returned to.

When someone asks you what protocols you support, you can confidently say:  
_"I support/implemented SAML 2.0 Web SSO Profile"_
