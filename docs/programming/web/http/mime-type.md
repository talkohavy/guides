# MIME types

## Description

A **media type** (also known as a **Multipurpose Internet Mail Extensions** or MIME type) indicates the nature and format of a document, file, or assortment of bytes. MIME types are defined and standardized in IETF's RFC 6838.

The [Internet Assigned Numbers Authority (IANA)](https://www.iana.org/) is responsible for all official MIME types, and you can find the most up-to-date and complete list at their [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) page.

:::warning
Warning: Browsers use the MIME type, not the file extension, to determine how to process a URL, so it's important that web servers send the correct MIME type in the response's Content-Type header. If this is not correctly configured, browsers are likely to misinterpret the contents of files, sites will not work correctly, and downloaded files may be mishandled.

:::

## Structure of a MIME type

A MIME type most commonly consists of just two parts: a **type** and a **subtype**, separated by a slash (`/`) — with no whitespace between:

```
type/subtype
```

The **type** represents the **general category** into which the data type falls, such as `video` or `text`.

The **subtype** identifies the exact kind of data of the specified type the MIME type represents. For example, for the MIME type `text`, the subtype might be `plain` (plain text), `html` (HTML source code), or `calendar` (for iCalendar/`.ics`) files.

Each type has its own set of possible subtypes. A MIME type always has both a type and a subtype, never just one or the other.

An optional parameter can be added to provide additional details:

```
type/subtype;parameter=value
```

For example, for any MIME type whose main type is text, you can add the optional charset parameter to specify the character set used for the characters in the data. If no charset is specified, the default is ASCII (US-ASCII) unless overridden by the user agent's settings. To specify a UTF-8 text file, the MIME type text/plain;charset=UTF-8 is used.

**MIME types are case-insensitive** but are traditionally written in lowercase. The parameter values can be case-sensitive.

## Types

There are two classes of type: **discrete** and **multipart**.

**Discrete types** are types which represent a single file or medium, such as a single text or music file, or a single video.

**A multipart type** represents a document that's comprised of multiple component parts, each of which may have its own individual MIME type; or, a multipart type may encapsulate multiple files being sent together in one transaction. For example, multipart MIME types are used when attaching multiple files to an email.

## Discrete types

The discrete types currently registered with the IANA are:

- `application`
- `audio`
- `example`
- `font`
- `image`
- `model`
- `text`
- `video`

## Multipart types

Multipart types indicate a category of document broken into pieces, often with different MIME types; they can also be used — especially in email scenarios — to represent multiple, separate files which are all part of the same transaction. They represent a **composite document**.

Except for `multipart/form-data`, used in the **POST** method of HTML Forms, and `multipart/byteranges`, used with ``206` `Partial Content` to send part of a document, HTTP doesn't handle multipart documents in a special way: the message is transmitted to the browser (which will likely show a "Save As" window if it doesn't know how to display the document).

There are two multipart types:

- `message`
- `multipart`

## Important MIME types for Web developers

- `application/octet-stream`

This is the default for binary files. As it means **unknown binary file**, browsers usually don't execute it, or even ask if it should be executed. They treat it as if the `Content-Disposition` header was set to attachment, and propose a "Save As" dialog.

- `text/plain`

This is the default for textual files. Even if it really means "unknown textual file," browsers assume they can display it.

:::info
Note: text/plain does not mean "any kind of textual data." If they expect a specific kind of textual data, they will likely not consider it a match. Specifically if they download a text/plain file from a `<link>` element declaring a CSS file, they will not recognize it as a valid CSS file if presented with text/plain. The CSS mime type text/css must be used.

:::

## text/css

CSS files used to style a Web page must be sent with `text/css`. If a server doesn't recognize the .css suffix for CSS files, it may send them with `text/plain` or `application/octet-stream` MIME types. If so, they won't be recognized as CSS by most browsers and will be ignored.
