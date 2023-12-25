"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[1231],{6955:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>p,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var t=i(1527),a=i(7252);const s={sidebar_label:"7. \u05d0\u05d9\u05da \u05dc\u05e4\u05e8\u05e1\u05dd package \u05d1-npm",sidebar_position:5},o="How to publish your NPM Package",l={id:"programming/npm",title:"How to publish your NPM Package",description:"1. Getting started",source:"@site/i18n/he/docusaurus-plugin-content-docs/current/programming/npm.md",sourceDirName:"programming",slug:"/programming/npm",permalink:"/guides/he/docs/programming/npm",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/npm.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_label:"7. \u05d0\u05d9\u05da \u05dc\u05e4\u05e8\u05e1\u05dd package \u05d1-npm",sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"6. SSH",permalink:"/guides/he/docs/programming/ssh"},next:{title:"8. Storybook",permalink:"/guides/he/docs/programming/storybook"}},r={},c=[{value:"1. Getting started",id:"1-getting-started",level:2},{value:"2. Connect project to GitHub",id:"2-connect-project-to-github",level:2},{value:"3. Package Contents",id:"3-package-contents",level:2},{value:"4. Use <code>npm link</code> to import package locally",id:"4-use-npm-link-to-import-package-locally",level:2},{value:"\u2022 Step 1: npm link",id:"-step-1-npm-link",level:3},{value:"\u2022 Step 2: npm link pkg-name",id:"-step-2-npm-link-pkg-name",level:3},{value:"5. Publish package to npm registry",id:"5-publish-package-to-npm-registry",level:2}];function d(e){const n={admonition:"admonition",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"how-to-publish-your-npm-package",children:"How to publish your NPM Package"}),"\n",(0,t.jsx)(n.h2,{id:"1-getting-started",children:"1. Getting started"}),"\n",(0,t.jsx)(n.p,{children:"Create a new folder, and init a git project (Give it a meaningful name)."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm init\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You can prefix your packages, just @redux-toolkit or @babel did, with @someName at the beginning.",(0,t.jsx)(n.br,{}),"\n","If you wish to ",(0,t.jsx)(n.em,{children:"prefix"})," your package, you can do manually post initiation, or you can do so during the init process, using the ",(0,t.jsx)(n.code,{children:"scope"})," flag:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm init --scope=talkohavy\n"})}),"\n",(0,t.jsxs)(n.p,{children:["This will have your package scoped.",(0,t.jsx)(n.br,{}),"\n",'For example, the above package would get a prefix of "@talkohavy/" added to its name.']}),"\n",(0,t.jsx)(n.h2,{id:"2-connect-project-to-github",children:"2. Connect project to GitHub"}),"\n",(0,t.jsxs)(n.p,{children:["This step isn't mandatory I guess, ...",(0,t.jsx)(n.br,{}),"\n","i'll need to check.\nMake a commit and connect the project to a remote git repo."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"git init\ngit add .\ngit commit -m 'first commit'\ngit remote add origin git@github.com:talkohavy/<name>.git\ngit push -u origin master\n"})}),"\n",(0,t.jsx)(n.h2,{id:"3-package-contents",children:"3. Package Contents"}),"\n",(0,t.jsx)(n.p,{children:"Create the following structure:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"An index.js"}),"\n",(0,t.jsx)(n.li,{children:"A lib directory"}),"\n",(0,t.jsxs)(n.li,{children:["A ",(0,t.jsx)(n.strong,{children:"test"})," folder"]}),"\n"]}),"\n",(0,t.jsxs)(n.h2,{id:"4-use-npm-link-to-import-package-locally",children:["4. Use ",(0,t.jsx)(n.code,{children:"npm link"})," to import package locally"]}),"\n",(0,t.jsxs)(n.p,{children:["Before publishing a package to npm, you can test it locally by importing it to a side-project, and check that it works.",(0,t.jsx)(n.br,{}),"\n","For that we use the command ",(0,t.jsx)(n.code,{children:"npm link"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"-step-1-npm-link",children:"\u2022 Step 1: npm link"}),"\n",(0,t.jsx)(n.p,{children:"Go into the package folder, and run the command:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm link\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Running ",(0,t.jsx)(n.code,{children:"npm link"})," symlinks a package folder. This is handy for installing your own stuff, so that you can work on it and test iteratively without having to continually rebuild."]}),"\n",(0,t.jsx)(n.h3,{id:"-step-2-npm-link-pkg-name",children:"\u2022 Step 2: npm link pkg-name"}),"\n",(0,t.jsx)(n.p,{children:"Create a dummy project somewhere on your machine, and do:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"npm init -y\nnpm link <pkg-name>\n"})}),"\n",(0,t.jsx)(n.p,{children:"In the dummy project, create a quick script which imports the to-be-published package, and test it."}),"\n",(0,t.jsxs)(n.admonition,{type:"info",children:[(0,t.jsx)(n.p,{children:(0,t.jsxs)(n.strong,{children:["HOW DOES ",(0,t.jsx)(n.code,{children:"NPM LINK"})," WORK?"]})}),(0,t.jsx)(n.p,{children:"Package linking is a two-step process:"}),(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Run ",(0,t.jsx)(n.code,{children:"npm link"})," inside the package you wish to publish"]}),"\n",(0,t.jsxs)(n.li,{children:["Run ",(0,t.jsx)(n.code,{children:"npm link <pkg-name>"})," inside the test package which imports the package."]}),"\n"]}),(0,t.jsxs)(n.p,{children:["The first step will create a symlink in the global folder < prefix>/lib/node_modules/< name-of-package> that links to the package where the ",(0,t.jsx)(n.code,{children:"npm link"})," command was executed."]}),(0,t.jsx)(n.p,{children:"The second step will create a symbolic link from globally-installed package-name to node_modules/ of the current folder."}),(0,t.jsx)(n.admonition,{type:"tip",children:(0,t.jsx)(n.p,{children:"Note that package-name is taken from package.json, not from the directory name."})})]}),"\n",(0,t.jsx)(n.h2,{id:"5-publish-package-to-npm-registry",children:"5. Publish package to npm registry"}),"\n",(0,t.jsxs)(n.p,{children:["Now that we've verified that our package works locally, it;s time we upload it to our personal npm registry.",(0,t.jsx)(n.br,{}),"\n","uploading is called publish in npm, and the command is ",(0,t.jsx)(n.code,{children:"npm publish"}),".\nBefore you can publish, you need to login to npm."]}),"\n",(0,t.jsxs)(n.p,{children:["To login run the ",(0,t.jsx)(n.code,{children:"npm login"})," command:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm login\n"})}),"\n",(0,t.jsx)(n.p,{children:"You'll be asked to input your username (talkohavy), your password (a9...), and your email (ta***@gmail.com). You'll also be sent a one-time password to your email."}),"\n",(0,t.jsx)(n.p,{children:"Now that we've logged in successfully, it's time to publish our package:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm publish\n"})}),"\n",(0,t.jsx)(n.p,{children:"If your package is prefixed (i.e. @talkohavy/lodash), you'll have to add the access public flag:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm publish --access=public\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Without the access public flag, you'll get an error saying you must sign up for private packages, and the the publish command will fail.",(0,t.jsx)(n.br,{}),"\n","This is because when trying to publish, by default, npm thinks you're trying to publish a private package. You can fix this by adding the ",(0,t.jsx)(n.code,{children:"access"})," flag to the publish command, and setting it to ",(0,t.jsx)(n.em,{children:"public"}),", telling npm that this package is in fact public."]})]})}function p(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},7252:(e,n,i)=>{i.d(n,{Z:()=>l,a:()=>o});var t=i(959);const a={},s=t.createContext(a);function o(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);