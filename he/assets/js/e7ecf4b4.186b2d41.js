"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[4599],{917:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var t=i(6070),s=i(5710);const o={},a="Guide For Micro-Frontends",r={id:"programming/micro-frontends",title:"Guide For Micro-Frontends",description:"1. Pros & Cons",source:"@site/docs/programming/micro-frontends.md",sourceDirName:"programming",slug:"/programming/micro-frontends",permalink:"/guides/he/docs/programming/micro-frontends",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/micro-frontends.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- Kubernetes",permalink:"/guides/he/docs/programming/kubernetes"},next:{title:"- NestJS",permalink:"/guides/he/docs/programming/nest"}},l={},d=[{value:"1. Pros &amp; Cons",id:"1-pros--cons",level:2},{value:"2. Micro-Frontends Concepts",id:"2-micro-frontends-concepts",level:2},{value:"3. Micro-Frontends Challenges",id:"3-micro-frontends-challenges",level:2},{value:"- 1. Communication between micro-frontends",id:"--1-communication-between-micro-frontends",level:3},{value:"- 2. Sharing css &amp; design issues",id:"--2-sharing-css--design-issues",level:3},{value:"- 3. Sharing dependencies",id:"--3-sharing-dependencies",level:3},{value:"4. Integration Approaches",id:"4-integration-approaches",level:2},{value:"- A. Server-side template composition",id:"--a-server-side-template-composition",level:3},{value:"- B. Build time integration",id:"--b-build-time-integration",level:3},{value:"- C. Run time integration",id:"--c-run-time-integration",level:3},{value:"5. Differences between build-time &amp; runtime integrations",id:"5-differences-between-build-time--runtime-integrations",level:2},{value:"6. Runtime Integration",id:"6-runtime-integration",level:2},{value:"7. Implementing Webpack&#39;s Module Federation",id:"7-implementing-webpacks-module-federation",level:2},{value:"Module Federation Concepts",id:"module-federation-concepts",level:3},{value:"Low-level concepts",id:"low-level-concepts",level:3},{value:"High-level concepts",id:"high-level-concepts",level:3},{value:"Building blocks",id:"building-blocks",level:3},{value:"ContainerPlugin (low level)",id:"containerplugin-low-level",level:4},{value:"ContainerReferencePlugin (low level)",id:"containerreferenceplugin-low-level",level:4},{value:"ModuleFederationPlugin (high level)",id:"modulefederationplugin-high-level",level:4},{value:"Concept goals",id:"concept-goals",level:3},{value:"Use cases",id:"use-cases",level:3},{value:"Separate builds per page",id:"separate-builds-per-page",level:4},{value:"Components library as container",id:"components-library-as-container",level:4},{value:"Promise Based Dynamic Remotes",id:"promise-based-dynamic-remotes",level:3},{value:"8. Shared",id:"8-shared",level:2},{value:"9. Communication",id:"9-communication",level:2},{value:"10. Development Strategies With Frameworks",id:"10-development-strategies-with-frameworks",level:2}];function c(e){const n={a:"a",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"guide-for-micro-frontends",children:"Guide For Micro-Frontends"}),"\n",(0,t.jsx)(n.h2,{id:"1-pros--cons",children:"1. Pros & Cons"}),"\n",(0,t.jsx)(n.p,{children:"\u2022 Monolith Pros"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Easier to develop"}),"\n",(0,t.jsx)(n.li,{children:"Easier to deploy"}),"\n",(0,t.jsx)(n.li,{children:"Easy to scale"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u2022 Monolith Cons"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Codebase size is huge"}),"\n",(0,t.jsx)(n.li,{children:"Deployment of whole application for a small change"}),"\n",(0,t.jsx)(n.li,{children:"Commitment to a single tech-stack"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u2022 Micro-Frontends Pros"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Incremental upgrades"}),"\n",(0,t.jsx)(n.li,{children:"Simple decoupled codebase"}),"\n",(0,t.jsx)(n.li,{children:"Independent deployment"}),"\n",(0,t.jsx)(n.li,{children:"Autonomous teams"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u2022 Micro-Frontends Cons"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Payload size\nif the builds of the application are not handled properly, it can significantly increase the payload size"}),"\n",(0,t.jsx)(n.li,{children:"Operational complexity"}),"\n",(0,t.jsx)(n.li,{children:"Increased cost of multiple configurations (setups)"}),"\n",(0,t.jsx)(n.li,{children:"Multiple servers"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"2-micro-frontends-concepts",children:"2. Micro-Frontends Concepts"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"communication"})}),"\n",(0,t.jsx)(n.p,{children:"should be kept to a minimum, and if used, then only for simple stuff."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Shared"})}),"\n",(0,t.jsx)(n.p,{children:"Common dependencies should be shared. Even if two teams are building separate applications, they might be using similar dependencies. Those same dependencies, should not be loaded to our browser twice."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Zero Coupling"})}),"\n",(0,t.jsx)(n.p,{children:"Try to go for zero coupling among projects. Even if it might take a bit more effort, aim to achieve this."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"State"})}),"\n",(0,t.jsx)(n.p,{children:"You should never use any shared store (like redux) in any of your micro-frontend implementation."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Design"})}),"\n",(0,t.jsx)(n.p,{children:"CSS from one application should not affect another application."}),"\n",(0,t.jsx)(n.h2,{id:"3-micro-frontends-challenges",children:"3. Micro-Frontends Challenges"}),"\n",(0,t.jsx)(n.p,{children:"The main challenges are:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Communication between micro-frontends"}),"\n",(0,t.jsx)(n.li,{children:"Sharing css & design issues"}),"\n",(0,t.jsx)(n.li,{children:"Sharing dependencies"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"--1-communication-between-micro-frontends",children:"- 1. Communication between micro-frontends"}),"\n",(0,t.jsxs)(n.p,{children:["Communication should happen via callbacks oe events.",(0,t.jsx)(n.br,{}),"\n","Like we stressed out earlier, avoid communication as much as you can.",(0,t.jsx)(n.br,{}),"\n","Make sure that you ",(0,t.jsx)(n.em,{children:"really"})," need to communicate between them."]}),"\n",(0,t.jsx)(n.h3,{id:"--2-sharing-css--design-issues",children:"- 2. Sharing css & design issues"}),"\n",(0,t.jsxs)(n.p,{children:["Use css-in-js library.",(0,t.jsx)(n.br,{}),"\n","Always try to manually namespace the css."]}),"\n",(0,t.jsx)(n.h3,{id:"--3-sharing-dependencies",children:"- 3. Sharing dependencies"}),"\n",(0,t.jsxs)(n.p,{children:["Let's say all of your micro-frontend use ",(0,t.jsx)(n.code,{children:"react"}),", and even more so, use the same version of react. If each team used its own react, when this two applications will get loaded in the browser, the browser will be loading 2 copies of react, which would make the payload size pretty big."]}),"\n",(0,t.jsx)(n.h2,{id:"4-integration-approaches",children:"4. Integration Approaches"}),"\n",(0,t.jsx)(n.p,{children:"The integration approaches are:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Server-side template composition"}),"\n",(0,t.jsx)(n.li,{children:"Build time integration"}),"\n",(0,t.jsx)(n.li,{children:"Run time integration"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"--a-server-side-template-composition",children:"- A. Server-side template composition"}),"\n",(0,t.jsxs)(n.p,{children:["The first and very simple integration approach we know called ",(0,t.jsx)(n.strong,{children:"server-side template composition"}),". What happens in this one is that all the micro-frontends would be integrated on the server side, before it is ever presented to the client. This is not the solution we want, because it comes with a huge overhead on our application server."]}),"\n",(0,t.jsx)(n.h3,{id:"--b-build-time-integration",children:"- B. Build time integration"}),"\n",(0,t.jsxs)(n.p,{children:["The next one is ",(0,t.jsx)(n.strong,{children:"Build time integration"}),". This is a very simple one. In any application you have built you've probably used build time integration, although you may not have realized it."]}),"\n",(0,t.jsx)(n.p,{children:"During build time, all separate micro-applications are downloaded and integrate into a container application during its build process, and it was then deployed as a whole to each and every environment."}),"\n",(0,t.jsx)(n.p,{children:"Let's look at a timeline you should be familiar with:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Development"}),": Engineering team A develops a LIST library."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Deployment"}),": Team A deploys the package to npm."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Publishing"}),": Team A publishes the package to npm."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Team B"}),": Develops the container frontend consuming the package."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Build"}),": Build the app with LIST dependency."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Release"}),": Release the application bundle."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"As you can understand from the step above, when team A makes a package of v1 team B needs to list it as its dependency, and import it in order to use it. But what if team A release a v2 of that package? In such a scenario, team B would have to list v2 now as its dependency, replacing v1, and so another build process is required, as well as a full CI/CD & deployment. This is where runtime build integration comes into the picture."}),"\n",(0,t.jsx)(n.h3,{id:"--c-run-time-integration",children:"- C. Run time integration"}),"\n",(0,t.jsxs)(n.p,{children:["The next one is ",(0,t.jsx)(n.strong,{children:"Run time integration"}),". This can take place:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"via IFrames"}),"\n",(0,t.jsx)(n.li,{children:"via JavaScript"}),"\n",(0,t.jsx)(n.li,{children:"via Web Components"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Under optimal circumstances, and as for best practices sake, the runtime integration should always happen via JavaScript.",(0,t.jsx)(n.br,{}),"\n","The timeline of making runtime integration using javascript is as follows:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Development of application A"}),"\n",(0,t.jsx)(n.li,{children:"Building the application"}),"\n",(0,t.jsxs)(n.li,{children:["Deploy it onto a specific url (i.e. ",(0,t.jsx)(n.strong,{children:(0,t.jsx)(n.a,{href:"https://all-app.com/app-a.js",children:"https://all-app.com/app-a.js"})}),")"]}),"\n",(0,t.jsx)(n.li,{children:"Navigate to Container app"}),"\n",(0,t.jsxs)(n.li,{children:["Fetch ",(0,t.jsx)(n.strong,{children:"app-a.js"})," and execute it in that container application"]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["So how the runtime integration works here is anytime that application A has an update, it will be redeployed to that same url, that the container already has a reference to. So whenever the container gets loaded, it will be loaded with the updated app-a.js, and the container will always show the updated version of application A, and it would be highly decoupled, and that would be an advantage for both of the teams.",(0,t.jsx)(n.br,{}),"\n","So this was the timeline of runtime integration via JavaScript."]}),"\n",(0,t.jsx)(n.h2,{id:"5-differences-between-build-time--runtime-integrations",children:"5. Differences between build-time & runtime integrations"}),"\n",(0,t.jsx)(n.p,{children:"blu blu blu"}),"\n",(0,t.jsx)(n.h2,{id:"6-runtime-integration",children:"6. Runtime Integration"}),"\n",(0,t.jsx)(n.p,{children:"I this section we will look at webpack module federation, that allows us to create an application that we will be able to fetch during runtime and execute it in a way that do not require us building the application upfront again & again like in the build integration."}),"\n",(0,t.jsxs)(n.p,{children:['This will be (and also "is") the development process that we take when we want to implement a runtime integration via javascript.\nFirst, we will create on a child application called LIST. We will then build it, and then deploy it to its own URL (i.e. ',(0,t.jsx)(n.a,{href:"http://localhost:8001",children:"http://localhost:8001"}),").\nThe ",(0,t.jsx)(n.strong,{children:"build"})," and the ",(0,t.jsx)(n.strong,{children:"hosting part"})," will be taken care of by ",(0,t.jsx)(n.strong,{children:"Webpack"}),". These two are very basic functionalities provided to us by webpack.",(0,t.jsx)(n.br,{}),"\n",'After that, we will go to the container application. Keep in mind that the container application has to have the LIST code, since the container application is only used as kind of a "host" of all the applications that are being built by different teams. And next, what we\'ll do is go fetch ',(0,t.jsx)(n.strong,{children:"list.js"})," from the url ",(0,t.jsx)(n.a,{href:"http://localhost:8001",children:"http://localhost:8001"}),", where we host it, and have it executed on demand."]}),"\n",(0,t.jsx)(n.h2,{id:"7-implementing-webpacks-module-federation",children:"7. Implementing Webpack's Module Federation"}),"\n",(0,t.jsxs)(n.p,{children:["Now that you have a host (container) application and a remote application, you will now have to decide which of the modules which exist within the ",(0,t.jsx)(n.strong,{children:"remote"})," application you want to ",(0,t.jsx)(n.em,{children:"expose"})," to the ",(0,t.jsx)(n.strong,{children:"host"})," (container) application. In order to expose those modules in the remote application we will have to setup ",(0,t.jsx)(n.code,{children:"module federation"})," in our ",(0,t.jsx)(n.strong,{children:"remote"})," application. Inside the host (container) application, now that we know that the remote application is exposing the modules that it wants to expose, we will identify the files we want to get from that remote module. Inside the host application we will also set up ",(0,t.jsx)(n.code,{children:"module federation"})," to fetch the files from the remote application. Even though it is not ",(0,t.jsx)(n.em,{children:"necessary"})," to implement module federation in the host application, it is a very good way to implement the runtime integration, and this is also what the industry follows. Now that we have the module federation set up both for the container and the remote application we now just have to import the files from the remote, and that would be the end of it. That would mean the accomplishment of the runtime integration."]}),"\n",(0,t.jsx)(n.p,{children:"Going to the webpack official website, you will see the following:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="webpack.config.js"',children:"import HtmlWebpackPlugin from 'html-webpack-plugin';\nimport HtmlWebpackPlugin from 'html-webpack-plugin';\n\n/** @type {import('webpack').Configuration} */\nconst webpackConfig = {\n  entry: {\n    remote: './public-path',\n  }\n\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'remote', // <--- this name MUST match the entry name!\n      exposes: ['./public-path'],\n    }),\n  ],\n};\n\nexport default webpackConfig;\n"})}),"\n",(0,t.jsxs)(n.p,{children:["In the config file above, the most important thing is the ",(0,t.jsx)(n.strong,{children:"exposes"})," part. Inside of it we provide the things we want to expose from our application."]}),"\n",(0,t.jsx)(n.h3,{id:"module-federation-concepts",children:"Module Federation Concepts"}),"\n",(0,t.jsxs)(n.p,{children:["Straight from ",(0,t.jsx)(n.strong,{children:"webpack"}),":"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Motivation for Module Federation"}),"\n",(0,t.jsx)(n.em,{children:"Multiple separate builds should form a single application. These separate builds act like containers and can expose and consume code between builds, creating a single, unified application."})]}),"\n",(0,t.jsx)(n.h3,{id:"low-level-concepts",children:"Low-level concepts"}),"\n",(0,t.jsx)(n.p,{children:"We distinguish between local and remote modules. Local modules are regular modules that are part of the current build. Remote modules are modules that are not part of the current build but are loaded at runtime from a remote container."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.em,{children:"Loading remote modules is considered an asynchronous operation"}),". When using a remote module, these asynchronous operations will be placed in the next chunk loading operation(s) that are between the remote module and the entrypoint. It's not possible to use a remote module without a chunk loading operation."]}),"\n",(0,t.jsxs)(n.p,{children:["A chunk loading operation is usually an ",(0,t.jsx)(n.code,{children:"import()"})," call, but older constructs like ",(0,t.jsx)(n.code,{children:"require.ensure"})," or ",(0,t.jsx)(n.code,{children:"require([...])"})," are supported as well."]}),"\n",(0,t.jsx)(n.p,{children:"A container is created through a container entry, which exposes asynchronous access to the specific modules. The exposed access is separated into two steps:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"loading the module (asynchronous)"}),"\n",(0,t.jsx)(n.li,{children:"evaluating the module (synchronous)."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Step 1 will be done during the chunk loading. Step 2 will be done during the module evaluation interleaved with other (local and remote) modules. This way, evaluation order is unaffected by converting a module from local to remote or the other way around."}),"\n",(0,t.jsx)(n.p,{children:"It is possible to nest containers. Containers can use modules from other containers. Circular dependencies between containers are also possible."}),"\n",(0,t.jsx)(n.h3,{id:"high-level-concepts",children:"High-level concepts"}),"\n",(0,t.jsx)(n.p,{children:"Each build acts as a container and also consumes other builds as containers. This way, each build is able to access any other exposed module by loading it from its container."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Shared modules"})," are modules that are both:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"override-able"}),"\n",(0,t.jsx)(n.li,{children:"provided as overrides to nested containers."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"They usually point to the same module in each build, e.g., the same library."}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"packageName"})," option allows setting a package name to look for a ",(0,t.jsx)(n.code,{children:"requiredVersion"}),". It is automatically inferred for the module requests by default, set ",(0,t.jsx)(n.code,{children:"requiredVersion"})," to ",(0,t.jsx)(n.code,{children:"false"})," when automatic infer should be disabled."]}),"\n",(0,t.jsx)(n.h3,{id:"building-blocks",children:"Building blocks"}),"\n",(0,t.jsx)(n.h4,{id:"containerplugin-low-level",children:"ContainerPlugin (low level)"}),"\n",(0,t.jsxs)(n.p,{children:["This plugin ",(0,t.jsx)(n.strong,{children:"creates an additional container entry"})," with the specified ",(0,t.jsx)(n.strong,{children:"exposed modules"}),"."]}),"\n",(0,t.jsx)(n.h4,{id:"containerreferenceplugin-low-level",children:"ContainerReferencePlugin (low level)"}),"\n",(0,t.jsxs)(n.p,{children:["This plugin ",(0,t.jsx)(n.strong,{children:"adds specific references to containers"})," as externals and ",(0,t.jsx)(n.strong,{children:"allows to import remote modules"})," from these containers. It also calls the override API of these containers to provide overrides to them. Local overrides (via ",(0,t.jsx)(n.code,{children:"__webpack_override__"})," or override API when build is also a container) and specified overrides are provided to all referenced containers."]}),"\n",(0,t.jsx)(n.h4,{id:"modulefederationplugin-high-level",children:"ModuleFederationPlugin (high level)"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"ModuleFederationPlugin"})," combines ",(0,t.jsx)(n.code,{children:"ContainerPlugin"})," and ",(0,t.jsx)(n.code,{children:"ContainerReferencePlugin"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"concept-goals",children:"Concept goals"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"It should be possible to expose and consume any module type that webpack supports."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Chunk loading should load everything needed in parallel (web: single round-trip to server)."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Control from consumer to container"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Overriding modules is a one-directional operation."}),"\n",(0,t.jsx)(n.li,{children:"Sibling containers cannot override each other's modules."}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Concept should be environment-independent."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Usable in web, Node.js, etc."}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Relative and absolute request in shared:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Will always be provided, even if not used."}),"\n",(0,t.jsxs)(n.li,{children:["Will resolve relative to ",(0,t.jsx)(n.code,{children:"config.context"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Does not use a ",(0,t.jsx)(n.code,{children:"requiredVersion"})," by default."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Module requests in shared:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Are only provided when they are used."}),"\n",(0,t.jsx)(n.li,{children:"Will match all used equal module requests in your build."}),"\n",(0,t.jsx)(n.li,{children:"Will provide all matching modules."}),"\n",(0,t.jsxs)(n.li,{children:["Will extract ",(0,t.jsx)(n.code,{children:"requiredVersion"})," from ",(0,t.jsx)(n.code,{children:"package.json"})," at this position in the graph."]}),"\n",(0,t.jsx)(n.li,{children:"Could provide and consume multiple different versions when you have nested node_modules."}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Module requests with trailing ",(0,t.jsx)(n.code,{children:"/"})," in shared will match all module requests with this prefix."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"use-cases",children:"Use cases"}),"\n",(0,t.jsx)(n.h4,{id:"separate-builds-per-page",children:"Separate builds per page"}),"\n",(0,t.jsx)(n.p,{children:"Each page of a Single Page Application is exposed from container build in a separate build. The application shell is also a separate build referencing all pages as remote modules. This way each page can be separately deployed. The application shell is deployed when routes are updated or new routes are added. The application shell defines commonly used libraries as shared modules to avoid duplication of them in the page builds."}),"\n",(0,t.jsx)(n.h4,{id:"components-library-as-container",children:"Components library as container"}),"\n",(0,t.jsx)(n.p,{children:"Many applications share a common components library which could be built as a container with each component exposed. Each application consumes components from the components library container. Changes to the components library can be separately deployed without the need to re-deploy all applications. The application automatically uses the up-to-date version of the components library."}),"\n",(0,t.jsx)(n.h3,{id:"promise-based-dynamic-remotes",children:"Promise Based Dynamic Remotes"}),"\n",(0,t.jsx)(n.p,{children:"Generally, remotes are configured using URL's like in this example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:"module.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'host',\n      remotes: {\n        app1: 'app1@http://localhost:3001/remoteEntry.js',\n      },\n    }),\n  ],\n};``\n"})}),"\n",(0,t.jsx)(n.p,{children:"But you can also pass in a promise to this remote, which will be resolved at runtime. You should resolve this promise with any module that fits the get/init interface described above. For example, if you wanted to pass in which version of a federated module you should use, via a query parameter you could do something like the following:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:"module.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'host',\n      remotes: {\n        app1: `promise new Promise(resolve => {\n      const urlParams = new URLSearchParams(window.location.search)\n      const version = urlParams.get('app1VersionParam')\n      // This part depends on how you plan on hosting and versioning your federated modules\n      const remoteUrlWithVersion = 'http://localhost:3001/' + version + '/remoteEntry.js'\n      const script = document.createElement('script')\n      script.src = remoteUrlWithVersion\n      script.onload = () => {\n        // the injected script has loaded and is available on window\n        // we can now resolve this Promise\n        const proxy = {\n          get: (request) => window.app1.get(request),\n          init: (arg) => {\n            try {\n              return window.app1.init(arg)\n            } catch(e) {\n              console.log('remote container already initialized')\n            }\n          }\n        }\n        resolve(proxy)\n      }\n      // inject this script with the src set to the versioned remoteEntry.js\n      document.head.appendChild(script);\n    })\n    `,\n      },\n      // ...\n    }),\n  ],\n};\n"})}),"\n",(0,t.jsx)(n.p,{children:"Note that when using this API you have to resolve an object which contains the get/init API."}),"\n",(0,t.jsx)(n.h2,{id:"8-shared",children:"8. Shared"}),"\n",(0,t.jsxs)(n.p,{children:["This relay to webpack's implementation of shared within module federation.\nTo understand how webpack manages the ",(0,t.jsx)(n.code,{children:"shared"})," concept, let's examine the following construct:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"host"}),"\n",(0,t.jsx)(n.li,{children:"app-01"}),"\n",(0,t.jsx)(n.li,{children:"app-02"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Consider that app-01 imports and makes use of the lodash library, and that app-02 does not use it.",(0,t.jsx)(n.br,{}),"\n","In this case, if you were to open the network tab, you would see the following output:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 1",src:i(5576).A+"",width:"2240",height:"722"})}),"\n",(0,t.jsxs)(n.p,{children:["The lodash library is being loaded into the browser separately, and it weighs 99.3Kb.",(0,t.jsx)(n.br,{}),"\n","Let's add another 3rd-party package to app-01, and see what happens. We will add 2 more packages: axios & @luckylove/lodash.",(0,t.jsx)(n.br,{}),"\n","Here is the result:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 2",src:i(7683).A+"",width:"2244",height:"706"})}),"\n",(0,t.jsxs)(n.p,{children:["The bundle size went up to 129Kb, since it now contains more packages.",(0,t.jsx)(n.br,{}),"\n","Now, consider that both app-01 & app-02 import those exact 3 packages.",(0,t.jsx)(n.br,{}),"\n","Look at what happens in this case:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 3",src:i(2474).A+"",width:"2220",height:"592"})}),"\n",(0,t.jsxs)(n.p,{children:["We see that same bundle being uploaded to the browser twice! This is bad practice that we'd like to avoid. So now what we're going to do is leverage webpack's ",(0,t.jsx)(n.strong,{children:"shared"})," ability. Let's start slow. Let's first include just the lodash library inside the shared. In both apps, inside their webpack's configuration, add the ",(0,t.jsx)(n.code,{children:"shared"})," property, and type 'lodash' inside. After a refresh, the result should look like:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 4",src:i(9349).A+"",width:"2202",height:"618"})}),"\n",(0,t.jsxs)(n.p,{children:["Now we see something interesting. The bundle size of both apps, which was 129Kb before, was now reduced to 31Kb, and a single bundle was added, which is exactly the weight of the lodash package, 99.3Kb, has been added. It's like lodash was extracted from both bundles, and been put into a single shared bundle, and is being loaded once.",(0,t.jsx)(n.br,{}),"\n","Let's now do the same for ",(0,t.jsx)(n.code,{children:"axios"}),", but this time... let's share it in one but not the other. Inside the webpack config of app-01 i'm going to include ",(0,t.jsx)(n.code,{children:"axios"}),", but in app-02 I am not.\nHere is the result of doing that:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 5",src:i(6460).A+"",width:"2206",height:"788"})}),"\n",(0,t.jsxs)(n.p,{children:["We immediately notice one big difference - only the bundle size of app-01 has decreased to 29.3Kb, while app-02 has remained the same with 31Kb.",(0,t.jsx)(n.br,{}),"\n","But where did those ~2Kb difference go?",(0,t.jsx)(n.br,{}),"\n","If you look closely, you'll notice that the size of ",(0,t.jsx)(n.code,{children:"src_index.js"})," of app-01 has increase in exactly that amount! It was 1.3Kb before, and now it's 3.5Kb.",(0,t.jsx)(n.br,{}),"\n","Adding both axios & lodash to the shared gives us the following result:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 6",src:i(4567).A+"",width:"2220",height:"750"})}),"\n",(0,t.jsxs)(n.p,{children:["Both lodash and axios were put in a different bundle, lodash with 99.3Kb, and axios with 29.3Kb, where-as the size of @luckylove-lodash is spread twice, once upon ",(0,t.jsx)(n.code,{children:"src_index.js"})," of app-01, and once upon that of app-02.",(0,t.jsx)(n.br,{}),"\n","Finally, let's look at the result of exposing all 3 from both of them:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"micro-frontends - network tab - case 7",src:i(5342).A+"",width:"2240",height:"750"})}),"\n",(0,t.jsx)(n.p,{children:"Here we see an interesting choice made by webpack. It appears to be that even though @talkohavy/lodash was included in the shared of both packages, webpack still decided to burden the load of that package twice, once on each package. My guess is that when that bundle size is so small, to trade off between the over head is in favor of having it twice (once for each project), than having to the extract it to a whole other file and import it from there."}),"\n",(0,t.jsx)(n.h2,{id:"9-communication",children:"9. Communication"}),"\n",(0,t.jsx)(n.p,{children:"Ways to communicate are:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"query params"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"10-development-strategies-with-frameworks",children:"10. Development Strategies With Frameworks"}),"\n",(0,t.jsxs)(n.p,{children:["We will now try to use a framework library like react to build our micro-frontends and integrate them. We will see how we can use webpack with different technologies (React, Vue, and Angular).",(0,t.jsx)(n.br,{}),"\n","We will implement the ",(0,t.jsx)(n.code,{children:"runtime integration"})," using frontend technologies. We will create the conceptual foundation which you can later use with any frontend technology."]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},5576:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-1-9fca45ef131be87986cf517b8fd803bc.png"},7683:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-2-9331abe57a5c39b85e6575a245fff31b.png"},2474:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-3-75977f025d822baf99b8d1dfdc4fefcf.png"},9349:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-4-987c72f33f42aa74322bd0ea7f935a9c.png"},6460:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-5-d084a7d0703797f356ce84da36fc93a8.png"},4567:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-6-71a4fcd78df48c1f4047c930ffd1380d.png"},5342:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/network-tab-case-7-db397dad4f7ffbca8e836e2df604c2c2.png"},5710:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>r});var t=i(758);const s={},o=t.createContext(s);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);