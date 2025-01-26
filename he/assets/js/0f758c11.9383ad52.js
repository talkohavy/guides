"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[8596],{7122:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>l,frontMatter:()=>i,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"programming/html/iframe","title":"iframe","description":"1. Description","source":"@site/docs/programming/html/iframe.md","sourceDirName":"programming/html","slug":"/programming/html/iframe","permalink":"/guides/he/docs/programming/html/iframe","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/html/iframe.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- Inert","permalink":"/guides/he/docs/programming/html/inert"},"next":{"title":"- Databases","permalink":"/guides/he/docs/db"}}');var r=o(6070),s=o(7010);const i={},c="iframe",a={},d=[{value:"1. Description",id:"1-description",level:2},{value:"2. Browsing context",id:"2-browsing-context",level:2},{value:"Back to iframe",id:"back-to-iframe",level:2},{value:"3. History",id:"3-history",level:2}];function h(e){const n={admonition:"admonition",code:"code",div:"div",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",strong:"strong",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"iframe",children:"iframe"})}),"\n",(0,r.jsx)(n.h2,{id:"1-description",children:"1. Description"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"<iframe>"})," HTML element represents a nested ",(0,r.jsx)(n.strong,{children:"browsing context"}),", embedding another HTML page into the current one."]}),"\n",(0,r.jsx)(n.h2,{id:"2-browsing-context",children:"2. Browsing context"}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.strong,{children:"browsing context"})," is an environment in which a browser displays a ",(0,r.jsx)(n.strong,{children:"Document"}),". In modern browsers, it usually is a ",(0,r.jsx)(n.em,{children:"tab"}),", but it can be a ",(0,r.jsx)(n.em,{children:"window"}),", a ",(0,r.jsx)(n.em,{children:"popup"}),", a ",(0,r.jsx)(n.em,{children:"web application"}),", or even a part of a page such as a ",(0,r.jsx)(n.em,{children:"frame"})," or an ",(0,r.jsx)(n.em,{children:"iframe"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Each ",(0,r.jsx)(n.strong,{children:"browsing context"})," has an origin (that of the active document) and an ordered history of previously displayed documents. Communication and resource sharing between browsing contexts is constrained, in particular between cross-origin contexts. For example, a ",(0,r.jsx)(n.code,{children:"BroadcastChannel"})," can only be opened and used to communicate between same origin-contexts."]}),"\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.strong,{children:"browsing context"})," may be part of a ",(0,r.jsx)(n.strong,{children:"browsing context group"}),", which is a set of ",(0,r.jsx)(n.strong,{children:"browsing contexts"})," that share common context like history, cookies, storage mechanisms and so on. The browsing contexts within a group retain references to each other and can therefore inspect each other's global objects and post each other messages."]}),"\n",(0,r.jsxs)(n.p,{children:["By default, a document opened from a ",(0,r.jsx)(n.strong,{children:"browser context group"})," is opened in the same group whether or not it is ",(0,r.jsx)(n.code,{children:"cross-origin"})," or ",(0,r.jsx)(n.code,{children:"same-origin"}),". The ",(0,r.jsx)(n.code,{children:"Cross-Origin-Opener-Policy"})," can be used to control whether the document is instead opened in its own new browsing context group and ",(0,r.jsx)(n.code,{children:"cross-origin isolated"})," from other contexts (in particular cross-origin contexts). The can mitigate the risk of cross-origin attacks and the side-channel attacks referred to as XS-Leaks."]}),"\n",(0,r.jsx)(n.h2,{id:"back-to-iframe",children:"Back to iframe"}),"\n",(0,r.jsxs)(n.p,{children:["Each embedded browsing context has its own ",(0,r.jsx)(n.code,{children:"document"})," and allows URL navigations. The navigations of each embedded browsing context are linearized into the ",(0,r.jsx)(n.strong,{children:"session history"})," of the ",(0,r.jsx)(n.em,{children:"topmost"})," browsing context. The browsing context that embeds the others is called the ",(0,r.jsx)(n.strong,{children:"parent browsing context"}),". The ",(0,r.jsx)(n.em,{children:"topmost"})," browsing context \u2014 the one with no parent \u2014 is usually the browser window, represented by the Window object."]}),"\n",(0,r.jsx)(n.div,{children:(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Warning"}),": Because each browsing context is a complete document environment, every ",(0,r.jsx)(n.code,{children:"<iframe>"})," in a page requires increased memory and other computing resources. While theoretically you can use as many ",(0,r.jsx)(n.code,{children:"<iframe>"}),"s as you like, check for performance problems."]})}),"\n",(0,r.jsx)(n.h2,{id:"3-history",children:"3. History"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.strong,{children:"History"})," interface of the ",(0,r.jsx)(n.em,{children:"History API"})," allows manipulation of the browser ",(0,r.jsx)(n.em,{children:"session history"}),", that is the pages visited in the tab or frame that the current page is loaded in."]}),"\n",(0,r.jsxs)(n.p,{children:["There is only one instance of ",(0,r.jsx)(n.code,{children:"history"})," (It is a singleton.) accessible via the global object ",(0,r.jsx)(n.code,{children:"history"}),"."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["This interface is only available on the main thread (",(0,r.jsx)(n.code,{children:"Window"}),"). It cannot be accessed in ",(0,r.jsx)(n.code,{children:"Worker"})," or ",(0,r.jsx)(n.code,{children:"Worklet"})," contexts."]})})]})}function l(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},7010:(e,n,o)=>{o.d(n,{R:()=>i,x:()=>c});var t=o(758);const r={},s=t.createContext(r);function i(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);