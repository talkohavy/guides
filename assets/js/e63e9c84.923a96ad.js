"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[4990],{5897:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>t,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var a=o(6070),i=o(5710);const r={},s="Guide for Git",l={id:"programming/git",title:"Guide for Git",description:"1. Path of .gitconfig",source:"@site/docs/programming/git.md",sourceDirName:"programming",slug:"/programming/git",permalink:"/guides/docs/programming/git",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/git.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- ELK Stack",permalink:"/guides/docs/programming/elk"},next:{title:"- Helm",permalink:"/guides/docs/programming/helm"}},t={},c=[{value:"1. Path of .gitconfig",id:"1-path-of-gitconfig",level:2},{value:"2. Most Used Commands",id:"2-most-used-commands",level:2},{value:"<code>Command 1: Squashing 2 commits into 1 commit</code>",id:"command-1-squashing-2-commits-into-1-commit",level:3},{value:"<code>Command 2: amend - wrong message (a typo)</code>",id:"command-2-amend---wrong-message-a-typo",level:3},{value:"<code>Command 3: amend - wrong author</code>",id:"command-3-amend---wrong-author",level:3},{value:"<code>Command 4: amend - wrong author on all commits</code>",id:"command-4-amend---wrong-author-on-all-commits",level:3},{value:"<code>Command 5: Branch out from an old commit</code>",id:"command-5-branch-out-from-an-old-commit",level:3},{value:"<code>Command 6: Reset 1 file</code>",id:"command-6-reset-1-file",level:3},{value:"<code>Command 7: Change git user name &amp; email \u2013 Project level</code>",id:"command-7-change-git-user-name--email--project-level",level:3},{value:"<code>Command 8: Upload local git to remote repo</code>",id:"command-8-upload-local-git-to-remote-repo",level:3},{value:"<code>Command 9: Delete a local branch</code>",id:"command-9-delete-a-local-branch",level:3},{value:"<code>Command 10: Rename a local branch</code>",id:"command-10-rename-a-local-branch",level:3},{value:"<code>Command 11: Rename a remote branch</code>",id:"command-11-rename-a-remote-branch",level:3},{value:"<code>Command 11: create an alias for a git command</code>",id:"command-11-create-an-alias-for-a-git-command",level:3},{value:"<code>Command 10: clean reset for all changes</code>",id:"command-10-clean-reset-for-all-changes",level:3},{value:"3. git-split-diffs",id:"3-git-split-diffs",level:2},{value:"4. How to set User &amp; Email on git config",id:"4-how-to-set-user--email-on-git-config",level:2},{value:"5. Upload a local git repo to a remote repo",id:"5-upload-a-local-git-repo-to-a-remote-repo",level:2},{value:"- Step 1: Create a remote repo on some git providers",id:"--step-1-create-a-remote-repo-on-some-git-providers",level:3},{value:"- Step 2: Add a remote origin to the local project",id:"--step-2-add-a-remote-origin-to-the-local-project",level:3},{value:"- Step 3: push your work to remote",id:"--step-3-push-your-work-to-remote",level:3}];function d(e){const n={admonition:"admonition",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"guide-for-git",children:"Guide for Git"}),"\n",(0,a.jsx)(n.h2,{id:"1-path-of-gitconfig",children:"1. Path of .gitconfig"}),"\n",(0,a.jsxs)(n.p,{children:["There are 3 Levels of ",(0,a.jsx)(n.code,{children:".gitconfig"}),": ",(0,a.jsx)(n.code,{children:"project"}),", ",(0,a.jsx)(n.code,{children:"global"})," & ",(0,a.jsx)(n.code,{children:"system"}),".",(0,a.jsx)(n.br,{}),"\n","The .gitconfig, on all operating machines, is found at:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"# - Project Level\ncode .git/config\n\n# - Global Level\ncode ~/.gitconfig\n\n# - System Level (What about windows?)\ncode /etc/gitconfig\n"})}),"\n",(0,a.jsxs)(n.p,{children:["I always use the gitconfig in the ",(0,a.jsx)(n.code,{children:"global"})," level.",(0,a.jsx)(n.br,{}),"\n",'That\'s where I usually put my "globally" configs.',(0,a.jsx)(n.br,{}),"\n","So like ",(0,a.jsx)(n.code,{children:"user.name"}),", ",(0,a.jsx)(n.code,{children:"user.email"}),", all of my ",(0,a.jsx)(n.code,{children:"aliases"}),", the ",(0,a.jsx)(n.code,{children:"git-split-diffs"}),", etc."]}),"\n",(0,a.jsx)(n.p,{children:"As of today, here's how my .gitconfig looks:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"[alias]\n\tlogs = log --graph --oneline --decorate\n\tdf = diff HEAD\n\tck = checkout\n\tpop = stash pop\n\tapply = stash apply\n\tname = rev-parse --abbrev-ref HEAD\n\tunstage = restore --staged .\n\ts = status\n\tcomit = commit\n\tamend = commit --amend --no-edit\n[user]\n\tname = Tal Kohavy\n\temail = talkohavy@gmail.com\n[core]\n\tpager = git-split-diffs --color | less -RF\n"})}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"2-most-used-commands",children:"2. Most Used Commands"}),"\n",(0,a.jsx)(n.h3,{id:"command-1-squashing-2-commits-into-1-commit",children:(0,a.jsx)(n.code,{children:"Command 1: Squashing 2 commits into 1 commit"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git reset HEAD~2\ngit commit -am 'newMessage'\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-2-amend---wrong-message-a-typo",children:(0,a.jsx)(n.code,{children:"Command 2: amend - wrong message (a typo)"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git commit --amend -m 'newMessage'\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-3-amend---wrong-author",children:(0,a.jsx)(n.code,{children:"Command 3: amend - wrong author"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git commit --amend --author "Tal Kohavy <talkohavy@gmail.com>"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"command-4-amend---wrong-author-on-all-commits",children:(0,a.jsx)(n.code,{children:"Command 4: amend - wrong author on all commits"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git filter-branch --env-filter \'\nOLD_EMAIL="wrong@mail.com"\nNEW_EMAIL="talkohavy@gmail.com"\nif [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]\nthen\n    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"\nfi\nif [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]\nthen\n    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"\nfi\n\' --tag-name-filter cat -- --branches --tags\n'})}),"\n",(0,a.jsx)(n.h3,{id:"command-5-branch-out-from-an-old-commit",children:(0,a.jsx)(n.code,{children:"Command 5: Branch out from an old commit"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git checkout -B <branch-name> <sha-of-commit>\n# or...\ngit checkout -B <branch-name> HEAD~3\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-6-reset-1-file",children:(0,a.jsx)(n.code,{children:"Command 6: Reset 1 file"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git checkout HEAD -- src/client.js\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-7-change-git-user-name--email--project-level",children:(0,a.jsx)(n.code,{children:"Command 7: Change git user name & email \u2013 Project level"})}),"\n",(0,a.jsxs)(n.p,{children:["Get email & user in Project level (lvl 1).",(0,a.jsx)(n.br,{}),"\n","Use this to check who is the current user:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git config --get user.name\ngit config --get user.email\n"})}),"\n",(0,a.jsx)(n.p,{children:"Use this to change the values:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git config user.name "Tal Kohavy"\ngit config user.email talkohavy@gmail.com\nor\u2026\ngit config user.name "Tal Kochavi"\ngit config user.email "tal@seadata.co.il"\n'})}),"\n",(0,a.jsx)(n.h3,{id:"command-8-upload-local-git-to-remote-repo",children:(0,a.jsx)(n.code,{children:"Command 8: Upload local git to remote repo"})}),"\n",(0,a.jsx)(n.p,{children:"First check that you don't already have a remote origin by:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git config --get remote.origin.url\n"})}),"\n",(0,a.jsx)(n.p,{children:"Copy the repository's url, and add it to your remote origin:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git remote add origin yourRemoteUrlHereUsernameIncluded\n"})}),"\n",(0,a.jsx)(n.p,{children:"Now push force your code to remote:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git push --force -u origin master\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-9-delete-a-local-branch",children:(0,a.jsx)(n.code,{children:"Command 9: Delete a local branch"})}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git branch --delete NAME_OF_BRANCH\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"caution",children:(0,a.jsxs)(n.p,{children:["You ",(0,a.jsx)(n.strong,{children:"can't"})," delete the branch on which you're current standing on!",(0,a.jsx)(n.br,{}),"\n","Check out from it if necessary."]})}),"\n",(0,a.jsx)(n.h3,{id:"command-10-rename-a-local-branch",children:(0,a.jsx)(n.code,{children:"Command 10: Rename a local branch"})}),"\n",(0,a.jsx)(n.p,{children:"Renaming a local branch is easy:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-11-rename-a-remote-branch",children:(0,a.jsx)(n.code,{children:"Command 11: Rename a remote branch"})}),"\n",(0,a.jsxs)(n.p,{children:["Renaming a remote branch is actually a 2-step process. While you ",(0,a.jsx)(n.em,{children:"can"})," actually rename a remote branch using Github Browser in a 1-step, this is probably not what you want. Because, here is what I'm assuming that happened:"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"You gave a wrong name to a local branch"}),"\n",(0,a.jsx)(n.li,{children:"You pushed that branch with the wrong name to the remote\nThat's the most common scenario."}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"So, first you need to rename the local branch, then delete the remote branch, and then push the newly-named local branch to the remote."}),"\n",(0,a.jsx)(n.p,{children:"Step 1: rename the local branch"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git branch -m OLD_BRANCH_NAME NEW_BRANCH_NAME\n"})}),"\n",(0,a.jsx)(n.p,{children:"Step 2: delete the remote branch"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git push origin :OLD_BRANCH_NAME\n"})}),"\n",(0,a.jsx)(n.p,{children:"Step 3: push the newly-named branch to the remote branch"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git push origin NEW_BRANCH_NAME\n"})}),"\n",(0,a.jsx)(n.h3,{id:"command-11-create-an-alias-for-a-git-command",children:(0,a.jsx)(n.code,{children:"Command 11: create an alias for a git command"})}),"\n",(0,a.jsx)(n.p,{children:"Here are my personal favorites:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git config --global alias.logs "log --graph --oneline --decorate"\ngit logs\n\ngit config --global alias.df "diff HEAD"\ngit df\n\ngit config --global alias.ck "checkout"\ngit ck\n\ngit config --global alias.pop "stash pop"\ngit pop\n\ngit config --global alias.pop "stash apply"\ngit apply\n\ngit config --global alias.name "rev-parse --abbrev-ref HEAD"\ngit name\n\ngit config --global alias.unstage "restore --staged ."\ngit unstage\n'})}),"\n",(0,a.jsx)(n.h3,{id:"command-10-clean-reset-for-all-changes",children:(0,a.jsx)(n.code,{children:"Command 10: clean reset for all changes"})}),"\n",(0,a.jsx)(n.p,{children:"The best way to reset all changes is:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git clean -df\n"})}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"3-git-split-diffs",children:"3. git-split-diffs"}),"\n",(0,a.jsx)(n.p,{children:"Get the the most powerful syntax highlighting git-diff in your terminal.\nIt is GitHub style, with split view (side by side)."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'npm install -g git-split-diffs\n\ngit config --global core.pager "git-split-diffs --color | less -RFX"\n'})}),"\n",(0,a.jsx)(n.p,{children:"Enable scrolling in the terminal:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git config --global core.pager "git-split-diffs --color | less -+LFX"\n'})}),"\n",(0,a.jsx)(n.p,{children:"Narrow terminals:"}),"\n",(0,a.jsxs)(n.p,{children:["Split diffs can be hard to read on narrow terminals, so we revert to unified diffs if we cannot fit two lines of ",(0,a.jsx)(n.code,{children:"min-line-width"})," on screen. This value is configurable:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git config --global split-diffs.min-line-width 40\n"})}),"\n",(0,a.jsxs)(n.p,{children:["This defaults to ",(0,a.jsx)(n.code,{children:"80"}),", so screens below ",(0,a.jsx)(n.code,{children:"160"})," characters will display unified diffs. Set it to ",(0,a.jsx)(n.code,{children:"0"})," to always show split diffs."]}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"4-how-to-set-user--email-on-git-config",children:"4. How to set User & Email on git config"}),"\n",(0,a.jsx)(n.p,{children:"In order to check what your current email & username are use:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"# - Level 1: Project Level\ngit config --get user.name\ngit config --get user.email\n\n# - Level 2: Global Level\ngit config --global --get user.name\ngit config --global --get user.email\n\n# - Level 3: System Level\ngit config --system --get user.name\ngit config --system --get user.email\n"})}),"\n",(0,a.jsx)(n.p,{children:"In order to set new values use:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'# - Level 1: Project Level\ngit config user.name "Tal Kohavy"\ngit config user.email "talkohavy@gmail.com"\n\n# - Level 2: Global Level\ngit config --global user.name "Tal Kohavy"\ngit config --global user.email "talkohavy@gmail.com"\n\n# - Level 3: System Level\ngit config --system user.name "Tal Kohavy"\ngit config --system user.email "talkohavy@gmail.com"\n'})}),"\n",(0,a.jsx)(n.p,{children:"Why would you care about the user & email?"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Without a user & an email you cannot perform commits!"})}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"5-upload-a-local-git-repo-to-a-remote-repo",children:"5. Upload a local git repo to a remote repo"}),"\n",(0,a.jsx)(n.p,{children:"Follow these 3 simple steps:"}),"\n",(0,a.jsx)(n.h3,{id:"--step-1-create-a-remote-repo-on-some-git-providers",children:"- Step 1: Create a remote repo on some git providers"}),"\n",(0,a.jsxs)(n.p,{children:["Choose either Github or Bitbucket or whatever, and create a remote git repo.",(0,a.jsx)(n.br,{}),"\n","Get the ",(0,a.jsx)(n.strong,{children:"URL"}),"!"]}),"\n",(0,a.jsx)(n.h3,{id:"--step-2-add-a-remote-origin-to-the-local-project",children:"- Step 2: Add a remote origin to the local project"}),"\n",(0,a.jsxs)(n.p,{children:["Now, we need to add a ",(0,a.jsx)(n.code,{children:"remote"})," repository to our local project.",(0,a.jsx)(n.br,{}),"\n","The remote repository is represented by ",(0,a.jsx)(n.code,{children:"name"})," and a ",(0,a.jsx)(n.code,{children:"url"}),".",(0,a.jsx)(n.br,{}),"\n","When you do a git push, the default name taken is ",(0,a.jsx)(n.code,{children:"origin"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["Use this command to add a new remote repository url named ",(0,a.jsx)(n.code,{children:"origin"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git remote add origin PASTE_URL_HERE\n"})}),"\n",(0,a.jsx)(n.p,{children:"Check that it's been added successfully using:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git config --get remote.origin.url\n"})}),"\n",(0,a.jsx)(n.p,{children:"To watch all remote urls that are defined on a project use:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git remote -v\n"})}),"\n",(0,a.jsx)(n.p,{children:"To remove a remote repository you need to provide its name:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git remote rm origin\n# Or...\ngit remote remove origin\n"})}),"\n",(0,a.jsxs)(n.p,{children:["They are the same command! ",(0,a.jsx)(n.em,{children:"rm"})," is short for ",(0,a.jsx)(n.em,{children:"remove"}),"."]}),"\n",(0,a.jsxs)(n.p,{children:["The ",(0,a.jsx)(n.code,{children:"remote"})," sub-command has 3 useful sub-commands:"]}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.code,{children:"add"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.code,{children:"remove"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.code,{children:"set-url"})}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["We've already seen the ",(0,a.jsx)(n.code,{children:"add"})," and ",(0,a.jsx)(n.code,{children:"remove"}),".",(0,a.jsx)(n.br,{}),"\n","But there's also ",(0,a.jsx)(n.code,{children:"set-url"}),"."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git remote set-url origin git://new.url.here\n"})}),"\n",(0,a.jsxs)(n.p,{children:["With ",(0,a.jsx)(n.code,{children:"set-url"})," you can edit just the ",(0,a.jsx)(n.code,{children:"url"})," part of the remote repo.",(0,a.jsx)(n.br,{}),"\n","It's useful in cases you made a typo."]}),"\n",(0,a.jsx)(n.h3,{id:"--step-3-push-your-work-to-remote",children:"- Step 3: push your work to remote"}),"\n",(0,a.jsx)(n.p,{children:"Run this code:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"git push --force -u origin master\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"caution",children:(0,a.jsx)(n.p,{children:"Note! Without the force you'll get an error!"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},5710:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>l});var a=o(758);const i={},r=a.createContext(i);function s(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);