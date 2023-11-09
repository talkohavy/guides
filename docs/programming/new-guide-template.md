---
sidebar_label: 'New guide'
sidebar_position: 999
# sidebar_class_name: specialSidebarLI
---

# Create New Guide Template

## 1. Code Block

**Supported languages:**  
sql, css, typescript, javascript, json, yaml, html, bash, markdown, http

pgsql, scss, php, java, csharp, matlab, r, pascal, powershell, xml, golang, rust, ruby, perl, groovy, django, assembly_x86, lua, applescript, cobol


```javascript title="Javascript"

import Component from 'my-project'

function App() {
  return <Component />
}
```

```typescript title="Typescript"

import Component from 'my-project'

function App({ page: number, name: string}): number {
  return <Component />
}
```

```bash title="bash"
  npm run deploy
```

```dockerfile title="dockerfile"
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

```json title="json"
{
  "type": "module",
  "version": 123,
  "isSmart": true,
  "stuff": [404, false, "holy"]
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "serve": "vite preview",
  }
}
```

```yaml title="yaml"
# Step 1: give the deployment a name
name: Deploy to GitHub Pages

# Step 2: set the event/s on which the workflow should trigger on
on:
  push:
    branches:
      - master

# Step 3: Define Jobs
jobs:
  build:
    name: Build & Deploy to GitHub Pages
```

```html title="html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="test" style="width: 10px; pointer: cursor;"> Hello World! </div>
</body>
</html>
```

```http
  GET /api/items
```

```python title="python"
# Declare some variables
name = "Alice"
print(f"Name: {name}")

# Define a function
def greet(person):
    if person == "Alice":
        return "Hello, Alice!"
    else:
        return "Hi there!"

# Use a loop to count
for i in range(1, 6):
  print(f"Count: {i}")

if age < 18:
    print("You are a minor.")
elif age >= 18 and age < 65:
    print("You are an adult.")
else:
    print("You are a senior citizen.")
```

--- 

## 2. Tables


| Parameter | Type     | Description                |
| :--------: | -------: | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |
| The : decides the alignment | So depending where its at | you'll see different alignments |
| Aligned Center | Aligned right | Aligned left |
| we can also<br/>break lines<br/> like this | but said backslash N doesn't work | this \N doesn't \n work |

--- 

## 3. Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

badge 1:  
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)  

badge 2:  
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)  

badge 3:  
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)  

--- 

## 4. Custom Badges

<span style={{display:'inline-block', width: 'auto', margin: '10px 0', fontSize: '2rem', fontWeight: 'bold', padding: '0.25rem', cursor:'default',border: '5px solid #999',borderRadius: '10px', color: 'white', backgroundColor: '#686868'}}>Story Time</span>  

|Story Time|
|-|

--- 

## 5. Font Resize

**<font size="7">This text is HUGE!!!</font>**

--- 

## 6. Strike Through

~~Strike through text~~

--- 

## 7. Admonitions

:::tip My tip

Use this awesome feature option
Some **content** with _Markdown_ `syntax`. Check [this `api`](#).

:::

:::note

Some **content** with _Markdown_ `syntax`. Check [this `api`](#).

:::

:::info

Some **content** with _Markdown_ `syntax`. Check [this `api`](#).

:::

:::caution

Some **content** with _Markdown_ `syntax`. Check [this `api`](#).

:::

:::danger

Some **content** with _Markdown_ `syntax`. Check [this `api`](#).

:::