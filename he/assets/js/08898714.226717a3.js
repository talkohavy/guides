"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[2418],{9777:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>h,contentTitle:()=>a,default:()=>l,frontMatter:()=>o,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"programming/python-server","title":"Guide For Building a Server in Python","description":"1. Sharing Files Between 2 machines","source":"@site/docs/programming/python-server.md","sourceDirName":"programming","slug":"/programming/python-server","permalink":"/guides/he/docs/programming/python-server","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/python-server.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- npm publish a package","permalink":"/guides/he/docs/programming/npm"},"next":{"title":"- Regex","permalink":"/guides/he/docs/programming/regex"}}');var i=r(6070),t=r(7010);const o={},a="Guide For Building a Server in Python",h={},c=[{value:"1. Sharing Files Between 2 machines",id:"1-sharing-files-between-2-machines",level:2}];function d(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"guide-for-building-a-server-in-python",children:"Guide For Building a Server in Python"})}),"\n",(0,i.jsx)(n.h2,{id:"1-sharing-files-between-2-machines",children:"1. Sharing Files Between 2 machines"}),"\n",(0,i.jsxs)(n.p,{children:["This is a nice way to have 2 machines share files with one another.",(0,i.jsx)(n.br,{}),"\n","This is useful only when 2 machines are found on the same local network."]}),"\n",(0,i.jsx)(n.p,{children:"Find out the IP of the hosting machine by running:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"ifconfig\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Let's say the IP was ",(0,i.jsx)(n.code,{children:"192.168.0.100"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Now, inside the hosting machine, navigate to the folder you wish to host, and there run the following command:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"python3 -m http.server 3000 --bind 192.168.0.100\n"})}),"\n",(0,i.jsx)(n.p,{children:"A server starts up running and serving the contents of that folder."}),"\n",(0,i.jsx)(n.p,{children:"You'll get back an IP address, which you then need to type into the URL part of the browser inside machine 2."}),"\n",(0,i.jsx)(n.p,{children:"Good Luck \ud83d\ude42 Happy sharing!"})]})}function l(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},7010:(e,n,r)=>{r.d(n,{R:()=>o,x:()=>a});var s=r(758);const i={},t=s.createContext(i);function o(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);