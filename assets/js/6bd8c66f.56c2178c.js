"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[7137],{6587:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>d,frontMatter:()=>r,metadata:()=>l,toc:()=>o});var s=i(1527),a=i(7252);const r={sidebar_label:"15. Regex",sidebar_position:14},t="Guide for Regex",l={id:"programming/regex",title:"Guide for Regex",description:"Lesson 1: Positive & Negative Lookahead & Lookbehinds",source:"@site/docs/programming/regex.md",sourceDirName:"programming",slug:"/programming/regex",permalink:"/guides/docs/programming/regex",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/regex.md",tags:[],version:"current",sidebarPosition:14,frontMatter:{sidebar_label:"15. Regex",sidebar_position:14},sidebar:"tutorialSidebar",previous:{title:"14. Configuration Server",permalink:"/guides/docs/programming/configuration-server"},next:{title:"16. Micro-Frontends",permalink:"/guides/docs/programming/micro-frontends"}},c={},o=[{value:"Lesson 1: Positive &amp; Negative Lookahead &amp; Lookbehinds",id:"lesson-1-positive--negative-lookahead--lookbehinds",level:2},{value:"- Type 1: Positive Look Ahead",id:"--type-1-positive-look-ahead",level:3},{value:"- Type 2: Negative Look Ahead",id:"--type-2-negative-look-ahead",level:3},{value:"- Type 3: Positive Look Behind",id:"--type-3-positive-look-behind",level:3},{value:"- Type 4: Negative Look Behind",id:"--type-4-negative-look-behind",level:3},{value:"- Combining Lookahead with Lookbehind",id:"--combining-lookahead-with-lookbehind",level:3},{value:"Lesson 2: Special backslash&#39;ed Letter Characters",id:"lesson-2-special-backslashed-letter-characters",level:2},{value:"- \\d",id:"--d",level:3},{value:"- \\D",id:"--d-1",level:3},{value:"- \\w",id:"--w",level:3},{value:"- \\W",id:"--w-1",level:3},{value:"- \\s",id:"--s",level:3},{value:"- \\S",id:"--s-1",level:3},{value:"Lesson 3: Special Sign Characters",id:"lesson-3-special-sign-characters",level:2},{value:"- .",id:"--",level:3},{value:"- ?",id:"---1",level:3},{value:"- +",id:"---2",level:3},{value:"- *",id:"---3",level:3},{value:"Lesson 4: Capture Groups",id:"lesson-4-capture-groups",level:2}];function h(e){const n={admonition:"admonition",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"guide-for-regex",children:"Guide for Regex"}),"\n",(0,s.jsx)(n.h2,{id:"lesson-1-positive--negative-lookahead--lookbehinds",children:"Lesson 1: Positive & Negative Lookahead & Lookbehinds"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Lookaheads"})," & ",(0,s.jsx)(n.code,{children:"Lookbehinds"})," allow you to match for patterns found ",(0,s.jsx)(n.strong,{children:"ahead"}),"/",(0,s.jsx)(n.strong,{children:"behind"})," some given ",(0,s.jsx)(n.em,{children:"argument"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["When wanting to extract B, which comes after A, without also extracting A, ",(0,s.jsx)(n.code,{children:"lookaheads"}),"/",(0,s.jsx)(n.code,{children:"lookbehinds"})," combined with ",(0,s.jsx)(n.code,{children:"match"})," are super helpful.",(0,s.jsx)(n.br,{}),"\n",(0,s.jsx)(n.code,{children:"lookahead"})," & ",(0,s.jsx)(n.code,{children:"lookbehinds"})," are both divided into 2 types: ",(0,s.jsx)(n.strong,{children:"positive"})," & ",(0,s.jsx)(n.strong,{children:"negative"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"--type-1-positive-look-ahead",children:"- Type 1: Positive Look Ahead"}),"\n",(0,s.jsx)(n.p,{children:"General form:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"/.+(?=AAA)/\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Description"})}),"\n",(0,s.jsxs)(n.p,{children:["Positive ",(0,s.jsx)(n.code,{children:"Lookaheads"})," allow you to match for patterns that ",(0,s.jsx)(n.strong,{children:"are found"})," (exist) ",(0,s.jsx)(n.strong,{children:"ahead"})," of some given argument."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Use Case"}),": When wanting to extract B, which comes after A, without also extracting A, ",(0,s.jsx)(n.code,{children:"lookaheads"})," combined with ",(0,s.jsx)(n.code,{children:"match"})," are super helpful."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Examples"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 1:"})," grab just the name of a file ending with .d.ts extension"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const exampleString = 'config.d.ts';\nconst positiveLookaheadRegex = /.+(?=\\.d\\.ts)/g;\n\npositiveLookaheadRegex.test(exampleString); // returns true\nexampleString.match(positiveLookaheadRegex); // returns 'config' (without '.d.ts' !!!)\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 2:"})," grab the first char that comes right before the letter A"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"exampleString = 'cat123A-catzzzA';\nregex = /.(?=A)/g;\n\n\nexampleString.match(regex);\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 3:"})," password must include at least 5 characters, and at least 2 consecutive digits."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const myRegex = /(?=\\w{5})(?=\\D*\\d{2})/g;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Let's break it down piece by piece."}),"\n",(0,s.jsx)(n.p,{children:"So what do we have here? A few reminders first:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\\w represents any word character. Word characters include a-z A-Z 0-9 and an underscore (_)."}),"\n",(0,s.jsx)(n.li,{children:"\\D represents any non-digit character. Which means, any letter (a-z A-Z), special characters (punctuation, symbols, etc.), whitespace characters (space, tab, etc.)."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"The regex above includes:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:'A positive lookahead that says "match for X that has at least 5 characters after it". which is basically saying "match only if the given string includes at least 5 characters".'}),"\n",(0,s.jsx)(n.li,{children:'Another positive lookahead that says "match for X that has 2 consecutive digits after it", which basically is like saying "the provided string must include 2 consecutive digits".'}),"\n"]}),"\n",(0,s.jsxs)(n.admonition,{type:"tip",children:[(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"When writing a positive lookahead:"})}),(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"have opening & closing parenthesis '(' & ')'"}),"\n",(0,s.jsx)(n.li,{children:"put a question mark at the beginning '?' followed by an equal sign '='"}),"\n",(0,s.jsx)(n.li,{children:'after the equal sign, put the X that means "patterns should have X appear right after them"'}),"\n",(0,s.jsxs)(n.li,{children:["an extra pattern ",(0,s.jsx)(n.em,{children:"may"})," be added to the left of a lookahead (i.e. /.(?=A)/g)"]}),"\n",(0,s.jsx)(n.li,{children:"an extra pattern to the right of a lookahead is pointless"}),"\n"]})]}),"\n",(0,s.jsx)("br",{}),"\n",(0,s.jsx)(n.h3,{id:"--type-2-negative-look-ahead",children:"- Type 2: Negative Look Ahead"}),"\n",(0,s.jsx)(n.p,{children:"General form:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"/(?!AAA)/\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Description"})}),"\n",(0,s.jsxs)(n.p,{children:["Negative ",(0,s.jsx)(n.code,{children:"lookaheads"})," allow you to match for patterns that ",(0,s.jsx)(n.strong,{children:"aren't found"})," (don't exist) ",(0,s.jsx)(n.strong,{children:"ahead"})," of some given argument."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Examples"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 1:"})," grab the pattern that doesn't have a 2 appear right after it"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:" exampleString = 'pig1-big2';\n negativeLookaheadRegex = /.ig(?!2)/g;\n positiveLookaheadRegex = /.ig(?=2)/g;\n\nnegativeLookaheadRegex.test(exampleString); // returns true\nexampleString.match(negativeLookaheadRegex); // returns 'pig'\nexampleString.match(positiveLookaheadRegex); // returns 'big'\n"})}),"\n",(0,s.jsx)(n.h3,{id:"--type-3-positive-look-behind",children:"- Type 3: Positive Look Behind"}),"\n",(0,s.jsx)(n.p,{children:"General form:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"/(?<=AAA)/\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Description"})}),"\n",(0,s.jsx)(n.p,{children:"You can already imagine."}),"\n",(0,s.jsx)(n.h3,{id:"--type-4-negative-look-behind",children:"- Type 4: Negative Look Behind"}),"\n",(0,s.jsx)(n.p,{children:"General form:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"/(?<!AAA)/\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Description"})}),"\n",(0,s.jsx)(n.p,{children:"You can already imagine."}),"\n",(0,s.jsx)(n.h3,{id:"--combining-lookahead-with-lookbehind",children:"- Combining Lookahead with Lookbehind"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"Example 1: return only the filename"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const exampleString = 'dist/config.d.ts';\nconst regex = /(?<=\\/).+(?=\\.d\\.ts)/g\n\nregex.test(exampleString);\nexampleString.match(regex); // returns 'config'\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"lesson-2-special-backslashed-letter-characters",children:"Lesson 2: Special backslash'ed Letter Characters"}),"\n",(0,s.jsx)(n.h3,{id:"--d",children:"- \\d"}),"\n",(0,s.jsx)(n.p,{children:"Matches a single digit between 0-9."}),"\n",(0,s.jsx)(n.h3,{id:"--d-1",children:"- \\D"}),"\n",(0,s.jsx)(n.p,{children:"Matches a non-digit, which means it matches:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"any letter (a-z A-Z)"}),"\n",(0,s.jsx)(n.li,{children:"and special character (punctuation, symbols, etc.)"}),"\n",(0,s.jsx)(n.li,{children:"whitespace characters (space, tab, etc.)"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--w",children:"- \\w"}),"\n",(0,s.jsxs)(n.p,{children:["Matches any ",(0,s.jsx)(n.code,{children:"word"})," character. ",(0,s.jsx)(n.code,{children:"word"})," characters include:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"any letter (a-z A-Z)"}),"\n",(0,s.jsx)(n.li,{children:"any number (0-9)"}),"\n",(0,s.jsx)(n.li,{children:"an underscore (_)"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--w-1",children:"- \\W"}),"\n",(0,s.jsx)(n.p,{children:"Matches a non-word, which means it matches:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"any letter that's not in english (e.g. \u05d0)"}),"\n",(0,s.jsx)(n.li,{children:"and special character (punctuation, symbols, etc.)"}),"\n",(0,s.jsx)(n.li,{children:"whitespace characters (space, tab, etc.)"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--s",children:"- \\s"}),"\n",(0,s.jsx)(n.p,{children:"Matches any whitespace character, which means it matches:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Space character ( )"}),"\n",(0,s.jsx)(n.li,{children:"Tab character (\\t)"}),"\n",(0,s.jsx)(n.li,{children:"Newline character (\\n)"}),"\n",(0,s.jsx)(n.li,{children:"Carriage return character (\\r)"}),"\n",(0,s.jsx)(n.li,{children:"Form feed character (\\f)"}),"\n",(0,s.jsx)(n.li,{children:"Vertical tab character (\\v)"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"--s-1",children:"- \\S"}),"\n",(0,s.jsx)(n.p,{children:"Matches any non-whitespace character."}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"lesson-3-special-sign-characters",children:"Lesson 3: Special Sign Characters"}),"\n",(0,s.jsx)(n.h3,{id:"--",children:"- ."}),"\n",(0,s.jsxs)(n.p,{children:["A wild card that matches ",(0,s.jsx)(n.em,{children:"any"})," character (a single one)."]}),"\n",(0,s.jsx)(n.h3,{id:"---1",children:"- ?"}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.em,{children:"maybe"}),' sign. This character is saying "that thing ',(0,s.jsx)(n.em,{children:"before"}),' me may or may not appear", both forms are correct.']}),"\n",(0,s.jsx)(n.h3,{id:"---2",children:"- +"}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.em,{children:"multiple"}),' sign. This character is saying "that thing ',(0,s.jsx)(n.em,{children:"before"}),' me may appear more than once but at least once".']}),"\n",(0,s.jsx)(n.h3,{id:"---3",children:"- *"}),"\n",(0,s.jsxs)(n.p,{children:["A ",(0,s.jsx)(n.em,{children:"maybe & multiple"})," sign. This character is basically the combination of '?' and '+', and is saying \"that thing ",(0,s.jsx)(n.em,{children:"before"}),' me may appear more than once or even not appear at all!".']}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"lesson-4-capture-groups",children:"Lesson 4: Capture Groups"}),"\n",(0,s.jsx)(n.p,{children:"General form:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"/(?=AAA)/\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Description"})}),"\n",(0,s.jsxs)(n.p,{children:["You can group things that you're searching for inside parenthesis.",(0,s.jsx)(n.br,{}),"\n","This is great for ",(0,s.jsx)(n.em,{children:"find & replace"})," use cases."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Examples"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 1:"})," swap between month & day in dateString"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"// Original date-like string\nconst dateString = '12/25/2023';\n\n// Regular expression with capture groups\nconst regex = /(\\d{2})\\/(\\d{2})\\/(\\d{4})/;\n\n// Use replace with capture groups to swap day and month\nconst modifiedString = dateString.replace(regex, '$2/$1/$3');\n\n// Output the modified string\nconsole.log(modifiedString);  // Output: '25/12/2023'\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"Example 2:"})," delete everything after X"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const str = `i want everything gone after. the word gone.\nbecause you're gone na miss me when i'm gon.`;\n\nconst strWithoutGone = str.replaceAll(/gone.+/g,'');\n\nconsole.log('strWithoutGone is:',strWithoutGone); // returns `\"i want everything \\nbecause you're `\n"})})]})}function d(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},7252:(e,n,i)=>{i.d(n,{Z:()=>l,a:()=>t});var s=i(959);const a={},r=s.createContext(a);function t(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);