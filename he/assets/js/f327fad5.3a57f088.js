"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[9293],{7697:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>t,default:()=>h,frontMatter:()=>a,metadata:()=>d,toc:()=>i});var r=n(6070),l=n(5710);const a={},t="Guide For Postgres SQL",d={id:"programming/postgres-sql",title:"Guide For Postgres SQL",description:"1. Getting Started",source:"@site/docs/programming/postgres-sql.md",sourceDirName:"programming",slug:"/programming/postgres-sql",permalink:"/guides/he/docs/programming/postgres-sql",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/postgres-sql.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- npm publish a package",permalink:"/guides/he/docs/programming/npm"},next:{title:"- Regex",permalink:"/guides/he/docs/programming/regex"}},o={},i=[{value:"1. Getting Started",id:"1-getting-started",level:2},{value:"2. Commands",id:"2-commands",level:2},{value:"- 1. psql",id:"--1-psql",level:3},{value:"- 2. \\list",id:"--2-list",level:3},{value:"- 3. \\q",id:"--3-q",level:3},{value:"- 4. \\du",id:"--4-du",level:3},{value:"- 5. \\password",id:"--5-password",level:3},{value:"- 6. \\dt",id:"--6-dt",level:3},{value:"- 7 \\c",id:"--7-c",level:3}];function c(e){const s={br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",pre:"pre",strong:"strong",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.header,{children:(0,r.jsx)(s.h1,{id:"guide-for-postgres-sql",children:"Guide For Postgres SQL"})}),"\n",(0,r.jsx)(s.h2,{id:"1-getting-started",children:"1. Getting Started"}),"\n",(0,r.jsx)(s.p,{children:"Installing postgresql on macOS (using Homebrew):"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"brew install postgresql\n"})}),"\n",(0,r.jsx)(s.p,{children:"Then start the service:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"brew services start postgresql\n"})}),"\n",(0,r.jsxs)(s.p,{children:["The next command should ",(0,r.jsx)(s.strong,{children:"fail"})," for you:"]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"psql\n"})}),"\n",(0,r.jsx)(s.p,{children:"by saying something like:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{children:'psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  database "talkohavy" does not exist\n'})}),"\n",(0,r.jsxs)(s.p,{children:["That's because installing ",(0,r.jsx)(s.code,{children:"postgresql"})," using brew creates a database named ",(0,r.jsx)(s.code,{children:"postgres"}),".\nNow, try running:"]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"psql postgres\n"})}),"\n",(0,r.jsxs)(s.p,{children:["and you'll be logged in! \ud83d\ude42",(0,r.jsx)(s.br,{}),"\n","You'll see something like:"]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{children:'psql (14.13 (Homebrew))\nType "help" for help.\n\npostgres=#\n'})}),"\n",(0,r.jsx)(s.p,{children:"Let's list all the available databases to prove postgres is one of them:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\list\n"})}),"\n",(0,r.jsx)(s.p,{children:"or:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\l\n"})}),"\n",(0,r.jsx)(s.p,{children:"for short."}),"\n",(0,r.jsx)(s.p,{children:"You should see something like:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{children:"                              List of databases\n   Name    |   Owner   | Encoding | Collate | Ctype |    Access privileges\n-----------+-----------+----------+---------+-------+-------------------------\n postgres  | talkohavy | UTF8     | C       | C     |\n template0 | talkohavy | UTF8     | C       | C     | =c/talkohavy           +\n           |           |          |         |       | talkohavy=CTc/talkohavy\n template1 | talkohavy | UTF8     | C       | C     | =c/talkohavy           +\n           |           |          |         |       | talkohavy=CTc/talkohavy\n(3 rows)\n"})}),"\n",(0,r.jsx)(s.p,{children:"Let's create a database for your machine name:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"CREATE DATABASE talkohavy;\n"})}),"\n",(0,r.jsx)(s.p,{children:"List out your databases again to see that it was actually created:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\list\n"})}),"\n",(0,r.jsx)(s.p,{children:"Now, you should be able to connect to your newly created aaa database with:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"psql talkohavy\n"})}),"\n",(0,r.jsxs)(s.p,{children:["if the name of your new database is similar to your username, then you can simply type ",(0,r.jsx)(s.code,{children:"psql"})," for short:"]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"psql\n"})}),"\n",(0,r.jsx)(s.p,{children:"Let's create out first table now:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"CREATE TABLE words (\n    id SERIAL PRIMARY KEY,\n    spelling VARCHAR(255),  -- or use TEXT for longer strings\n    score INT CHECK (score >= 0 AND score <= 100)\n);\n"})}),"\n",(0,r.jsx)(s.p,{children:'Let\'s add a few records to the new "words" table:'}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"INSERT INTO words (word, score) VALUES\n('Hello world', 10),\n('PostgreSQL is great', 20),\n('Database management', 30),\n('Learning SQL', 40);\n"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h2,{id:"2-commands",children:"2. Commands"}),"\n",(0,r.jsx)(s.h3,{id:"--1-psql",children:"- 1. psql"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"psql [username]\n"})}),"\n",(0,r.jsx)(s.p,{children:"Log into your sql server."}),"\n",(0,r.jsx)(s.h3,{id:"--2-list",children:"- 2. \\list"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\list\n"})}),"\n",(0,r.jsx)(s.p,{children:"or:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\l\n"})}),"\n",(0,r.jsx)(s.p,{children:"for short"}),"\n",(0,r.jsx)(s.p,{children:"Lists out all your databases."}),"\n",(0,r.jsx)(s.h3,{id:"--3-q",children:"- 3. \\q"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\q\n"})}),"\n",(0,r.jsx)(s.p,{children:"Quit the postgresql terminal."}),"\n",(0,r.jsx)(s.h3,{id:"--4-du",children:"- 4. \\du"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\du\n"})}),"\n",(0,r.jsx)(s.p,{children:"List out all roles (users) and their associated attributes, such as whether they have superuser privileges, can create databases, or can create new roles."}),"\n",(0,r.jsx)(s.p,{children:"Example output:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{children:"                                   List of roles\n Role name |                         Attributes                         | Member of\n-----------+------------------------------------------------------------+-----------\n talkohavy | Superuser, Create role, Create DB, Replication, Bypass RLS | {}\n"})}),"\n",(0,r.jsx)(s.h3,{id:"--5-password",children:"- 5. \\password"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\password USERNAME\n"})}),"\n",(0,r.jsx)(s.p,{children:"Set a password for user USERNAME."}),"\n",(0,r.jsx)(s.p,{children:"You'll be prompted to enter a new password and confirm it."}),"\n",(0,r.jsx)(s.h3,{id:"--6-dt",children:"- 6. \\dt"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\dt\n"})}),"\n",(0,r.jsx)(s.p,{children:"or:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\dt+\n"})}),"\n",(0,r.jsx)(s.p,{children:"List out all your tables."}),"\n",(0,r.jsx)(s.h3,{id:"--7-c",children:"- 7 \\c"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sql",children:"\\c DATABASE_NAME\n"})}),"\n",(0,r.jsx)(s.p,{children:"Switch to a different database on your server."})]})}function h(e={}){const{wrapper:s}={...(0,l.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},5710:(e,s,n)=>{n.d(s,{R:()=>t,x:()=>d});var r=n(758);const l={},a=r.createContext(l);function t(e){const s=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),r.createElement(a.Provider,{value:s},e.children)}}}]);