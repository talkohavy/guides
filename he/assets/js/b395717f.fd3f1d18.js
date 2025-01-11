"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[6731],{7268:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>d});const o=JSON.parse('{"id":"programming/concepts/design-by-contract","title":"Design by Contract","description":"An approach for designing software using interfaces.","source":"@site/docs/programming/concepts/design-by-contract.md","sourceDirName":"programming/concepts","slug":"/programming/concepts/design-by-contract","permalink":"/guides/he/docs/programming/concepts/design-by-contract","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/concepts/design-by-contract.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"-- SOLID","permalink":"/guides/he/docs/programming/concepts/solid"},"next":{"title":"- Web","permalink":"/guides/he/docs/web"}}');var i=t(6070),s=t(7010);const r={},c="Design by Contract",a={},d=[{value:"- <code>Definition</code>",id:"--definition",level:2},{value:"- <code>Deep Dive to the Description</code>",id:"--deep-dive-to-the-description",level:2}];function p(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"design-by-contract",children:"Design by Contract"})}),"\n",(0,i.jsx)("font",{size:"4",children:"An approach for designing software using interfaces."}),"\n",(0,i.jsxs)(n.h2,{id:"--definition",children:["- ",(0,i.jsx)(n.code,{children:"Definition"})]}),"\n",(0,i.jsxs)(n.p,{children:["Design by contract (DbC), also known as contract programming, programming by contract and design-by-contract programming, is an approach for designing software.",(0,i.jsx)(n.br,{}),"\n","It prescribes that software designers should define formal, precise and verifiable interface specifications for software components, which extend the ordinary definition of abstract data types with ",(0,i.jsx)(n.code,{children:"preconditions"}),", ",(0,i.jsx)(n.code,{children:"post-conditions"})," and ",(0,i.jsx)(n.code,{children:"invariants"}),'. These specifications are referred to as "contracts", in accordance with a conceptual metaphor with the conditions and obligations of business contracts.']}),"\n",(0,i.jsx)(n.p,{children:"The DbC approach assumes all client components that invoke an operation on a server component will meet the preconditions specified as required for that operation."}),"\n",(0,i.jsx)(n.p,{children:"Where this assumption is considered too risky (as in multi-channel or distributed computing), the inverse approach is taken, meaning that the server component tests that all relevant preconditions hold true (before, or while, processing the client component's request) and replies with a suitable error message if not."}),"\n",(0,i.jsxs)(n.h2,{id:"--deep-dive-to-the-description",children:["- ",(0,i.jsx)(n.code,{children:"Deep Dive to the Description"})]}),"\n",(0,i.jsx)(n.p,{children:'The central idea of DbC is a metaphor on how elements of a software system collaborate with each other on the basis of mutual obligations and benefits. The metaphor comes from business life, where a "client" and a "supplier" agree on a "contract" that defines, for example, that:'}),"\n",(0,i.jsx)(n.p,{children:"...to be continued..."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},7010:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>c});var o=t(758);const i={},s=o.createContext(i);function r(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);