# Capture Groups

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
