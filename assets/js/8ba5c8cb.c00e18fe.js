"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8067],{7673:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>a,contentTitle:()=>s,default:()=>u,frontMatter:()=>i,metadata:()=>d,toc:()=>c});var n=o(5893),r=o(1151);const i={sidebar_label:"Redux",sidebar_position:4},s="Guide for Redux",d={id:"programming/redux",title:"Guide for Redux",description:"1. Redux Toolkit (RTK)",source:"@site/docs/programming/redux.md",sourceDirName:"programming",slug:"/programming/redux",permalink:"/guides/docs/programming/redux",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/redux.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_label:"Redux",sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Git",permalink:"/guides/docs/programming/git"},next:{title:"SSH",permalink:"/guides/docs/programming/ssh"}},a={},c=[{value:"1. Redux Toolkit (RTK)",id:"1-redux-toolkit-rtk",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"guide-for-redux",children:"Guide for Redux"}),"\n",(0,n.jsx)(t.h2,{id:"1-redux-toolkit-rtk",children:"1. Redux Toolkit (RTK)"}),"\n",(0,n.jsx)(t.p,{children:"Redux Toolkit starts with two key APIs that simplify the most common things you do in every Redux app:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"configureStore"})," sets up a well-configured Redux store with a single function call, including combining reducers, adding the thunk middleware, and setting up the Redux DevTools integration. It also is easier to configure than ",(0,n.jsx)(t.code,{children:"createStore"}),", because it takes named options parameters."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"createSlice"})," lets you write reducers that use ",(0,n.jsx)(t.a,{href:"https://immerjs.github.io/immer/",children:"the Immer library"}),' to enable writing immutable updates using "mutating" JS syntax like ',(0,n.jsx)(t.code,{children:"state.value = 123"}),", with no spreads needed. It also automatically generates action creator functions for each reducer, and generates action type strings internally based on your reducer's names. Finally, it works great with TypeScript."]}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"That means that the code you write can be drastically simpler. For example, that same todos reducer could just be:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-jsx",metastring:'[title="features/todos/todosSlice.js"]',children:"import { createSlice } from '@reduxjs/toolkit'\n\nconst todosSlice = createSlice({\n  name: 'todos',\n  initialState: [],\n  reducers: {\n    todoAdded(state, action) {\n      state.push({\n        id: action.payload.id,\n        text: action.payload.text,\n        completed: false\n      })\n    },\n    todoToggled(state, action) {\n      const todo = state.find(todo => todo.id === action.payload)\n      todo.completed = !todo.completed\n    }\n  }\n})\n\nexport const { todoAdded, todoToggled } = todosSlice.actions\nexport default todosSlice.reducer\n"})}),"\n",(0,n.jsx)("br",{}),"\n",(0,n.jsx)("br",{}),"\n",(0,n.jsx)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}})]})}function u(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},1151:(e,t,o)=>{o.d(t,{Z:()=>d,a:()=>s});var n=o(7294);const r={},i=n.createContext(r);function s(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);