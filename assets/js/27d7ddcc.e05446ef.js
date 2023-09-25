"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2871],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>u});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},d="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),d=s(n),g=r,u=d["".concat(p,".").concat(g)]||d[g]||c[g]||i;return n?a.createElement(u,o(o({ref:t},m),{},{components:n})):a.createElement(u,o({ref:t},m))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[d]="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},8728:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>c,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var a=n(7462),r=(n(7294),n(3905));const i={sidebar_label:"New guide",sidebar_position:999,sidebar_class_name:"yellow"},o="Create New Guide Template",l={unversionedId:"programming/new-guide-template",id:"programming/new-guide-template",title:"Create New Guide Template",description:"1. Code Block",source:"@site/docs/programming/new-guide-template.md",sourceDirName:"programming",slug:"/programming/new-guide-template",permalink:"/guides/docs/programming/new-guide-template",draft:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/new-guide-template.md",tags:[],version:"current",sidebarPosition:999,frontMatter:{sidebar_label:"New guide",sidebar_position:999,sidebar_class_name:"yellow"},sidebar:"tutorialSidebar",previous:{title:"Git",permalink:"/guides/docs/programming/git"},next:{title:"Photoshop",permalink:"/guides/docs/category/photoshop"}},p={},s=[{value:"1. Code Block",id:"1-code-block",level:2},{value:"2. Tables",id:"2-tables",level:2},{value:"3. Badges",id:"3-badges",level:2},{value:"4. Custom Badges",id:"4-custom-badges",level:2},{value:"5. Admonitions",id:"5-admonitions",level:2}],m={toc:s},d="wrapper";function c(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"create-new-guide-template"},"Create New Guide Template"),(0,r.kt)("h2",{id:"1-code-block"},"1. Code Block"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Supported languages:"),(0,r.kt)("br",{parentName:"p"}),"\n","sql, css, typescript, javascript, json, yaml, html, bash, markdown, http"),(0,r.kt)("p",null,"pgsql, scss, php, java, csharp, matlab, r, pascal, powershell, xml, golang, rust, ruby, perl, groovy, django, assembly_x86, lua, applescript, cobol"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="Javascript"',title:'"Javascript"'},"\nimport Component from 'my-project'\n\nfunction App() {\n  return <Component />\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="Typescript"',title:'"Typescript"'},"\nimport Component from 'my-project'\n\nfunction App({ page: number, name: string}): number {\n  return <Component />\n}\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="bash"',title:'"bash"'},"  npm run deploy\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-dockerfile",metastring:'title="dockerfile"',title:'"dockerfile"'},'# syntax=docker/dockerfile:1\n\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN yarn install --production\nCMD ["node", "src/index.js"]\nEXPOSE 3000\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="json"',title:'"json"'},'{\n  "type": "module",\n  "version": 123,\n  "isSmart": true,\n  "stuff": [404, false, "holy"]\n  "scripts": {\n    "start": "node server.js",\n    "build": "vite build",\n    "serve": "vite preview",\n  }\n}\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="yaml"',title:'"yaml"'},"# Step 1: give the deployment a name\nname: Deploy to GitHub Pages\n\n# Step 2: set the event/s on which the workflow should trigger on\non:\n  push:\n    branches:\n      - master\n\n# Step 3: Define Jobs\njobs:\n  build:\n    name: Build & Deploy to GitHub Pages\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="html"',title:'"html"'},'<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  <div id="test" style="width: 10px; pointer: cursor;"> Hello World! </div>\n</body>\n</html>\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-http"},"  GET /api/items\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python",metastring:'title="python"',title:'"python"'},'# Declare some variables\nname = "Alice"\nprint(f"Name: {name}")\n\n# Define a function\ndef greet(person):\n    if person == "Alice":\n        return "Hello, Alice!"\n    else:\n        return "Hi there!"\n\n# Use a loop to count\nfor i in range(1, 6):\n  print(f"Count: {i}")\n\nif age < 18:\n    print("You are a minor.")\nelif age >= 18 and age < 65:\n    print("You are an adult.")\nelse:\n    print("You are a senior citizen.")\n')),(0,r.kt)("h2",{id:"2-tables"},"2. Tables"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"Parameter"),(0,r.kt)("th",{parentName:"tr",align:"right"},"Type"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"api_key")),(0,r.kt)("td",{parentName:"tr",align:"right"},(0,r.kt)("inlineCode",{parentName:"td"},"string")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("strong",{parentName:"td"},"Required"),". Your API key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},"The : decides the alignment"),(0,r.kt)("td",{parentName:"tr",align:"right"},"So depending where its at"),(0,r.kt)("td",{parentName:"tr",align:"left"},"you'll see different alignments")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},"Aligned Center"),(0,r.kt)("td",{parentName:"tr",align:"right"},"Aligned right"),(0,r.kt)("td",{parentName:"tr",align:"left"},"Aligned left")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},"we can also",(0,r.kt)("br",null),"break lines",(0,r.kt)("br",null)," like this"),(0,r.kt)("td",{parentName:"tr",align:"right"},"but said backslash N doesn't work"),(0,r.kt)("td",{parentName:"tr",align:"left"},"this \\N doesn't \\n work")))),(0,r.kt)("h2",{id:"3-badges"},"3. Badges"),(0,r.kt)("p",null,"Add badges from somewhere like: ",(0,r.kt)("a",{parentName:"p",href:"https://shields.io/"},"shields.io")),(0,r.kt)("p",null,"badge 1:",(0,r.kt)("br",{parentName:"p"}),"\n",(0,r.kt)("a",{parentName:"p",href:"https://choosealicense.com/licenses/mit/"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/badge/License-MIT-green.svg",alt:"MIT License"})),"  "),(0,r.kt)("p",null,"badge 2:",(0,r.kt)("br",{parentName:"p"}),"\n",(0,r.kt)("a",{parentName:"p",href:"https://opensource.org/licenses/"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/badge/License-GPL%20v3-yellow.svg",alt:"GPLv3 License"})),"  "),(0,r.kt)("p",null,"badge 3:",(0,r.kt)("br",{parentName:"p"}),"\n",(0,r.kt)("a",{parentName:"p",href:"http://www.gnu.org/licenses/agpl-3.0"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/badge/license-AGPL-blue.svg",alt:"AGPL License"})),"  "),(0,r.kt)("h2",{id:"4-custom-badges"},"4. Custom Badges"),(0,r.kt)("span",{style:{width:"auto",fontSize:"2rem",fontWeight:"bold",padding:"0.25rem",cursor:"default",border:"1px solid white",borderRadius:"10px",color:"black",backgroundColor:"yellow"}},"Story Time"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Story Time")))),(0,r.kt)("h2",{id:"5-admonitions"},"5. Admonitions"),(0,r.kt)("admonition",{title:"My tip",type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Use this awesome feature option\nYour next guide index is 3.\nSome ",(0,r.kt)("strong",{parentName:"p"},"content")," with ",(0,r.kt)("em",{parentName:"p"},"Markdown")," ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax"),". Check ",(0,r.kt)("a",{parentName:"p",href:"#"},"this ",(0,r.kt)("inlineCode",{parentName:"a"},"api")),".")),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"Some ",(0,r.kt)("strong",{parentName:"p"},"content")," with ",(0,r.kt)("em",{parentName:"p"},"Markdown")," ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax"),". Check ",(0,r.kt)("a",{parentName:"p",href:"#"},"this ",(0,r.kt)("inlineCode",{parentName:"a"},"api")),".")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Some ",(0,r.kt)("strong",{parentName:"p"},"content")," with ",(0,r.kt)("em",{parentName:"p"},"Markdown")," ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax"),". Check ",(0,r.kt)("a",{parentName:"p",href:"#"},"this ",(0,r.kt)("inlineCode",{parentName:"a"},"api")),".")),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Some ",(0,r.kt)("strong",{parentName:"p"},"content")," with ",(0,r.kt)("em",{parentName:"p"},"Markdown")," ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax"),". Check ",(0,r.kt)("a",{parentName:"p",href:"#"},"this ",(0,r.kt)("inlineCode",{parentName:"a"},"api")),".")),(0,r.kt)("admonition",{type:"danger"},(0,r.kt)("p",{parentName:"admonition"},"Some ",(0,r.kt)("strong",{parentName:"p"},"content")," with ",(0,r.kt)("em",{parentName:"p"},"Markdown")," ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax"),". Check ",(0,r.kt)("a",{parentName:"p",href:"#"},"this ",(0,r.kt)("inlineCode",{parentName:"a"},"api")),".")))}c.isMDXComponent=!0}}]);