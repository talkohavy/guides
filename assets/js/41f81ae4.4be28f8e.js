"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[7101],{4321:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var n=i(6070),r=i(5710);const a={title:"How to Create a Component Library with Vite",description:"How to create a components library fast using Vite's library mode, typescript, css modules, and publish to npm.",slug:"vite-library-mode",authors:["talkohavy"],image:"https://i.ibb.co/rGSxHmB/vite.png",tags:["vite","react","typescript","tutorial"],hide_table_of_contents:!1},o=void 0,s={permalink:"/guides/blog/vite-library-mode",editUrl:"https://github.com/talkohavy/guides/blog/2024-08-10-vite-library-mode.md",source:"@site/blog/2024-08-10-vite-library-mode.md",title:"How to Create a Component Library with Vite",description:"How to create a components library fast using Vite's library mode, typescript, css modules, and publish to npm.",date:"2024-08-10T00:00:00.000Z",tags:[{inline:!0,label:"vite",permalink:"/guides/blog/tags/vite"},{inline:!0,label:"react",permalink:"/guides/blog/tags/react"},{inline:!0,label:"typescript",permalink:"/guides/blog/tags/typescript"},{inline:!0,label:"tutorial",permalink:"/guides/blog/tags/tutorial"}],readingTime:18.02,hasTruncateMarker:!0,authors:[{name:"Tal Kohavy",title:"Full Stack Developer",url:"https://github.com/talkohavy",imageURL:"https://github.com/talkohavy.png",key:"talkohavy",page:null}],frontMatter:{title:"How to Create a Component Library with Vite",description:"How to create a components library fast using Vite's library mode, typescript, css modules, and publish to npm.",slug:"vite-library-mode",authors:["talkohavy"],image:"https://i.ibb.co/rGSxHmB/vite.png",tags:["vite","react","typescript","tutorial"],hide_table_of_contents:!1},unlisted:!1,nextItem:{title:"Welcome",permalink:"/guides/blog/welcome"}},l={authorsImageUrls:[void 0]},d=[{value:"1. Set up a new Vite project",id:"1-set-up-a-new-vite-project",level:2},{value:"2. Create a <code>lib/main.ts</code> file",id:"2-create-a-libmaints-file",level:2},{value:"3. Activate Vite&#39;s Library Mode",id:"3-activate-vites-library-mode",level:2}];function c(e){const t={code:"code",h2:"h2",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"1-set-up-a-new-vite-project",children:"1. Set up a new Vite project"}),"\n",(0,n.jsx)(t.p,{children:"Start a new project:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"npm create vite@latest\n"})}),"\n",(0,n.jsxs)(t.p,{children:["Choose ",(0,n.jsx)(t.code,{children:"React"})," & ",(0,n.jsx)(t.code,{children:"TypeScript + SWC"})]}),"\n",(0,n.jsx)(t.p,{children:"Here are 4 things I recommend you to do right after installing Vite:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"Early first commit\nCommitting regularly is a very good habit. And there is one point in time where it is especially helpful, right after you created a new project and BEFORE you type the first character in your project."}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"Install node's types\nIf working with TypeScript I also install the types package for node. Sooner or later you will need this."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"pnpm add -D @types/node\n"})}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(t.hr,{}),"\n",(0,n.jsxs)(t.h2,{id:"2-create-a-libmaints-file",children:["2. Create a ",(0,n.jsx)(t.code,{children:"lib/main.ts"})," file"]}),"\n",(0,n.jsxs)(t.p,{children:["Create a folder next to ",(0,n.jsx)(t.code,{children:"src"})," and name it ",(0,n.jsx)(t.code,{children:"lib"}),". Inside, create the file which will act as the main entry point of your library, and name it ",(0,n.jsx)(t.code,{children:"main.ts"}),". When installing the library you can import everything that is exported from this file."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-diff",children:" \ud83d\udcc2 my-component-library\n// diff-add-start\n\u2523 \ud83d\udcc2 lib\n\u2503 \u2517 \ud83d\udcdc main.ts\n// diff-add-end\n  \u2523 \ud83d\udcc2 public\n  \u2523 \ud83d\udcc2 src\n  \u2026\n"})}),"\n",(0,n.jsx)(t.h2,{id:"3-activate-vites-library-mode",children:"3. Activate Vite's Library Mode"}),"\n",(0,n.jsxs)(t.p,{children:["By default, when running ",(0,n.jsx)(t.code,{children:"vite build"}),", Vite will transpile the code inside ",(0,n.jsx)(t.code,{children:"src"})," to the ",(0,n.jsx)(t.code,{children:"dist"})," folder. What we want instead, is to transpile and ship the code inside of ",(0,n.jsx)(t.code,{children:"lib"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["To activate vite's library mode, inside of our ",(0,n.jsx)(t.code,{children:"vite.config.ts"})," file, we will need to use the ",(0,n.jsx)(t.code,{children:"build.lib"})," option."]}),"\n",(0,n.jsx)(t.p,{children:"Like so (do not copy code yet!):"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-jsx",metastring:"showLineNumbers",children:"// diff-add-next-line\nimport { resolve } from 'path'\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react-swc'\n\nexport default defineConfig({\n  plugins: [react()],\n// diff-add-start\n  build: {\n    lib: {\n      entry: resolve(__dirname, 'lib/main.ts'),\n      formats: ['es']\n    }\n  }\n// diff-add-end\n})\n"})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},5710:(e,t,i)=>{i.d(t,{R:()=>o,x:()=>s});var n=i(758);const r={},a=n.createContext(r);function o(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(a.Provider,{value:t},e.children)}}}]);