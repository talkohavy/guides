"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2871],{2581:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>a});var s=t(5893),i=t(1151);const r={sidebar_label:"New guide",sidebar_position:999},l="Create New Guide Template",d={id:"programming/new-guide-template",title:"Create New Guide Template",description:"1. Code Block",source:"@site/docs/programming/new-guide-template.md",sourceDirName:"programming",slug:"/programming/new-guide-template",permalink:"/guides/he/docs/programming/new-guide-template",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/new-guide-template.md",tags:[],version:"current",sidebarPosition:999,frontMatter:{sidebar_label:"New guide",sidebar_position:999},sidebar:"tutorialSidebar",previous:{title:"Redux",permalink:"/guides/he/docs/programming/redux"},next:{title:"\u05d4\u05e7\u05d3\u05de\u05d4 \u05dc\u05de\u05d3\u05e8\u05d9\u05da",permalink:"/guides/he/docs/intro"}},o={},a=[{value:"1. Code Block",id:"1-code-block",level:2},{value:"2. Tables",id:"2-tables",level:2},{value:"3. Badges",id:"3-badges",level:2},{value:"4. Custom Badges",id:"4-custom-badges",level:2},{value:"5. Font Resize",id:"5-font-resize",level:2},{value:"6. Strike Through",id:"6-strike-through",level:2},{value:"7. Admonitions",id:"7-admonitions",level:2}];function c(e){const n={a:"a",admonition:"admonition",br:"br",code:"code",del:"del",em:"em",h1:"h1",h2:"h2",hr:"hr",img:"img",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"create-new-guide-template",children:"Create New Guide Template"}),"\n",(0,s.jsx)(n.h2,{id:"1-code-block",children:"1. Code Block"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Supported languages:"}),(0,s.jsx)(n.br,{}),"\n","sql, css, typescript, javascript, json, yaml, html, bash, markdown, http"]}),"\n",(0,s.jsx)(n.p,{children:"pgsql, scss, php, java, csharp, matlab, r, pascal, powershell, xml, golang, rust, ruby, perl, groovy, django, assembly_x86, lua, applescript, cobol"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="Javascript"',children:"\nimport Component from 'my-project'\n\nfunction App() {\n  return <Component />\n}\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",metastring:'title="Typescript"',children:"\nimport Component from 'my-project'\n\nfunction App({ page: number, name: string}): number {\n  return <Component />\n}\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",metastring:'title="bash"',children:"  npm run deploy\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dockerfile",metastring:'title="dockerfile"',children:'# syntax=docker/dockerfile:1\n\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN yarn install --production\nCMD ["node", "src/index.js"]\nEXPOSE 3000\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",metastring:'title="json"',children:'{\n  "type": "module",\n  "version": 123,\n  "isSmart": true,\n  "stuff": [404, false, "holy"]\n  "scripts": {\n    "start": "node server.js",\n    "build": "vite build",\n    "serve": "vite preview",\n  }\n}\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",metastring:'title="yaml"',children:"# Step 1: give the deployment a name\nname: Deploy to GitHub Pages\n\n# Step 2: set the event/s on which the workflow should trigger on\non:\n  push:\n    branches:\n      - master\n\n# Step 3: Define Jobs\njobs:\n  build:\n    name: Build & Deploy to GitHub Pages\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-html",metastring:'title="html"',children:'<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  <div id="test" style="width: 10px; pointer: cursor;"> Hello World! </div>\n</body>\n</html>\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-http",children:"  GET /api/items\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",metastring:'title="python"',children:'# Declare some variables\nname = "Alice"\nprint(f"Name: {name}")\n\n# Define a function\ndef greet(person):\n    if person == "Alice":\n        return "Hello, Alice!"\n    else:\n        return "Hi there!"\n\n# Use a loop to count\nfor i in range(1, 6):\n  print(f"Count: {i}")\n\nif age < 18:\n    print("You are a minor.")\nelif age >= 18 and age < 65:\n    print("You are an adult.")\nelse:\n    print("You are a senior citizen.")\n'})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"2-tables",children:"2. Tables"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Parameter"}),(0,s.jsx)(n.th,{style:{textAlign:"right"},children:"Type"}),(0,s.jsx)(n.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(n.code,{children:"api_key"})}),(0,s.jsx)(n.td,{style:{textAlign:"right"},children:(0,s.jsx)(n.code,{children:"string"})}),(0,s.jsxs)(n.td,{style:{textAlign:"left"},children:[(0,s.jsx)(n.strong,{children:"Required"}),". Your API key"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"The : decides the alignment"}),(0,s.jsx)(n.td,{style:{textAlign:"right"},children:"So depending where its at"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"you'll see different alignments"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"Aligned Center"}),(0,s.jsx)(n.td,{style:{textAlign:"right"},children:"Aligned right"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"Aligned left"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{style:{textAlign:"center"},children:["we can also",(0,s.jsx)("br",{}),"break lines",(0,s.jsx)("br",{})," like this"]}),(0,s.jsx)(n.td,{style:{textAlign:"right"},children:"but said backslash N doesn't work"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"this \\N doesn't \\n work"})]})]})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"3-badges",children:"3. Badges"}),"\n",(0,s.jsxs)(n.p,{children:["Add badges from somewhere like: ",(0,s.jsx)(n.a,{href:"https://shields.io/",children:"shields.io"})]}),"\n",(0,s.jsxs)(n.p,{children:["badge 1:",(0,s.jsx)(n.br,{}),"\n",(0,s.jsx)(n.a,{href:"https://choosealicense.com/licenses/mit/",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/License-MIT-green.svg",alt:"MIT License"})})]}),"\n",(0,s.jsxs)(n.p,{children:["badge 2:",(0,s.jsx)(n.br,{}),"\n",(0,s.jsx)(n.a,{href:"https://opensource.org/licenses/",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/License-GPL%20v3-yellow.svg",alt:"GPLv3 License"})})]}),"\n",(0,s.jsxs)(n.p,{children:["badge 3:",(0,s.jsx)(n.br,{}),"\n",(0,s.jsx)(n.a,{href:"http://www.gnu.org/licenses/agpl-3.0",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/license-AGPL-blue.svg",alt:"AGPL License"})})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"4-custom-badges",children:"4. Custom Badges"}),"\n",(0,s.jsx)("span",{style:{display:"inline-block",width:"auto",margin:"10px 0",fontSize:"2rem",fontWeight:"bold",padding:"0.25rem",cursor:"default",border:"5px solid #999",borderRadius:"10px",color:"white",backgroundColor:"#686868"},children:"Story Time"}),"\n",(0,s.jsx)(n.table,{children:(0,s.jsx)(n.thead,{children:(0,s.jsx)(n.tr,{children:(0,s.jsx)(n.th,{children:"Story Time"})})})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"5-font-resize",children:"5. Font Resize"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:(0,s.jsx)("font",{size:"7",children:"This text is HUGE!!!"})})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"6-strike-through",children:"6. Strike Through"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.del,{children:"Strike through text"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"7-admonitions",children:"7. Admonitions"}),"\n",(0,s.jsx)(n.admonition,{title:"My tip",type:"tip",children:(0,s.jsxs)(n.p,{children:["Use this awesome feature option\nSome ",(0,s.jsx)(n.strong,{children:"content"})," with ",(0,s.jsx)(n.em,{children:"Markdown"})," ",(0,s.jsx)(n.code,{children:"syntax"}),". Check ",(0,s.jsxs)(n.a,{href:"#",children:["this ",(0,s.jsx)(n.code,{children:"api"})]}),"."]})}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Some ",(0,s.jsx)(n.strong,{children:"content"})," with ",(0,s.jsx)(n.em,{children:"Markdown"})," ",(0,s.jsx)(n.code,{children:"syntax"}),". Check ",(0,s.jsxs)(n.a,{href:"#",children:["this ",(0,s.jsx)(n.code,{children:"api"})]}),"."]})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["Some ",(0,s.jsx)(n.strong,{children:"content"})," with ",(0,s.jsx)(n.em,{children:"Markdown"})," ",(0,s.jsx)(n.code,{children:"syntax"}),". Check ",(0,s.jsxs)(n.a,{href:"#",children:["this ",(0,s.jsx)(n.code,{children:"api"})]}),"."]})}),"\n",(0,s.jsx)(n.admonition,{type:"caution",children:(0,s.jsxs)(n.p,{children:["Some ",(0,s.jsx)(n.strong,{children:"content"})," with ",(0,s.jsx)(n.em,{children:"Markdown"})," ",(0,s.jsx)(n.code,{children:"syntax"}),". Check ",(0,s.jsxs)(n.a,{href:"#",children:["this ",(0,s.jsx)(n.code,{children:"api"})]}),"."]})}),"\n",(0,s.jsx)(n.admonition,{type:"danger",children:(0,s.jsxs)(n.p,{children:["Some ",(0,s.jsx)(n.strong,{children:"content"})," with ",(0,s.jsx)(n.em,{children:"Markdown"})," ",(0,s.jsx)(n.code,{children:"syntax"}),". Check ",(0,s.jsxs)(n.a,{href:"#",children:["this ",(0,s.jsx)(n.code,{children:"api"})]}),"."]})})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>d,a:()=>l});var s=t(7294);const i={},r=s.createContext(i);function l(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);