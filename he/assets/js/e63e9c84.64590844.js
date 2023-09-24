"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7321],{9613:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>g});var o=a(9496);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,o,r=function(e,t){if(null==e)return{};var a,o,r={},n=Object.keys(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=o.createContext({}),m=function(e){var t=o.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=m(e.components);return o.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},p=o.forwardRef((function(e,t){var a=e.components,r=e.mdxType,n=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=m(a),p=r,g=u["".concat(s,".").concat(p)]||u[p]||d[p]||n;return a?o.createElement(g,l(l({ref:t},c),{},{components:a})):o.createElement(g,l({ref:t},c))}));function g(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=a.length,l=new Array(n);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[u]="string"==typeof e?e:r,l[1]=i;for(var m=2;m<n;m++)l[m]=a[m];return o.createElement.apply(null,l)}return o.createElement.apply(null,a)}p.displayName="MDXCreateElement"},5814:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>d,frontMatter:()=>n,metadata:()=>i,toc:()=>m});var o=a(8957),r=(a(9496),a(9613));const n={sidebar_label:"Git",sidebar_position:3},l="Guide for Git",i={unversionedId:"programming/git",id:"programming/git",title:"Guide for Git",description:"1. Most Used Commands",source:"@site/docs/programming/git.md",sourceDirName:"programming",slug:"/programming/git",permalink:"/guides/he/docs/programming/git",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/programming/git.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_label:"Git",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Design Patterns",permalink:"/guides/he/docs/programming/design-patterns"},next:{title:"New guide",permalink:"/guides/he/docs/programming/new-guide-template"}},s={},m=[{value:"1. Most Used Commands",id:"1-most-used-commands",level:2},{value:"<code>Command 1: Squashing 2 commits into 1 commit</code>",id:"command-1-squashing-2-commits-into-1-commit",level:3},{value:"<code>Command 2: amend wrong message (a typo)</code>",id:"command-2-amend-wrong-message-a-typo",level:3},{value:"<code>Command 3: Branch out from an old commit</code>",id:"command-3-branch-out-from-an-old-commit",level:3},{value:"<code>Command 4: Reset 1 file</code>",id:"command-4-reset-1-file",level:3},{value:"<code>Command 5: Change git user name &amp; email \u2013 Project level</code>",id:"command-5-change-git-user-name--email--project-level",level:3},{value:"<code>Command 6: Upload local git to remote repo</code>",id:"command-6-upload-local-git-to-remote-repo",level:3},{value:"2. All Commands \u2013 The Full List",id:"2-all-commands--the-full-list",level:2},{value:"<code>Command 1: Show status</code>",id:"command-1-show-status",level:3},{value:"<code>Command 2: add all files to staging</code>",id:"command-2-add-all-files-to-staging",level:3},{value:"3. Set User Name &amp; Email on gitconfig",id:"3-set-user-name--email-on-gitconfig",level:2},{value:"<strong>A. Story Time</strong>",id:"a-story-time",level:3},{value:"B. Practical Use",id:"b-practical-use",level:3},{value:"Level 1: Project level",id:"level-1-project-level",level:4},{value:"Level 2: Global level",id:"level-2-global-level",level:4},{value:"Level 3: System level",id:"level-3-system-level",level:4},{value:"4. Upload local git to remote repo",id:"4-upload-local-git-to-remote-repo",level:2},{value:"\u2022 Step 1: Add a remote origin to the local project",id:"-step-1-add-a-remote-origin-to-the-local-project",level:3},{value:"\u2022 Step 2: push your work to remote",id:"-step-2-push-your-work-to-remote",level:3}],c={toc:m},u="wrapper";function d(e){let{components:t,...a}=e;return(0,r.kt)(u,(0,o.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"guide-for-git"},"Guide for Git"),(0,r.kt)("h2",{id:"1-most-used-commands"},"1. Most Used Commands"),(0,r.kt)("h3",{id:"command-1-squashing-2-commits-into-1-commit"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 1: Squashing 2 commits into 1 commit")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git reset HEAD~2\ngit commit -am 'newMessage'\n")),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-2-amend-wrong-message-a-typo"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 2: amend wrong message (a typo)")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git commit --amend -m 'newMessage'\n")),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-3-branch-out-from-an-old-commit"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 3: Branch out from an old commit")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git checkout -B <branch-name> <sha-of-commit>\n# or...\ngit checkout -B <branch-name> HEAD~3\n")),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-4-reset-1-file"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 4: Reset 1 file")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git checkout HEAD -- src/client.js\n")),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-5-change-git-user-name--email--project-level"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 5: Change git user name & email \u2013 Project level")),(0,r.kt)("p",null,"Get email & user in Project level (lvl 1).",(0,r.kt)("br",{parentName:"p"}),"\n","Use this to check who is the current user:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git config --get user.name\ngit config --get user.email\n")),(0,r.kt)("p",null,"Use this to change the values:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'git config user.name "Tal Kohavy"\ngit config user.email talkohavy@gmail.com\nor\u2026\ngit config user.name "Tal Kochavi"\ngit config user.email "tal@seadata.co.il"\n')),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-6-upload-local-git-to-remote-repo"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 6: Upload local git to remote repo")),(0,r.kt)("p",null,"First check that you don't already have a remote origin by:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git config --get remote.origin.url\n")),(0,r.kt)("p",null,"Copy the repository's url, and add it to your remote origin:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git remote add origin yourRemoteUrlHereUsernameIncluded\n")),(0,r.kt)("p",null,"Now push force your code to remote:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git push --force -u origin master\n")),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h2",{id:"2-all-commands--the-full-list"},"2. All Commands \u2013 The Full List"),(0,r.kt)("h3",{id:"command-1-show-status"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 1: Show status")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git status\n")),(0,r.kt)("p",null,"Effect: Tells you: on what branch you are on, new files, modified files, staged & unstaged files."),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h3",{id:"command-2-add-all-files-to-staging"},(0,r.kt)("inlineCode",{parentName:"h3"},"Command 2: add all files to staging")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git add .\n")),(0,r.kt)("p",null,"Effect: adds all modified/new/deleted files into staging."),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("hr",{style:{borderTop:"dashed 1px",backgroundColor:"transparent"}}),(0,r.kt)("h2",{id:"3-set-user-name--email-on-gitconfig"},"3. Set User Name & Email on gitconfig"),(0,r.kt)("h3",{id:"a-story-time"},(0,r.kt)("strong",{parentName:"h3"},"A. Story Time")),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"There are 3 levels of git config:"),"  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"1st priority \u2013 project  "),(0,r.kt)("li",{parentName:"ul"},"2nd priority \u2013 global  "),(0,r.kt)("li",{parentName:"ul"},"3rd priority \u2013 system  ")),(0,r.kt)("p",null,"Question: Why would you care about the gitconfig?",(0,r.kt)("br",{parentName:"p"}),"\n","Answer: When you push to remote repo, you'll see there the details of the user that pushed the work; username, email, image. Now, if that's the case, you don't want to have some default settings making a mess out of things.",(0,r.kt)("br",{parentName:"p"}),"\n","Also, it's important to know that without a user's email you cannot perform commits!",(0,r.kt)("br",{parentName:"p"}),"\n","So in addition to adding a name, you'll also need to add an email.",(0,r.kt)("br",{parentName:"p"}),"\n","When you commit, git's first priority is the Project configs.",(0,r.kt)("br",{parentName:"p"}),"\n","The gitconfig of a project is stored at .git/config of the project's directory.",(0,r.kt)("br",{parentName:"p"}),"\n","The project configs are only available for the current project.",(0,r.kt)("br",{parentName:"p"}),"\n","When you commit, git's second priority is the Global configs.",(0,r.kt)("br",{parentName:"p"}),"\n","The global gitconfig is stored at 'C:\\Users\\tal",".","gitconfig'.",(0,r.kt)("br",{parentName:"p"}),"\n","The global configs are available for all projects of the current user that don't use a config locally inside the project.",(0,r.kt)("br",{parentName:"p"}),"\n","When you commit, git's third priority is the System configs.",(0,r.kt)("br",{parentName:"p"}),"\n","The System gitconfig is stored at '/etc/gitconfig'.",(0,r.kt)("br",{parentName:"p"}),"\n","The System configs are available for all users/projects that don't use a config locally inside the project, nor have a global config.  "),(0,r.kt)("h3",{id:"b-practical-use"},"B. Practical Use"),(0,r.kt)("h4",{id:"level-1-project-level"},"Level 1: Project level"),(0,r.kt)("p",null,"Check what the current values for the user & email:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git config --get user.name\ngit config --get user.email\n")),(0,r.kt)("p",null,"To create a user & email in the project's config use this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'git config user.name "Tal Kohavy"\ngit config user.email "talkohavy@gmail.com"\n')),(0,r.kt)("h4",{id:"level-2-global-level"},"Level 2: Global level"),(0,r.kt)("p",null,"Check what the current values for the user & email:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git config --global --get user.name\ngit config --global --get user.email\n")),(0,r.kt)("p",null,"To create a user & email in the global config use this:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'git config --global user.name "Tal Kohavy"\ngit config --global user.email "talkohavy@gmail.com"\n')),(0,r.kt)("h4",{id:"level-3-system-level"},"Level 3: System level"),(0,r.kt)("p",null,"Check what the current values for the user & email:",(0,r.kt)("br",{parentName:"p"}),"\n","git config --system --get user.name",(0,r.kt)("br",{parentName:"p"}),"\n","git config --system --get user.email",(0,r.kt)("br",{parentName:"p"}),"\n","To create a user & email in the project's config use this:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'git config user.name "Tal Kohavy"\ngit config user.email "talkohavy@gmail.com"\n')),(0,r.kt)("h2",{id:"4-upload-local-git-to-remote-repo"},"4. Upload local git to remote repo"),(0,r.kt)("p",null,"This is for when you have a local git project, and one day you decided to put it out there on a remote repository. Here are the steps to do so:  "),(0,r.kt)("h3",{id:"-step-1-add-a-remote-origin-to-the-local-project"},"\u2022 Step 1: Add a remote origin to the local project"),(0,r.kt)("p",null,"First check that you don't already have a remote origin by:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git config --get remote.origin.url\n")),(0,r.kt)("p",null,"Now, add a remote origin to the local project using this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git remote add origin <url-here>\n")),(0,r.kt)("p",null,"Some Examples:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# - Bitbucket Example:\ngit remote add origin https://talkohavy@bitbucket.org/talkohavy/frontend.git  \n# - GitHub Example:**_  \ngit remote add origin https://github.com/talkohavy/autocomplete.git\n")),(0,r.kt)("p",null,"If you made a typo, use this:  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git remote remove origin// or just do this to overwrite:\ngit remote set-url origin git://new.url.here\n")),(0,r.kt)("p",null,"You'd be asked to put in your remote credentials (meaning, password).  "),(0,r.kt)("h3",{id:"-step-2-push-your-work-to-remote"},"\u2022 Step 2: push your work to remote"),(0,r.kt)("p",null,"The Code:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git push --force -u origin master\n")),(0,r.kt)("admonition",{title:"PLEASE NOTE !",type:"danger"},(0,r.kt)("p",{parentName:"admonition"},"Without the ",(0,r.kt)("inlineCode",{parentName:"p"},"--force")," you'll get an error.")))}d.isMDXComponent=!0}}]);