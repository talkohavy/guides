"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7321],{4101:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>m,frontMatter:()=>s,metadata:()=>l,toc:()=>r});var i=a(5893),o=a(1151);const s={sidebar_label:"Git",sidebar_position:3},t="Guide for Git",l={id:"programming/git",title:"Guide for Git",description:"1. Path of .gitconfig",source:"@site/docs/programming/git.md",sourceDirName:"programming",slug:"/programming/git",permalink:"/guides/he/docs/programming/git",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/git.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_label:"Git",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Design Patterns",permalink:"/guides/he/docs/programming/design-patterns"},next:{title:"Redux",permalink:"/guides/he/docs/programming/redux"}},c={},r=[{value:"1. Path of .gitconfig",id:"1-path-of-gitconfig",level:2},{value:"2. Most Used Commands",id:"2-most-used-commands",level:2},{value:"<code>Command 1: Squashing 2 commits into 1 commit</code>",id:"command-1-squashing-2-commits-into-1-commit",level:3},{value:"<code>Command 2: amend - wrong message (a typo)</code>",id:"command-2-amend---wrong-message-a-typo",level:3},{value:"<code>Command 3: amend - wrong author</code>",id:"command-3-amend---wrong-author",level:3},{value:"<code>Command 4: Branch out from an old commit</code>",id:"command-4-branch-out-from-an-old-commit",level:3},{value:"<code>Command 5: Reset 1 file</code>",id:"command-5-reset-1-file",level:3},{value:"<code>Command 6: Change git user name &amp; email \u2013 Project level</code>",id:"command-6-change-git-user-name--email--project-level",level:3},{value:"<code>Command 7: Upload local git to remote repo</code>",id:"command-7-upload-local-git-to-remote-repo",level:3},{value:"<code>Command 8: Delete a local branch</code>",id:"command-8-delete-a-local-branch",level:3},{value:"<code>Command 9: create an alias for a git command</code>",id:"command-9-create-an-alias-for-a-git-command",level:3},{value:"<code>Command 10: clean reset for all changes</code>",id:"command-10-clean-reset-for-all-changes",level:3},{value:"3. git-split-diffs",id:"3-git-split-diffs",level:2}];function d(e){const n={admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",strong:"strong",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"guide-for-git",children:"Guide for Git"}),"\n",(0,i.jsx)(n.h2,{id:"1-path-of-gitconfig",children:"1. Path of .gitconfig"}),"\n",(0,i.jsx)(n.p,{children:"The gitconfig, on all operating machines, is found at:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"code ~/.gitconfig\n"})}),"\n",(0,i.jsx)(n.p,{children:"As of today, here's how my .gitconfig looks:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"[alias]\n\tlogs = log --graph --oneline --decorate\n\tdf = diff HEAD\n\tck = checkout\n\tpop = stash pop\n\tapply = stash apply\n\tname = rev-parse --abbrev-ref HEAD\n\tunstage = restore --staged .\n\ts = status\n\tcomit = commit\n[user]\n\tname = Tal Kohavy\n\temail = talkohavy@gmail.com\n[core]\n\tpager = git-split-diffs --color | less -RF\n"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"2-most-used-commands",children:"2. Most Used Commands"}),"\n",(0,i.jsx)(n.h3,{id:"command-1-squashing-2-commits-into-1-commit",children:(0,i.jsx)(n.code,{children:"Command 1: Squashing 2 commits into 1 commit"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git reset HEAD~2\ngit commit -am 'newMessage'\n"})}),"\n",(0,i.jsx)(n.h3,{id:"command-2-amend---wrong-message-a-typo",children:(0,i.jsx)(n.code,{children:"Command 2: amend - wrong message (a typo)"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git commit --amend -m 'newMessage'\n"})}),"\n",(0,i.jsx)(n.h3,{id:"command-3-amend---wrong-author",children:(0,i.jsx)(n.code,{children:"Command 3: amend - wrong author"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'git commit --amend --author "Tal Kohavy <talkohavy@gmail.com>"\n'})}),"\n",(0,i.jsx)(n.h3,{id:"command-4-branch-out-from-an-old-commit",children:(0,i.jsx)(n.code,{children:"Command 4: Branch out from an old commit"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git checkout -B <branch-name> <sha-of-commit>\n# or...\ngit checkout -B <branch-name> HEAD~3\n"})}),"\n",(0,i.jsx)(n.h3,{id:"command-5-reset-1-file",children:(0,i.jsx)(n.code,{children:"Command 5: Reset 1 file"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git checkout HEAD -- src/client.js\n"})}),"\n",(0,i.jsx)(n.h3,{id:"command-6-change-git-user-name--email--project-level",children:(0,i.jsx)(n.code,{children:"Command 6: Change git user name & email \u2013 Project level"})}),"\n",(0,i.jsxs)(n.p,{children:["Get email & user in Project level (lvl 1).",(0,i.jsx)(n.br,{}),"\n","Use this to check who is the current user:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git config --get user.name\ngit config --get user.email\n"})}),"\n",(0,i.jsx)(n.p,{children:"Use this to change the values:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'git config user.name "Tal Kohavy"\ngit config user.email talkohavy@gmail.com\nor\u2026\ngit config user.name "Tal Kochavi"\ngit config user.email "tal@seadata.co.il"\n'})}),"\n",(0,i.jsx)(n.h3,{id:"command-7-upload-local-git-to-remote-repo",children:(0,i.jsx)(n.code,{children:"Command 7: Upload local git to remote repo"})}),"\n",(0,i.jsx)(n.p,{children:"First check that you don't already have a remote origin by:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git config --get remote.origin.url\n"})}),"\n",(0,i.jsx)(n.p,{children:"Copy the repository's url, and add it to your remote origin:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git remote add origin yourRemoteUrlHereUsernameIncluded\n"})}),"\n",(0,i.jsx)(n.p,{children:"Now push force your code to remote:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git push --force -u origin master\n"})}),"\n",(0,i.jsx)(n.h3,{id:"command-8-delete-a-local-branch",children:(0,i.jsx)(n.code,{children:"Command 8: Delete a local branch"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'git branch --delete "name-of-branch"\n'})}),"\n",(0,i.jsx)(n.admonition,{type:"caution",children:(0,i.jsxs)(n.p,{children:["You ",(0,i.jsx)(n.strong,{children:"can't"})," delete the branch on which you're current standing on!",(0,i.jsx)(n.br,{}),"\n","Check out from it if necessary."]})}),"\n",(0,i.jsx)(n.h3,{id:"command-9-create-an-alias-for-a-git-command",children:(0,i.jsx)(n.code,{children:"Command 9: create an alias for a git command"})}),"\n",(0,i.jsx)(n.p,{children:"Here are my personal favorites:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'git config --global alias.logs "log --graph --oneline --decorate"\ngit logs\n\ngit config --global alias.df "diff HEAD"\ngit df\n\ngit config --global alias.ck "checkout"\ngit ck\n\ngit config --global alias.pop "stash pop"\ngit pop\n\ngit config --global alias.pop "stash apply"\ngit apply\n\ngit config --global alias.name "rev-parse --abbrev-ref HEAD"\ngit name\n\ngit config --global alias.unstage "restore --staged ."\ngit unstage\n'})}),"\n",(0,i.jsx)(n.h3,{id:"command-10-clean-reset-for-all-changes",children:(0,i.jsx)(n.code,{children:"Command 10: clean reset for all changes"})}),"\n",(0,i.jsx)(n.p,{children:"The best way to reset all changes is:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git clean -df\n"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"3-git-split-diffs",children:"3. git-split-diffs"}),"\n",(0,i.jsx)(n.p,{children:"Get the the most powerful syntax highlighting git-diff in your terminal.\nIt is GitHub style, with split view (side by side)."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'npm install -g git-split-diffs\n\ngit config --global core.pager "git-split-diffs --color | less -RFX"\n'})}),"\n",(0,i.jsx)(n.p,{children:"Enable scrolling in the terminal:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'git config --global core.pager "git-split-diffs --color | less -+LFX"\n'})}),"\n",(0,i.jsx)(n.p,{children:"Narrow terminals:"}),"\n",(0,i.jsxs)(n.p,{children:["Split diffs can be hard to read on narrow terminals, so we revert to unified diffs if we cannot fit two lines of ",(0,i.jsx)(n.code,{children:"min-line-width"})," on screen. This value is configurable:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git config split-diffs.min-line-width 40\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This defaults to ",(0,i.jsx)(n.code,{children:"80"}),", so screens below ",(0,i.jsx)(n.code,{children:"160"})," characters will display unified diffs. Set it to ",(0,i.jsx)(n.code,{children:"0"})," to always show split diffs."]})]})}function m(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},1151:(e,n,a)=>{a.d(n,{Z:()=>l,a:()=>t});var i=a(7294);const o={},s=i.createContext(o);function t(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);