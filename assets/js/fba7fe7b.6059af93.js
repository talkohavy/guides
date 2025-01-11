"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[4835],{8142:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>a,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"programming/web/headers","title":"Headers","description":"1. What can HTTP Headers affect?","source":"@site/docs/programming/web/headers.md","sourceDirName":"programming/web","slug":"/programming/web/headers","permalink":"/guides/docs/programming/web/headers","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/web/headers.md","tags":[],"version":"current","frontMatter":{}}');var t=r(6070),i=r(7010);const a={},o="Headers",d={},c=[{value:"1. What can HTTP Headers affect?",id:"1-what-can-http-headers-affect",level:2},{value:"2. Categories of Headers",id:"2-categories-of-headers",level:2},{value:"3. Key Headers and Their Roles",id:"3-key-headers-and-their-roles",level:2},{value:"Setting headers",id:"setting-headers",level:2},{value:"Forbidden header names",id:"forbidden-header-names",level:2}];function h(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"headers",children:"Headers"})}),"\n",(0,t.jsx)(n.h2,{id:"1-what-can-http-headers-affect",children:"1. What can HTTP Headers affect?"}),"\n",(0,t.jsx)(n.p,{children:"Headers can affect:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["How the ",(0,t.jsx)(n.strong,{children:"browser"})," processes the response."]}),"\n",(0,t.jsxs)(n.li,{children:["How the ",(0,t.jsx)(n.strong,{children:"server"})," interprets the request."]}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.strong,{children:"security"}),", ",(0,t.jsx)(n.strong,{children:"caching"}),", and ",(0,t.jsx)(n.strong,{children:"performance"})," of web applications."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"2-categories-of-headers",children:"2. Categories of Headers"}),"\n",(0,t.jsx)(n.p,{children:"Headers can generally be grouped into these categories:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Request Headers"}),": Sent by the client (browser). They provide information about the request or the client itself."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Response Headers"}),": Sent by the server. They provide ",(0,t.jsx)(n.em,{children:"metadata"})," about the response."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"General Headers"}),": Sent by either the client or the server. They do not describe the body of the message."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Entity Headers"}),": Provide information about the body of the request or response."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"3-key-headers-and-their-roles",children:"3. Key Headers and Their Roles"}),"\n",(0,t.jsx)(n.p,{children:"A. Security-Related Headers"}),"\n",(0,t.jsx)(n.p,{children:"Security headers play a crucial role in protecting both the client and the server:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Content-Security-Policy (CSP): Controls which resources (scripts, images, styles) the browser can load. Helps mitigate XSS attacks.","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Example: Content-Security-Policy: default-src 'self'; script-src 'self' ",(0,t.jsx)(n.a,{href:"https://apis.google.com",children:"https://apis.google.com"})]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Strict-Transport-Security (HSTS): Forces the browser to interact with the server over HTTPS only."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Example: Strict-Transport-Security: max-age=31536000; includeSubDomains"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"X-Content-Type-Options: Prevents MIME-type sniffing, ensuring that files are served with the correct type."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Example: X-Content-Type-Options: nosniff"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"X-Frame-Options: Prevents the site from being embedded in an iframe, mitigating clickjacking."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Example: X-Frame-Options: DENY"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Referrer-Policy: Controls the amount of referrer information sent with requests."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Example: Referrer-Policy: no-referrer-when-downgrade"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"setting-headers",children:"Setting headers"}),"\n",(0,t.jsx)(n.p,{children:"Request headers give the server information about the request: for example, the Content-Type header tells the server the format of the request's body."}),"\n",(0,t.jsx)(n.p,{children:"To set request headers, assign them to the headers option."}),"\n",(0,t.jsx)(n.p,{children:"You can pass an object literal here containing header-name: header-value properties:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const response = await fetch('https://example.org/post', {\n  headers: {\n    'Content-Type': 'application/json',\n  },\n  // ...\n});\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Alternatively, you can construct a ",(0,t.jsx)(n.code,{children:"Headers"})," object, add headers to that object using ",(0,t.jsx)(n.code,{children:"Headers.append()"}),", then assign the Headers object to the headers option:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'const myHeaders = new Headers();\nmyHeaders.append("Content-Type", "application/json");\n\nconst response = await fetch("https://example.org/post", {\n  headers: myHeaders,\n  // ...\n});\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Many headers are set automatically by the browser and can't be set by a script: these are called Forbidden header names. If the ",(0,t.jsx)(n.code,{children:"mode"})," option is set to ",(0,t.jsx)(n.code,{children:"no-cors"}),", then the set of permitted headers is further restricted."]}),"\n",(0,t.jsx)(n.h2,{id:"forbidden-header-names",children:"Forbidden header names"})]})}function l(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},7010:(e,n,r)=>{r.d(n,{R:()=>a,x:()=>o});var s=r(758);const t={},i=s.createContext(t);function a(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);