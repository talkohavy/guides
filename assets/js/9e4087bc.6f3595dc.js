"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[2711],{3986:(e,r,t)=>{t.r(r),t.d(r,{default:()=>u});t(758);var a=t(9381),s=t(9919),n=t(3238),i=t(9282),c=t(1273),l=t(831),o=t(6070);function d(e){let{year:r,posts:t}=e;const s=(0,i.i)({day:"numeric",month:"long",timeZone:"UTC"});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(l.A,{as:"h3",id:r,children:r}),(0,o.jsx)("ul",{children:t.map((e=>{return(0,o.jsx)("li",{children:(0,o.jsxs)(a.A,{to:e.metadata.permalink,children:[(r=e.metadata.date,s.format(new Date(r)))," - ",e.metadata.title]})},e.metadata.date);var r}))})]})}function h(e){let{years:r}=e;return(0,o.jsx)("section",{className:"margin-vert--lg",children:(0,o.jsx)("div",{className:"container",children:(0,o.jsx)("div",{className:"row",children:r.map(((e,r)=>(0,o.jsx)("div",{className:"col col--4 margin-vert--lg",children:(0,o.jsx)(d,{...e})},r)))})})})}function u(e){let{archive:r}=e;const t=(0,s.T)({id:"theme.blog.archive.title",message:"Archive",description:"The page & hero title of the blog archive page"}),a=(0,s.T)({id:"theme.blog.archive.description",message:"Archive",description:"The page & hero description of the blog archive page"}),i=function(e){const r=e.reduce(((e,r)=>{const t=r.metadata.date.split("-")[0],a=e.get(t)??[];return e.set(t,[r,...a])}),new Map);return Array.from(r,(e=>{let[r,t]=e;return{year:r,posts:t}}))}(r.blogPosts);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.be,{title:t,description:a}),(0,o.jsxs)(c.A,{children:[(0,o.jsx)("header",{className:"hero hero--primary",children:(0,o.jsxs)("div",{className:"container",children:[(0,o.jsx)(l.A,{as:"h1",className:"hero__title",children:t}),(0,o.jsx)("p",{className:"hero__subtitle",children:a})]})}),(0,o.jsx)("main",{children:i.length>0&&(0,o.jsx)(h,{years:i})})]})]})}},9282:(e,r,t)=>{t.d(r,{i:()=>s});var a=t(5937);function s(e){void 0===e&&(e={});const{i18n:{currentLocale:r}}=(0,a.A)(),t=function(){const{i18n:{currentLocale:e,localeConfigs:r}}=(0,a.A)();return r[e].calendar}();return new Intl.DateTimeFormat(r,{calendar:t,...e})}}}]);