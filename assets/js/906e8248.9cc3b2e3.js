"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[7760],{4311:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>t,metadata:()=>a,toc:()=>c});var o=i(1527),r=i(7252);const t={sidebar_label:"11. Configuration Server",sidebar_position:9},s="Guide For Spring Boot Configuration Server",a={id:"programming/spring-boot-configuration-server",title:"Guide For Spring Boot Configuration Server",description:"1. Goals",source:"@site/docs/programming/spring-boot-configuration-server.md",sourceDirName:"programming",slug:"/programming/spring-boot-configuration-server",permalink:"/guides/docs/programming/spring-boot-configuration-server",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/spring-boot-configuration-server.md",tags:[],version:"current",sidebarPosition:9,frontMatter:{sidebar_label:"11. Configuration Server",sidebar_position:9},sidebar:"tutorialSidebar",previous:{title:"10. Kubernetes",permalink:"/guides/docs/programming/kubernetes"},next:{title:"12. Regex",permalink:"/guides/docs/programming/regex"}},l={},c=[{value:"1. Goals",id:"1-goals",level:2},{value:"999. Spring Cloud Configuration Server",id:"999-spring-cloud-configuration-server",level:2},{value:"- Version History",id:"--version-history",level:3},{value:"- Getting Started",id:"--getting-started",level:3},{value:"- Spring Cloud Config Client",id:"--spring-cloud-config-client",level:3}];function h(e){const n={a:"a",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"guide-for-spring-boot-configuration-server",children:"Guide For Spring Boot Configuration Server"}),"\n",(0,o.jsx)(n.h2,{id:"1-goals",children:"1. Goals"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Externalized"}),"\n",(0,o.jsx)(n.li,{children:"Environment specific"}),"\n",(0,o.jsx)(n.li,{children:"Consistent"}),"\n",(0,o.jsx)(n.li,{children:"Version history"}),"\n",(0,o.jsx)(n.li,{children:"Real-time management"}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"999-spring-cloud-configuration-server",children:"999. Spring Cloud Configuration Server"}),"\n",(0,o.jsx)(n.p,{children:"In this section we will learn about the Spring Cloud Configuration Server, see what it is, what's the model that it operates on, and why you should be using it for micro-services."}),"\n",(0,o.jsx)(n.p,{children:"So we've looked at property files and profiles, and all those sorts of things, which let you configure your spring boot application, which is great for configuring single applications, but now let's move our focus from single services to multiple micro-services which run together."}),"\n",(0,o.jsx)(n.p,{children:"So far, the goals we have achieved are:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\u2705 Externalized (using property files)"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Environment specific (using spring profiles)"}),"\n",(0,o.jsx)(n.li,{children:"\u274c Consistent ()"}),"\n",(0,o.jsx)(n.li,{children:"\u274c Version history"}),"\n",(0,o.jsx)(n.li,{children:"\u274c Real-time management"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Consistency is super important in configuration. And even more so in the context of micro-services. Why more? because there's more of them! A whole lot of services running together. You need to make sure that they're all referring to the same configuration values. We want all of them refer to a consistent and reliable configuration values. Now, how do we do that? We certainly can't achieve that by having each micro-service holding its own configuration. So, the obvious answer is... take that out, and create a separate configuration service! Have all this services talk to a separate configuration service, have that be the single source of truth and have that manage all the information."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.strong,{children:"Config as a micro-service"})}),"\n",(0,o.jsx)(n.p,{children:'This is a common pattern where you essentially have one service which is responsible for providing your configuration, and all the other micro-services just go ask that one particular service "hey, what\'s the value of this and that?" and then it provides the service.'}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.strong,{children:"When"})," part, of ",(0,o.jsx)(n.em,{children:"when"})," it asks for the value, can depend. It can be when the application starts up, but that's a different issue falling under the category of ",(0,o.jsx)(n.em,{children:"real-time updates"}),"! Real-time updates is a different issue. But at least? it is consistent. There is one source which provides that information. So that why a config server is very popular."]}),"\n",(0,o.jsx)(n.p,{children:"Options for Configuration Server. You have:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Apache Zookeeper"}),"\n",(0,o.jsx)(n.li,{children:"ETCD - distributed key-value store"}),"\n",(0,o.jsx)(n.li,{children:"Hashicorp Consul"}),"\n",(0,o.jsx)(n.li,{children:"Spring Cloud Configuration Server"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Apache Zookeeper is a very popular solution. It's a centralized service for maintaining this configuration information. It also does a lot more! It provides distributed synchronization, it provides naming services, and a whole lot more. Zookeeper is a popular choice for saving this information. You have a zookeeper instance running and all these different services go ask zookeeper for a specific value for a key."}),"\n",(0,o.jsx)(n.p,{children:"ETCD is another distributed key-value store."}),"\n",(0,o.jsx)(n.p,{children:"Hashicorp consul is another popular solution which is based off of a data source."}),"\n",(0,o.jsx)(n.p,{children:"Spring Cloud Configuration Server is the most popular one, specifically in the context of Spring Boot and Spring Cloud, which is what we're going to build throughout this guide."}),"\n",(0,o.jsx)(n.h3,{id:"--version-history",children:"- Version History"}),"\n",(0,o.jsxs)(n.p,{children:["Spring Cloud config server can connect to various different data sources, but there is one data source which is ",(0,o.jsx)(n.em,{children:"extremely"})," popular. Remember we talked about version controlled config, right? What is a popular solution for version control store? A git repo! Spring Cloud config server can actually directly connect with a git repo that's hosted somewhere online, either Github, Bitbucket, GitLab, you name it, and so it can directly look up the values of properties on files inside of a git repo which is online. Isn't that cool?"]}),"\n",(0,o.jsx)(n.p,{children:"What is the benefit of doing that?"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Skipping the build process"}),"\n",(0,o.jsx)(n.li,{children:"Simply push new configuration to your git repo"}),"\n",(0,o.jsx)(n.li,{children:"Get version control free out-of-the-box"}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"--getting-started",children:"- Getting Started"}),"\n",(0,o.jsxs)(n.p,{children:["Go to ",(0,o.jsx)(n.a,{href:"https://start.spring.io/",children:"start.spring.io"}),", and choose Maven, Java, name your artifact as ",(0,o.jsx)(n.code,{children:"spring-cloud-config-server"}),", and in the dependencies search for ",(0,o.jsx)(n.code,{children:"cloud-config"})," as your one dependency. Download the project files and open them in your IDE."]}),"\n",(0,o.jsx)(n.p,{children:"In the project you downloaded, you should see a file:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-java",metastring:'title="./src/main/java/SpringCloudConfigServerApplication.java"',children:"package luckylove.springcloudconfigserver;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class SpringCloudConfigServerApplication {\n\n\tpublic static void main(String[] args) {\n\t\tSpringApplication.run(SpringCloudConfigServerApplication.class, args);\n\t}\n}\n"})}),"\n",(0,o.jsx)(n.p,{children:"In this one file you're going to add annotation to the class:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-java",metastring:'title="./src/main/java/SpringCloudConfigServerApplication.java"',children:"package luckylove.springcloudconfigserver;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.cloud.config.server.EnableConfigServer; // <--- this one\n\n@SpringBootApplication\n@EnableConfigServer // <--- and this one\npublic class SpringCloudConfigServerApplication {\n\n\tpublic static void main(String[] args) {\n\t\tSpringApplication.run(SpringCloudConfigServerApplication.class, args);\n\t}\n}\n"})}),"\n",(0,o.jsxs)(n.p,{children:["The server is good to go, except... it doesn't know where to pull up the values from. We need to set up the connection with our remote git repo. Open up the file ",(0,o.jsx)(n.code,{children:"application.properties"}),", and change its extension to ",(0,o.jsx)(n.code,{children:".yaml"}),". Then, fill it like so:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"server:\n  port: 8888\nspring:\n  cloud:\n    config:\n      server:\n        git:\n          uri: git@github.com:talkohavy/luckylove-configuration-server.git\n          ignoreLocalSshSettings: true\n          privateKey: |\n            -----BEGIN OPENSSH PRIVATE KEY-----\n            ...\n            gXA6iFIAq32zE4THCZGCqTU7D1iALGDsbgj\n            ...\n            -----END OPENSSH PRIVATE KEY-----\n"})}),"\n",(0,o.jsx)(n.p,{children:"Now we can start our server! Let's run it:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"mvn spring-boot:run\n"})}),"\n",(0,o.jsxs)(n.p,{children:["And you should see it running successfully.",(0,o.jsx)(n.br,{}),"\n","But how do we grab our configurations? What is the url path?"]}),"\n",(0,o.jsx)(n.p,{children:"The URL format for fetching a configuration is the following rule:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"http://localhost:<PORT>/<filename>/<profile>\n"})}),"\n",(0,o.jsxs)(n.p,{children:["For example: ",(0,o.jsx)(n.code,{children:"http://localhost:8888/application/default"})]}),"\n",(0,o.jsxs)(n.p,{children:["Now, the next step is have all your different micro-services consume this configuration from the spring cloud config server. That's what we're going to do in the next section by creating a ",(0,o.jsx)(n.strong,{children:"Spring Cloud Config Client"}),"."]}),"\n",(0,o.jsx)(n.h3,{id:"--spring-cloud-config-client",children:"- Spring Cloud Config Client"}),"\n",(0,o.jsx)(n.p,{children:"In this section we're gonna create a Spring Cloud configuration client."}),"\n",(0,o.jsxs)(n.p,{children:["So basically what we need to do now is have a micro-service connect to a spring cloud config server, and get the configuration from there, rather than from the traditional way of having a ",(0,o.jsx)(n.code,{children:".env"})," file."]})]})}function d(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},7252:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>s});var o=i(959);const r={},t=o.createContext(r);function s(e){const n=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(t.Provider,{value:n},e.children)}}}]);