"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4612],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(n),g=o,f=d["".concat(p,".").concat(g)]||d[g]||m[g]||a;return n?r.createElement(f,i(i({ref:t},l),{},{components:n})):r.createElement(f,i({ref:t},l))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=g;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[d]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},2229:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_label:"SOLID",sidebar_position:0,slug:"solid"},i="SOLID",s={unversionedId:"programming/concepts/SOLID",id:"programming/concepts/SOLID",title:"SOLID",description:"An acronym for 5 design principles in software engineering.",source:"@site/docs/programming/concepts/SOLID.md",sourceDirName:"programming/concepts",slug:"/programming/concepts/solid",permalink:"/guides/docs/programming/concepts/solid",draft:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/concepts/SOLID.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_label:"SOLID",sidebar_position:0,slug:"solid"},sidebar:"tutorialSidebar",previous:{title:"Software Concepts",permalink:"/guides/docs/category/software-concepts"},next:{title:"Design by Contract",permalink:"/guides/docs/programming/concepts/design-by-contract"}},p={},c=[{value:"- <code>Definition</code>",id:"--definition",level:2},{value:"- <code>Breakdown of the Acronym</code>",id:"--breakdown-of-the-acronym",level:2}],l={toc:c},d="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(d,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"solid"},"SOLID"),(0,o.kt)("font",{size:"4"},"An acronym for ",(0,o.kt)("strong",null,"5 design principles")," in software engineering."),(0,o.kt)("h2",{id:"--definition"},"- ",(0,o.kt)("inlineCode",{parentName:"h2"},"Definition")),(0,o.kt)("p",null,"In software engineering, SOLID is an acronym for five design principles intended to make object-oriented designs more understandable, flexible, and maintainable.  "),(0,o.kt)("br",null),(0,o.kt)("h2",{id:"--breakdown-of-the-acronym"},"- ",(0,o.kt)("inlineCode",{parentName:"h2"},"Breakdown of the Acronym")),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"Letter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Meaning"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"td"},(0,o.kt)("font",{size:"6"},(0,o.kt)("span",{style:{color:"red"}},"S")))),(0,o.kt)("td",{parentName:"tr",align:"left"},"The ",(0,o.kt)("strong",{parentName:"td"},"Single Responsibility")," principle says that ",(0,o.kt)("em",{parentName:"td"},"Every class should have only one responsibility"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"td"},(0,o.kt)("font",{size:"6"},(0,o.kt)("span",{style:{color:"red"}},"O")))),(0,o.kt)("td",{parentName:"tr",align:"left"},"The ",(0,o.kt)("strong",{parentName:"td"},"Open-Closed")," principle says that ",(0,o.kt)("em",{parentName:"td"},"Software entities should be open for extension, but closed for modification"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"td"},(0,o.kt)("font",{size:"6"},(0,o.kt)("span",{style:{color:"red"}},"L")))),(0,o.kt)("td",{parentName:"tr",align:"left"},"The ",(0,o.kt)("strong",{parentName:"td"},"Liskov Substitution")," principle says that ",(0,o.kt)("em",{parentName:"td"},"Functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it"),". See also ",(0,o.kt)("a",{parentName:"td",href:"/docs/programming/concepts/design-by-contract",title:"Go to Design by Contract guide"},"design by contract"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"td"},(0,o.kt)("font",{size:"6"},(0,o.kt)("span",{style:{color:"red"}},"I")))),(0,o.kt)("td",{parentName:"tr",align:"left"},"The ",(0,o.kt)("strong",{parentName:"td"},"Interface Segregation")," principle says that ",(0,o.kt)("em",{parentName:"td"},"Clients should not be forced to depend upon interfaces that they do not use"),'".')),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("strong",{parentName:"td"},(0,o.kt)("font",{size:"6"},(0,o.kt)("span",{style:{color:"red"}},"D")))),(0,o.kt)("td",{parentName:"tr",align:"left"},"The ",(0,o.kt)("strong",{parentName:"td"},"Dependency Inversion")," principle instructs you to ",(0,o.kt)("em",{parentName:"td"},"Depend upon abstractions, not concretions"),".")))),(0,o.kt)("p",null,"Although the SOLID principles apply to any object-oriented design, they can also form a core philosophy for methodologies such as agile development or adaptive software development."))}m.isMDXComponent=!0}}]);