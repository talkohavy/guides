"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[3876],{7431:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>t,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var l=r(1527),s=r(7252);const o={sidebar_label:"12. Helm",sidebar_position:11},a="Guide For Helm",i={id:"programming/helm",title:"Guide For Helm",description:"1. Helm Commands",source:"@site/docs/programming/helm.md",sourceDirName:"programming",slug:"/programming/helm",permalink:"/guides/he/docs/programming/helm",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/helm.md",tags:[],version:"current",sidebarPosition:11,frontMatter:{sidebar_label:"12. Helm",sidebar_position:11},sidebar:"tutorialSidebar",previous:{title:"11. Kubernetes",permalink:"/guides/he/docs/programming/kubernetes"},next:{title:"13. Configuration Server",permalink:"/guides/he/docs/programming/configuration-server"}},t={},c=[{value:"<strong>1. Helm Commands</strong>",id:"1-helm-commands",level:2},{value:"- Command 1: helm install",id:"--command-1-helm-install",level:3},{value:"- Command 2: helm upgrade",id:"--command-2-helm-upgrade",level:3},{value:"- Command 3: helm rollback",id:"--command-3-helm-rollback",level:3},{value:"- Command 4: helm package",id:"--command-4-helm-package",level:3},{value:"- Command 5: helm create",id:"--command-5-helm-create",level:3},{value:"<strong>2. Introduction</strong>",id:"2-introduction",level:2}];function d(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.h1,{id:"guide-for-helm",children:"Guide For Helm"}),"\n",(0,l.jsx)(n.h2,{id:"1-helm-commands",children:(0,l.jsx)(n.strong,{children:"1. Helm Commands"})}),"\n",(0,l.jsx)(n.h3,{id:"--command-1-helm-install",children:"- Command 1: helm install"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"The command:"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-bash",children:"helm install <my-app>\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Description:"})}),"\n",(0,l.jsx)("br",{}),"\n",(0,l.jsx)(n.h3,{id:"--command-2-helm-upgrade",children:"- Command 2: helm upgrade"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"The command:"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-bash",children:"helm upgrade <my-app> path/to/webapp/ --values path/to/values.yaml\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Description:"})}),"\n",(0,l.jsx)("br",{}),"\n",(0,l.jsx)(n.h3,{id:"--command-3-helm-rollback",children:"- Command 3: helm rollback"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"The command:"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-bash",children:"helm rollback <my-app>\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Description:"})}),"\n",(0,l.jsx)("br",{}),"\n",(0,l.jsx)(n.h3,{id:"--command-4-helm-package",children:"- Command 4: helm package"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"The command:"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-bash",children:"helm package <my-app>\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Description:"})}),"\n",(0,l.jsx)("br",{}),"\n",(0,l.jsx)(n.h3,{id:"--command-5-helm-create",children:"- Command 5: helm create"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"The command:"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-bash",children:"helm create <my-app>\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Description:"})}),"\n",(0,l.jsx)("br",{}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h2,{id:"2-introduction",children:(0,l.jsx)(n.strong,{children:"2. Introduction"})}),"\n",(0,l.jsx)(n.p,{children:"Helm is a package manager for kubernetes, that make it easy to take applications and services that are highly repeatable or get used in a lot of different scenarios and it makes it easier to deploy them to a typical kubernetes cluster."}),"\n",(0,l.jsx)(n.p,{children:"chart = template"}),"\n",(0,l.jsx)(n.p,{children:"Your chart is going to consist of all the files that you're going to be template'ing here."}),"\n",(0,l.jsxs)(n.p,{children:["Helm talks to a component that needs to be installed on your kubernetes cluster called ",(0,l.jsx)(n.strong,{children:"Tiller"}),'. Tiller is basically just the server-side component of helm. It\'s gonna take the commands you\'ve sent with helm client, and turn it into something that your kubernetes cluster will understand. Now, this becomes extra useful when you wanna doo things like "upgrade to a new configuration" or "rollback to an older version".']}),"\n",(0,l.jsx)(n.p,{children:"What Helm will also give you is that it actually keeps a version history for you of different configurations you've sent over the wire with help, so you can rollback to the last known working configuration whenever you want to."}),"\n",(0,l.jsx)(n.p,{children:"Good things to template:"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["the ",(0,l.jsx)(n.code,{children:"namespace"})]}),"\n",(0,l.jsxs)(n.li,{children:["the ",(0,l.jsx)(n.code,{children:"selector"})," name"]}),"\n",(0,l.jsxs)(n.li,{children:["the ",(0,l.jsx)(n.code,{children:"image"}),":","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["its ",(0,l.jsx)(n.code,{children:"name"})]}),"\n",(0,l.jsxs)(n.li,{children:["its ",(0,l.jsx)(n.code,{children:"tag"})]}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["the ",(0,l.jsx)(n.code,{children:"configmap.name"})]}),"\n"]}),"\n",(0,l.jsxs)(n.p,{children:["Create a NOTES.txt file, which outputs to the user on every upgrade command.",(0,l.jsx)(n.br,{}),"\n","This file could also be templated."]}),"\n",(0,l.jsx)(n.p,{children:"You can create 1 values.yaml file for production and one for development."})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},7252:(e,n,r)=>{r.d(n,{Z:()=>i,a:()=>a});var l=r(959);const s={},o=l.createContext(s);function a(e){const n=l.useContext(o);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),l.createElement(o.Provider,{value:n},e.children)}}}]);