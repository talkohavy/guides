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
            <saml2:Attribute Name="https://...">
                <saml2:AttributeValue>Scott</saml2:AttributeValue>
            </saml2:Attribute>

            <!-- Attribute Value 2 -->
            <saml2:Attribute Name="https://...">
                <saml2:AttributeValue>Johnson</saml2:AttributeValue>
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

---

## 6. Quick Summary

- `AssertionConsumerServiceUrl` = Where they want the response to be returned to.

When someone asks you what protocols you support, you can confidently say:  
_"I support/implemented SAML 2.0 Web SSO Profile"_
