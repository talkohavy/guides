"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[6061],{5246:(e,n,t)=>{t.d(n,{A:()=>o});t(758);var a=t(3526),i=t(9203),s=t(4430),l=t(5989),r=t(6070);function c(e){let{className:n}=e;return(0,r.jsx)(l.A,{type:"caution",title:(0,r.jsx)(i.Rc,{}),className:(0,a.A)(n,s.G.common.unlistedBanner),children:(0,r.jsx)(i.Uh,{})})}function o(e){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.AE,{}),(0,r.jsx)(c,{...e})]})}},2677:(e,n,t)=>{t.d(n,{A:()=>d});t(758);var a=t(3526),i=t(9203),s=t(4430),l=t(5989),r=t(6070);function c(e){let{className:n}=e;return(0,r.jsx)(l.A,{type:"caution",title:(0,r.jsx)(i.Yh,{}),className:(0,a.A)(n,s.G.common.draftBanner),children:(0,r.jsx)(i.TT,{})})}var o=t(5246);function d(e){let{metadata:n}=e;const{unlisted:t,frontMatter:a}=n;return(0,r.jsxs)(r.Fragment,{children:[(t||a.unlisted)&&(0,r.jsx)(o.A,{}),a.draft&&(0,r.jsx)(c,{})]})}},5714:(e,n,t)=>{t.r(n),t.d(n,{default:()=>f});t(758);var a=t(3526),i=t(1389),s=t(4430),l=t(3619),r=t(5273),c=t(7220),o=t(2677),d=t(4692);const m={mdxPageWrapper:"mdxPageWrapper_Ivxq"};var u=t(6070);function f(e){const{content:n}=e,{metadata:t,assets:f}=n,{title:h,editUrl:v,description:g,frontMatter:x,lastUpdatedBy:p,lastUpdatedAt:j}=t,{keywords:A,wrapperClassName:b,hide_table_of_contents:N}=x,L=f.image??x.image,H=!!(v||j||p);return(0,u.jsx)(i.e3,{className:(0,a.A)(b??s.G.wrapper.mdxPages,s.G.page.mdxPage),children:(0,u.jsxs)(l.A,{children:[(0,u.jsx)(i.be,{title:h,description:g,keywords:A,image:L}),(0,u.jsx)("main",{className:"container container--fluid margin-vert--lg",children:(0,u.jsxs)("div",{className:(0,a.A)("row",m.mdxPageWrapper),children:[(0,u.jsxs)("div",{className:(0,a.A)("col",!N&&"col--8"),children:[(0,u.jsx)(o.A,{metadata:t}),(0,u.jsx)("article",{children:(0,u.jsx)(r.A,{children:(0,u.jsx)(n,{})})}),H&&(0,u.jsx)(d.A,{className:(0,a.A)("margin-top--sm",s.G.pages.pageFooterEditMetaRow),editUrl:v,lastUpdatedAt:j,lastUpdatedBy:p})]}),!N&&n.toc.length>0&&(0,u.jsx)("div",{className:"col col--2",children:(0,u.jsx)(c.A,{toc:n.toc,minHeadingLevel:x.toc_min_heading_level,maxHeadingLevel:x.toc_max_heading_level})})]})})]})})}},7220:(e,n,t)=>{t.d(n,{A:()=>o});t(758);var a=t(3526),i=t(5945);const s={tableOfContents:"tableOfContents_qxgX",docItemContainer:"docItemContainer_JGSN"};var l=t(6070);const r="table-of-contents__link toc-highlight",c="table-of-contents__link--active";function o(e){let{className:n,...t}=e;return(0,l.jsx)("div",{className:(0,a.A)(s.tableOfContents,"thin-scrollbar",n),children:(0,l.jsx)(i.A,{...t,linkClassName:r,linkActiveClassName:c})})}},5945:(e,n,t)=>{t.d(n,{A:()=>v});var a=t(758),i=t(5381);function s(e){const n=e.map((e=>({...e,parentIndex:-1,children:[]}))),t=Array(7).fill(-1);n.forEach(((e,n)=>{const a=t.slice(2,e.level);e.parentIndex=Math.max(...a),t[e.level]=n}));const a=[];return n.forEach((e=>{const{parentIndex:t,...i}=e;t>=0?n[t].children.push(i):a.push(i)})),a}function l(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:a}=e;return n.flatMap((e=>{const n=l({toc:e.children,minHeadingLevel:t,maxHeadingLevel:a});return function(e){return e.level>=t&&e.level<=a}(e)?[{...e,children:n}]:n}))}function r(e){const n=e.getBoundingClientRect();return n.top===n.bottom?r(e.parentNode):n}function c(e,n){let{anchorTopOffset:t}=n;const a=e.find((e=>r(e).top>=t));if(a){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(r(a))?a:e[e.indexOf(a)-1]??null}return e[e.length-1]??null}function o(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:n}}=(0,i.p)();return(0,a.useEffect)((()=>{e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function d(e){const n=(0,a.useRef)(void 0),t=o();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:a,linkActiveClassName:i,minHeadingLevel:s,maxHeadingLevel:l}=e;function r(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(a),r=function(e){let{minHeadingLevel:n,maxHeadingLevel:t}=e;const a=[];for(let i=n;i<=t;i+=1)a.push(`h${i}.anchor`);return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:s,maxHeadingLevel:l}),o=c(r,{anchorTopOffset:t.current}),d=e.find((e=>o&&o.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,t){t?(n.current&&n.current!==e&&n.current.classList.remove(i),e.classList.add(i),n.current=e):e.classList.remove(i)}(e,e===d)}))}return document.addEventListener("scroll",r),document.addEventListener("resize",r),r(),()=>{document.removeEventListener("scroll",r),document.removeEventListener("resize",r)}}),[e,t])}var m=t(6536),u=t(6070);function f(e){let{toc:n,className:t,linkClassName:a,isChild:i}=e;return n.length?(0,u.jsx)("ul",{className:i?void 0:t,children:n.map((e=>(0,u.jsxs)("li",{children:[(0,u.jsx)(m.A,{to:`#${e.id}`,className:a??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,u.jsx)(f,{isChild:!0,toc:e.children,className:t,linkClassName:a})]},e.id)))}):null}const h=a.memo(f);function v(e){let{toc:n,className:t="table-of-contents table-of-contents__left-border",linkClassName:r="table-of-contents__link",linkActiveClassName:c,minHeadingLevel:o,maxHeadingLevel:m,...f}=e;const v=(0,i.p)(),g=o??v.tableOfContents.minHeadingLevel,x=m??v.tableOfContents.maxHeadingLevel,p=function(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:i}=e;return(0,a.useMemo)((()=>l({toc:s(n),minHeadingLevel:t,maxHeadingLevel:i})),[n,t,i])}({toc:n,minHeadingLevel:g,maxHeadingLevel:x});return d((0,a.useMemo)((()=>{if(r&&c)return{linkClassName:r,linkActiveClassName:c,minHeadingLevel:g,maxHeadingLevel:x}}),[r,c,g,x])),(0,u.jsx)(h,{toc:p,className:t,linkClassName:r,...f})}},9203:(e,n,t)=>{t.d(n,{AE:()=>c,Rc:()=>l,TT:()=>d,Uh:()=>r,Yh:()=>o});t(758);var a=t(5914),i=t(2662),s=t(6070);function l(){return(0,s.jsx)(a.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function r(){return(0,s.jsx)(a.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,s.jsx)(i.A,{children:(0,s.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function o(){return(0,s.jsx)(a.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function d(){return(0,s.jsx)(a.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}}}]);