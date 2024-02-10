---
sidebar_label: '15. Regex'
sidebar_position: 14
---

# Guide for Regex

## Lesson 1: Positive & Negative Lookahead & Lookbehinds

`Lookaheads` & `Lookbehinds` allow you to match for patterns found **ahead**/**behind** some given _argument_.

When wanting to extract B, which comes after A, without also extracting A, `lookaheads`/`lookbehinds` combined with `match` are super helpful.  
`lookahead` & `lookbehinds` are both divided into 2 types: **positive** & **negative**.

### - Type 1: Positive Look Ahead

General form:

```bash
/.+(?=AAA)/
```

**Description**

Positive `Lookaheads` allow you to match for patterns that **are found** (exist) **ahead** of some given argument.

- **Use Case**: When wanting to extract B, which comes after A, without also extracting A, `lookaheads` combined with `match` are super helpful.

**Examples**

_Example 1:_ grab just the name of a file ending with .d.ts extension

```javascript
const exampleString = 'config.d.ts';
const positiveLookaheadRegex = /.+(?=\.d\.ts)/g;

positiveLookaheadRegex.test(exampleString); // returns true
exampleString.match(positiveLookaheadRegex); // returns 'config' (without '.d.ts' !!!)
```

_Example 2:_ grab the first char that comes right before the letter A

```javascript
exampleString = 'cat123A-catzzzA';
regex = /.(?=A)/g;


exampleString.match(regex);
```

_Example 3:_ password must include at least 5 characters, and at least 2 consecutive digits.

```javascript
const myRegex = /(?=\w{5})(?=\D*\d{2})/g;
```

Let's break it down piece by piece.

So what do we have here? A few reminders first:

- \w represents any word character. Word characters include a-z A-Z 0-9 and an underscore (\_).
- \D represents any non-digit character. Which means, any letter (a-z A-Z), special characters (punctuation, symbols, etc.), whitespace characters (space, tab, etc.).

The regex above includes:

- A positive lookahead that says "match for X that has at least 5 characters after it". which is basically saying "match only if the given string includes at least 5 characters".
- Another positive lookahead that says "match for X that has 2 consecutive digits after it", which basically is like saying "the provided string must include 2 consecutive digits".

:::tip

**When writing a positive lookahead:**

- have opening & closing parenthesis '(' & ')'
- put a question mark at the beginning '?' followed by an equal sign '='
- after the equal sign, put the X that means "patterns should have X appear right after them"
- an extra pattern _may_ be added to the left of a lookahead (i.e. /.(?=A)/g)
- an extra pattern to the right of a lookahead is pointless

:::

<br/>

### - Type 2: Negative Look Ahead

General form:

```bash
/(?!AAA)/
```

**Description**

Negative `lookaheads` allow you to match for patterns that **aren't found** (don't exist) **ahead** of some given argument.

**Examples**

_Example 1:_ grab the pattern that doesn't have a 2 appear right after it

```javascript
 exampleString = 'pig1-big2';
 negativeLookaheadRegex = /.ig(?!2)/g;
 positiveLookaheadRegex = /.ig(?=2)/g;

negativeLookaheadRegex.test(exampleString); // returns true
exampleString.match(negativeLookaheadRegex); // returns 'pig'
exampleString.match(positiveLookaheadRegex); // returns 'big'
```

### - Type 3: Positive Look Behind

General form:

```bash
/(?<=AAA)/
```

**Description**

You can already imagine.

### - Type 4: Negative Look Behind

General form:

```bash
/(?<!AAA)/
```

**Description**

You can already imagine.

### - Combining Lookahead with Lookbehind

_Example 1: return only the filename_

```javascript
const exampleString = 'dist/config.d.ts';
const regex = /(?<=\/).+(?=\.d\.ts)/g

regex.test(exampleString);
exampleString.match(regex); // returns 'config'
```

---

## Lesson 2: Special backslash'ed Letter Characters

### - \d

Matches a single digit between 0-9.

### - \D

Matches a non-digit, which means it matches:

- any letter (a-z A-Z)
- and special character (punctuation, symbols, etc.)
- whitespace characters (space, tab, etc.)

### - \w

Matches any `word` character. `word` characters include:

- any letter (a-z A-Z)
- any number (0-9)
- an underscore (\_)

### - \W

Matches a non-word, which means it matches:

- any letter that's not in english (e.g. א)
- and special character (punctuation, symbols, etc.)
- whitespace characters (space, tab, etc.)

### - \s

Matches any whitespace character, which means it matches:

- Space character ( )
- Tab character (\t)
- Newline character (\n)
- Carriage return character (\r)
- Form feed character (\f)
- Vertical tab character (\v)

### - \S

Matches any non-whitespace character.

---

## Lesson 3: Special Sign Characters

### - .

A wild card that matches _any_ character (a single one).

### - ?

A _maybe_ sign. This character is saying "that thing _before_ me may or may not appear", both forms are correct.

### - +

A _multiple_ sign. This character is saying "that thing _before_ me may appear more than once but at least once".

### - \*

A _maybe & multiple_ sign. This character is basically the combination of '?' and '+', and is saying "that thing _before_ me may appear more than once or even not appear at all!".

---

## Lesson 4: Capture Groups

General form:

```bash
/(?=AAA)/
```

**Description**

You can group things that you're searching for inside parenthesis.  
This is great for _find & replace_ use cases.

**Examples**

_Example 1:_ swap between month & day in dateString

```javascript
// Original date-like string
const dateString = '12/25/2023';

// Regular expression with capture groups
const regex = /(\d{2})\/(\d{2})\/(\d{4})/;

// Use replace with capture groups to swap day and month
const modifiedString = dateString.replace(regex, '$2/$1/$3');

// Output the modified string
console.log(modifiedString);  // Output: '25/12/2023'
```

_Example 2:_ delete everything after X

```javascript
const str = `i want everything gone after. the word gone.
because you're gone na miss me when i'm gon.`;

const strWithoutGone = str.replaceAll(/gone.+/g,'');

console.log('strWithoutGone is:',strWithoutGone); // returns `"i want everything \nbecause you're `
```
