"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[4891],{6530:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>c,frontMatter:()=>l,metadata:()=>a,toc:()=>d});var t=i(1527),s=i(7252);const l={sidebar_label:"20. CSS",sidebar_position:19},r="Guide For CSS",a={id:"programming/css",title:"Guide For CSS",description:"1. Flexbox",source:"@site/docs/programming/css.md",sourceDirName:"programming",slug:"/programming/css",permalink:"/guides/he/docs/programming/css",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/css.md",tags:[],version:"current",sidebarPosition:19,frontMatter:{sidebar_label:"20. CSS",sidebar_position:19},sidebar:"tutorialSidebar",previous:{title:"19. ELK",permalink:"/guides/he/docs/programming/elk"},next:{title:"999. \u05ea\u05d1\u05e0\u05d9\u05ea \u05dc\u05de\u05d3\u05e8\u05d9\u05da \u05d7\u05d3\u05e9",permalink:"/guides/he/docs/programming/new-guide-template"}},o={},d=[{value:"<strong>1. Flexbox</strong>",id:"1-flexbox",level:2},{value:"- A. Defaults of Flexbox",id:"--a-defaults-of-flexbox",level:3},{value:"- B. Flex items Behavior",id:"--b-flex-items-behavior",level:3},{value:"- C. Flex Shrink",id:"--c-flex-shrink",level:3},{value:"- D. Flex Grow",id:"--d-flex-grow",level:3},{value:"- E. Flex Wrap",id:"--e-flex-wrap",level:3},{value:"- F. What is flex: 1?",id:"--f-what-is-flex-1",level:3},{value:"- G. align-self",id:"--g-align-self",level:3},{value:"- H. Flex Flow",id:"--h-flex-flow",level:3},{value:"- I. How is it calculated with padding &amp; margins?",id:"--i-how-is-it-calculated-with-padding--margins",level:3},{value:"<strong>2. Grid</strong>",id:"2-grid",level:2},{value:"- A. Grid Terminology",id:"--a-grid-terminology",level:3},{value:"- B. Grid Behavior",id:"--b-grid-behavior",level:3},{value:"- C. Grid template columns",id:"--c-grid-template-columns",level:3},{value:"- D. Flexible columns - The Fraction Unit",id:"--d-flexible-columns---the-fraction-unit",level:3},{value:"- E. Gap &amp; Padding",id:"--e-gap--padding",level:3},{value:"- F. Repeat",id:"--f-repeat",level:3},{value:"- G. Grid template rows",id:"--g-grid-template-rows",level:3},{value:"- H. Grid auto rows",id:"--h-grid-auto-rows",level:3},{value:"- I. minmax css function",id:"--i-minmax-css-function",level:3},{value:"- J. gap (new) and grid-row-gap &amp; grid-column-gap (old)",id:"--j-gap-new-and-grid-row-gap--grid-column-gap-old",level:3},{value:"- K. grid-template-areas",id:"--k-grid-template-areas",level:3},{value:"- L. grid-column-start &amp; grid-column-end",id:"--l-grid-column-start--grid-column-end",level:3},{value:"- L. grid-row-start &amp; grid-row-end",id:"--l-grid-row-start--grid-row-end",level:3},{value:"- M. justify-content &amp; align-content &amp; justify-items &amp; align-items",id:"--m-justify-content--align-content--justify-items--align-items",level:3},{value:"- N. align-self &amp; justify-self",id:"--n-align-self--justify-self",level:3}];function h(e){const n={br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"guide-for-css",children:"Guide For CSS"}),"\n",(0,t.jsx)(n.h2,{id:"1-flexbox",children:(0,t.jsx)(n.strong,{children:"1. Flexbox"})}),"\n",(0,t.jsx)(n.h3,{id:"--a-defaults-of-flexbox",children:"- A. Defaults of Flexbox"}),"\n",(0,t.jsxs)(n.p,{children:["When giving an element a display of ",(0,t.jsx)(n.code,{children:"flex"})," there are some defaults given to that element."]}),"\n",(0,t.jsxs)(n.p,{children:["Here are the defaults of ",(0,t.jsx)(n.code,{children:"display: flex"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexParent {\n  display: flex;\n  justify-content: flex-start;\n  align-items: stretch;\n  flex-direction: row;\n  gap: 0;\n  flex-wrap: nowrap;\n}\n\n.flexItem {\n  flex-shrink: 1;\n  flex-grow: 0;\n  flex-basis: auto;\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"--b-flex-items-behavior",children:"- B. Flex items Behavior"}),"\n",(0,t.jsxs)(n.p,{children:["As soon as you give an element a display of flex, all the ",(0,t.jsx)(n.code,{children:"display: block"})," stuff goes out the window. They are no longer display block/span, they are now what's called ",(0,t.jsx)(n.strong,{children:"flex items"}),", and they're behaving like flex items."]}),"\n",(0,t.jsx)(n.p,{children:"If you went to a flex item, and gave it a display block:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  display: block; /* or inline */\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"absolutely nothing will happen! Of course, there's the exception of display none which would make them disappear."}),"\n",(0,t.jsxs)(n.p,{children:["One of the things that a flex item wants to do is it wants to be as small as it can be while maintaining everything in one line. There's a value known as ",(0,t.jsx)(n.code,{children:"max-content"}),", and what it does..."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".someElement {\n  width: max-content;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"is it tries to maintain text content in one line, and basically telling the element \"hey, you're not allowed to wrap\", and when all that text is in one line, then that's the element's width!"}),"\n",(0,t.jsxs)(n.p,{children:["There's another value known as ",(0,t.jsx)(n.code,{children:"min-content"}),", which allows for wrapping, and in this case the width of an element is determined by the longest single word."]}),"\n",(0,t.jsxs)(n.p,{children:["Both ",(0,t.jsx)(n.code,{children:"min-content"})," & ",(0,t.jsx)(n.code,{children:"max-content"})," play a role in flexbox, and so it's important to talk about them."]}),"\n",(0,t.jsxs)(n.p,{children:["When we do our display of ",(0,t.jsx)(n.code,{children:"flex"}),", each flex item is going to that ",(0,t.jsx)(n.code,{children:"max-content"})," size, and it's shrinking them down to the smallest size they can be, while maintaining ",(0,t.jsx)(n.code,{children:"max-content"})," - which means no wrapping allowed, no line-breaks. All that is true ",(0,t.jsx)(n.strong,{children:"if"})," all the flex items can fit the parent's size. When the parent runs out of room, flex items are allowed to create line-breaks, ",(0,t.jsx)(n.strong,{children:"until"}),"! until they can no longer shrink beyond their ",(0,t.jsx)(n.code,{children:"min-content"}),", and that's when we get a ",(0,t.jsx)(n.em,{children:"parent overflow"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"\u2022 Why do different children get different widths?"})}),"\n",(0,t.jsxs)(n.p,{children:["you might have come across it when you give a parent container element a display of ",(0,t.jsx)(n.code,{children:"flex"}),", and it has 3 children, and 2 of them get width X while the third one get a width of Y, and you're not sure why."]}),"\n",(0,t.jsxs)(n.p,{children:["To better understand this behavior try running a little experiment that mimics what flexbox is actually doing automatically behind the scenes. First, give all the flex items a ",(0,t.jsx)(n.code,{children:"flex-shrink"})," of 0, basically turning off the default behavior of 1. This is the first step flexbox is doing behind the scenes in order to calculate how big each flex item would be without the shrink on it. By giving each flex item a ",(0,t.jsx)(n.code,{children:"flex-shrink"})," of 0 you're essentially choosing by your own volition to overflow the parent element, providing each flex item a width of ",(0,t.jsx)(n.code,{children:"max-content"})," that disallows shrinking."]}),"\n",(0,t.jsxs)(n.p,{children:["The next step flexbox does is switch the value of ",(0,t.jsx)(n.code,{children:"flex-shrink"})," to 1. In this step, flexbox is taking the joint width of all the flex items combined, and by and fits it in the parent container, while shrinking each flex item relative to its ratio when it had ",(0,t.jsx)(n.code,{children:"flex-shrink"})," 1."]}),"\n",(0,t.jsx)(n.h3,{id:"--c-flex-shrink",children:"- C. Flex Shrink"}),"\n",(0,t.jsxs)(n.p,{children:["The default for ",(0,t.jsx)(n.code,{children:"flex-shrink"})," is 1.",(0,t.jsx)(n.br,{}),"\n","If we didn't have ",(0,t.jsx)(n.code,{children:"flex-shrink"})," enabled by default, and we were to turn it off:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex-shrink: 0;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["and now we tried shrinking the screen down, we immediately get a ",(0,t.jsx)(n.em,{children:"parent overflow"}),". Essentially, what this means is that flex item get their width set to ",(0,t.jsx)(n.code,{children:"max-content"})," size, and that's the size they are, and they are not allowed to shrink from that point on."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"flex-shrink"})," being set to 1 is a pretty good default, and if it were set to 0, we would have basically almost always turn it on manually."]}),"\n",(0,t.jsx)(n.h3,{id:"--d-flex-grow",children:"- D. Flex Grow"}),"\n",(0,t.jsxs)(n.p,{children:["The default for ",(0,t.jsx)(n.code,{children:"flex-grow"}),' is 0, which means "don\'t grow at all".',(0,t.jsx)(n.br,{}),"\n","The ",(0,t.jsx)(n.code,{children:"flex-grow"})," value can be more than 1, and starts this thing where there's a ratio on things are growing, but it's good practice that if you turn it one then simply put it to 1."]}),"\n",(0,t.jsxs)(n.p,{children:["So what does ",(0,t.jsx)(n.code,{children:"flex-grow"})," do?"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"flex-grow"})," takes all the leftover space that the parent has, and splits it evenly (if they're all set to 1) between the flex items."]}),"\n",(0,t.jsx)(n.p,{children:"Usually with navigation links bar we want that default behavior of grow being off."}),"\n",(0,t.jsx)(n.p,{children:"One important thing to note, the grows rate of each row is independent! What this means in simpler terms is that if there are 2 rows, and in one there's 6 items, and in the other there's 4 items, one split will be amongst the 6 (divide by 6), and one split will be among the 4 (divide by 4)."}),"\n",(0,t.jsxs)(n.p,{children:["But how can it be that we got more than 1 row in the first place? Meet ",(0,t.jsx)(n.code,{children:"flex-wrap"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"--e-flex-wrap",children:"- E. Flex Wrap"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"flex-wrap"})," is set to ",(0,t.jsx)(n.code,{children:"nowrap"})," by default.",(0,t.jsx)(n.br,{}),"\n","There's another value called ",(0,t.jsx)(n.code,{children:"wrap"}),", which allows flex items to wrap once they hit the parent's max width."]}),"\n",(0,t.jsxs)(n.p,{children:["So basically, instead of having a ",(0,t.jsx)(n.em,{children:"parent overflow"}),", you're getting a ",(0,t.jsx)(n.em,{children:"parent wrap"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"--f-what-is-flex-1",children:"- F. What is flex: 1?"}),"\n",(0,t.jsx)(n.p,{children:"A common thing you'll see in other people's project is the use of the shorthand write of:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex: 1;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"and you probably know that what this usually means is that the developer wanted every flexItem to be equally sized. But why is this happening?"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"flex"})," attribute actually accepts 3 things as its argument.",(0,t.jsx)(n.br,{}),"\n","The ",(0,t.jsx)(n.code,{children:"flex"})," attribute is like the ",(0,t.jsx)(n.code,{children:"border"})," attribute in the sense that they are a way to write many attributes in one line:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".someItem {\n  border: 1px solid black;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"is exactly the same as:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".someItem {\n  border-width: 1px;\n  border-style: solid;\n  border-color: black;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["What ",(0,t.jsx)(n.code,{children:"flex: 1"})," really means is this:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex: 1;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"is exactly the same as:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex-shrink: 1;\n  flex-grow: 1;\n  flex-basis: 0;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Let's analyze what we got here.",(0,t.jsx)(n.br,{}),"\n",(0,t.jsx)(n.code,{children:"flex-shrink"})," is 1 by default, so ",(0,t.jsx)(n.code,{children:"flex: 1"})," did not touch that. cool.",(0,t.jsx)(n.br,{}),"\n",(0,t.jsx)(n.code,{children:"flex-grow"})," is 0 by default, so we see that ",(0,t.jsx)(n.code,{children:"flex: 1"})," changed it to 1, and this is expected, since we want all flex items to be equally sized. Naturally this would mean that some of them would have to grow, and some of them would have to shrink."]}),"\n",(0,t.jsxs)(n.p,{children:["But what is this ",(0,t.jsx)(n.code,{children:"flex-basis"})," thingy?"]}),"\n",(0,t.jsx)(n.p,{children:"Imagine th following settings:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex-shrink: 0;\n  flex-grow: 0;\n  flex-basis: 300px;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"What this says it this: \"Hey, don't let flex items shrink, don't let them grow, but in fact - give each one a width of 300px\"."}),"\n",(0,t.jsxs)(n.p,{children:["Regardless of what the parent's width is, each child ",(0,t.jsx)(n.em,{children:"would"})," in fact get a width of a 300px. And if an overflow situation were to occur? Then so be it!",(0,t.jsx)(n.br,{}),"\n","You can think of ",(0,t.jsx)(n.code,{children:"flex-basis"})," a lot like width. It ",(0,t.jsx)(n.em,{children:"is"})," different from width, but it's very very similar, and often thinking about them in the same way is the easiest way to really understand what's happening."]}),"\n",(0,t.jsx)(n.p,{children:'That being said, we normally don\'t use "px" on it as values, rather we use percents.'}),"\n",(0,t.jsxs)(n.p,{children:["One of the differences between ",(0,t.jsx)(n.code,{children:"width"})," and ",(0,t.jsx)(n.code,{children:"flex-basis"})," is when you set ",(0,t.jsx)(n.code,{children:"flex-basis"})," to 0, the flex items don't actually become of 0 width. ",(0,t.jsx)(n.code,{children:"flex-basis"})," 0 actually means ",(0,t.jsx)(n.code,{children:"min-content"})," value."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Important thing to note!"})," You ",(0,t.jsx)(n.em,{children:"shouldn't"})," use ",(0,t.jsx)(n.code,{children:"width"})," AND ",(0,t.jsx)(n.code,{children:"flex-basis"})," together. ",(0,t.jsx)(n.code,{children:"width"})," wins the battle in case both are mentioned. In any case, you should use one or the other, not both."]}),"\n",(0,t.jsxs)(n.p,{children:["I usually like to give each flex-item a width of 100%, which is in the case the same as setting ",(0,t.jsx)(n.code,{children:"flex-basis"})," to 100%."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex-shrink: 1;\n  flex-grow: 1;\n  flex-basis: auto;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"\u2022 Edge Case 1:"})}),"\n",(0,t.jsx)(n.p,{children:"Consider the following case:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexItem {\n  flex-shrink: 0;\n  flex-grow: 1;\n  flex-basis: 100%;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"What would happen in the above scenario?"}),"\n",(0,t.jsx)(n.p,{children:"Because the shrink is off, and the basis is 100%, each child will have 100% of the parent's width, and an overflow is guaranteed to happen if there's more than 1 flex item."}),"\n",(0,t.jsx)(n.h3,{id:"--g-align-self",children:"- G. align-self"}),"\n",(0,t.jsxs)(n.p,{children:["Often time when working in a ",(0,t.jsx)(n.code,{children:"flex-direction: column"})," situation, you find yourself doing this:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".flexParent {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: flex-start;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"and you've seen this a million times. You want a column, you want the flex items to space evenly between, and you want each flex item to be aligned to the left."}),"\n",(0,t.jsxs)(n.p,{children:["However! Amongst the flex items, there's one child item which you want aligned differently than its brothers. Either to the right, or to the center. It could be that this flex item is a title, or maybe a button at the bottom.",(0,t.jsx)(n.br,{}),"\n","This can be done by using ",(0,t.jsx)(n.code,{children:"align-self"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".specialFlexItem {\n  align-self: center;\n}\n``\n"})}),"\n",(0,t.jsx)(n.h3,{id:"--h-flex-flow",children:"- H. Flex Flow"}),"\n",(0,t.jsxs)(n.p,{children:["This is a shorthand for the flex-direction and flex-wrap properties, which together define the flex container\u2019s main and cross axes. The default value is ",(0,t.jsx)(n.code,{children:"row nowrap"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".container {\n  flex-flow: column wrap;\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"--i-how-is-it-calculated-with-padding--margins",children:"- I. How is it calculated with padding & margins?"}),"\n",(0,t.jsxs)(n.p,{children:["When flexbox is doing its calculations, it's ",(0,t.jsx)(n.strong,{children:"NOT"})," taking into account each flex item's paddings & border widths."]}),"\n",(0,t.jsx)(n.p,{children:"Now what does that mean exactly? And why they decided it should behave like that?"}),"\n",(0,t.jsxs)(n.p,{children:["So, we know that flex items can either shrink or grow to fill the parent element's width. Think about it this way: do you really want the ",(0,t.jsx)(n.em,{children:"border width"})," to grow or shrink? Now that wouldn't make much sense, does it? So, what flexbox does it it deducts all those border widths up front, and hen proceeds to fit the flex items in the space that's left. For instance, if a parent element has a width of 600, and 1 flex item has a border width of 2, then flexbox takes the 600 and deducts 4 from it (because there's a border of each side), and proceed to divide 596 by 3."]}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h2,{id:"2-grid",children:(0,t.jsx)(n.strong,{children:"2. Grid"})}),"\n",(0,t.jsx)(n.h3,{id:"--a-grid-terminology",children:"- A. Grid Terminology"}),"\n",(0,t.jsx)(n.p,{children:"Grid container"}),"\n",(0,t.jsx)(n.p,{children:"Grid items"}),"\n",(0,t.jsx)(n.p,{children:"Grid gaps"}),"\n",(0,t.jsx)(n.p,{children:"Grid tracks"}),"\n",(0,t.jsx)(n.h3,{id:"--b-grid-behavior",children:"- B. Grid Behavior"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Applying ",(0,t.jsx)(n.code,{children:"display: grid"})," by itself doesn't do anything. By default, any with no further input, its children would act as normal div's inside of a container. ",(0,t.jsx)(n.code,{children:"display: grid"})," in itself doesn't define any rows or columns for us to work with."]}),"\n",(0,t.jsx)(n.p,{children:"To make a grid display as an actual grid, we need to define specific rows or columns manually."}),"\n",(0,t.jsx)(n.h3,{id:"--c-grid-template-columns",children:"- C. Grid template columns"}),"\n",(0,t.jsxs)(n.p,{children:["There's a property called ",(0,t.jsx)(n.code,{children:"grid-template-columns"}),", with which we can define our columns. In it we need to provide a value, which is a list of all the different columns sizes we want. You can use percentage, pixels, em, rem, whatever you want."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-columns: 200px 100px;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"The example above shows a grid defined with 2 columns, where the first one has a width of 200px, and the second column has 100px."}),"\n",(0,t.jsx)(n.h3,{id:"--d-flexible-columns---the-fraction-unit",children:"- D. Flexible columns - The Fraction Unit"}),"\n",(0,t.jsx)(n.p,{children:"What if we wanted our columns to flexibly size themselves based on the items inside of them?"}),"\n",(0,t.jsxs)(n.p,{children:["That's when we use the ",(0,t.jsx)(n.code,{children:"fraction"})," unit."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"In the above example, I've used 2fr and 1fr as my units. The container's full width is then assumed to be 3frs (fraction units) in total, and the first columns would take 2/3 of its total, and the second column would take 1/3 of its total."}),"\n",(0,t.jsx)(n.h3,{id:"--e-gap--padding",children:"- E. Gap & Padding"}),"\n",(0,t.jsx)(n.p,{children:"When giving the container a gutter gap or padding, you should be aware that it takes up from the space that would be left for the grid items. So, grid items will shrink in order to fit their container. The grid container will first deduct the size of the gaps and its padding, and then divide the remaining space amongst the grid items."}),"\n",(0,t.jsx)(n.h3,{id:"--f-repeat",children:"- F. Repeat"}),"\n",(0,t.jsx)(n.p,{children:'Consider a case where you wanted a large number of columns, lets say 12, and you wanted them all the same size (the "same size" part is important!). In this case, what you would normally do is:'}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Looks awful, right? You can really understand how many columns are there with how it's written above. A better way is to use the ",(0,t.jsx)(n.code,{children:"repeat"})," value. ",(0,t.jsx)(n.code,{children:"repeat"})," is basically a css function (like ",(0,t.jsx)(n.code,{children:"calc"}),"), that accepts 2 arguments: the columns count, and the unit to repeat over those columns."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"--g-grid-template-rows",children:"- G. Grid template rows"}),"\n",(0,t.jsxs)(n.p,{children:["Same as with ",(0,t.jsx)(n.code,{children:"grid-template-columns"}),", you can define rows with ",(0,t.jsx)(n.code,{children:"grid-template-columns"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-rows: 200px 150px;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The above example will have the first row as 200px height, and the second row with 150px height. But what if I have more than 2 rows? Will it activate as a pattern? Odd rows and even rows? Well, the answer is ",(0,t.jsx)(n.strong,{children:"no"}),"..."]}),"\n",(0,t.jsx)(n.p,{children:"Only the rows you defined (one & two) will follow the given height you provided. The rest of them will take the container's leftover space and divide it equally between them. In case of no space left, they will shrink down to their minimum height, and overflow the container if they can't all fit inside."}),"\n",(0,t.jsxs)(n.p,{children:["So how can we solve this for a case we don't know how many rows there gonna be?Meet ",(0,t.jsx)(n.code,{children:"grid-auto-rows"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"--h-grid-auto-rows",children:"- H. Grid auto rows"}),"\n",(0,t.jsxs)(n.p,{children:["If you don't know how many rows a container is going to have, you can use the property known as ",(0,t.jsx)(n.code,{children:"grid-auto-rows"}),". The property ",(0,t.jsx)(n.code,{children:"grid-auto-rows"})," plays well together with ",(0,t.jsx)(n.code,{children:"grid-template-rows"})," property in the sense that rows defined by ",(0,t.jsx)(n.code,{children:"grid-template-rows"})," get defined and follow the rule it dictates, and each row that comes ",(0,t.jsx)(n.strong,{children:"after"})," the rows defined in ",(0,t.jsx)(n.code,{children:"grid-template-rows"}),", follow the rule which the ",(0,t.jsx)(n.code,{children:"grid-auto-rows"})," property dictates."]}),"\n",(0,t.jsx)(n.p,{children:"So, for example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-template-rows: 200px 150px;\n  grid-auto-rows: 100px;\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:"In the above example, the first row is going to have a height of 200px, the second row is going to have a height of 150px, and the remaining rows (which either will or will not get created) are going to have a height of 100px."}),"\n",(0,t.jsxs)(n.p,{children:["In case a ",(0,t.jsx)(n.code,{children:"grid-template-rows"})," property isn't defined, then all rows will be affected by the ",(0,t.jsx)(n.code,{children:"grid-auto-rows"})," property, starting from the first row."]}),"\n",(0,t.jsx)(n.h3,{id:"--i-minmax-css-function",children:"- I. minmax css function"}),"\n",(0,t.jsxs)(n.p,{children:["Let's say you defined a row height using either ",(0,t.jsx)(n.code,{children:"grid-template-rows"})," or ",(0,t.jsx)(n.code,{children:"grid-auto-rows"}),", but the cell's content needs much more space."]}),"\n",(0,t.jsx)(n.p,{children:"What will happen then?"}),"\n",(0,t.jsx)(n.p,{children:"Let's give an example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-auto-rows: 100px;\n}\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:"<div style={{\n  display: 'grid',\n  gridTemplateColumns: 'repeat(2,1fr)',\n  gridAutoRows: '120px',\n  gap: 10,\n}}>\n  <div>lorem ipsum(100)</div>\n  <div>lorem ipsum(25)</div>\n  <div>hello</div>\n  <div>world</div>\n</div>\n"})}),"\n",(0,t.jsx)(n.p,{children:"In the above example, the first row is going to have a fixed height of 120px, but the contents of the first cell is going to be huge, it's going to overflow the cell and be display on the cell below. Usually, grid items stretch according to their content, and a row's height is determined by the highest cell within that row, but when we force a row to a certain height, the contents has no choice but to either fit in case it fits, or to overflow in case it needs more space."}),"\n",(0,t.jsx)(n.p,{children:'A useful trick to solve for this case is to say "well, be at least 150px, instead of hardcoded 150px".'}),"\n",(0,t.jsxs)(n.p,{children:["To do that, we can use the css function called ",(0,t.jsx)(n.code,{children:"minmax"})," as a value for the property ",(0,t.jsx)(n.code,{children:"grid-auto-rows"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-auto-rows: minmax(100px, auto);\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["In the above scenario, I gave a minimum height of 100px, and set the maximum height to ",(0,t.jsx)(n.code,{children:"auto"}),", which means our grid items can now grow and stretch to fill that minimum content requirement."]}),"\n",(0,t.jsx)(n.h3,{id:"--j-gap-new-and-grid-row-gap--grid-column-gap-old",children:"- J. gap (new) and grid-row-gap & grid-column-gap (old)"}),"\n",(0,t.jsxs)(n.p,{children:["We usually use ",(0,t.jsx)(n.code,{children:"gap"})," since even gaps make the most sense at 95% of cases, but in those rare cases you need gaps only between rows or only between columns, or just have an uneven gap for rows and cols, you can use ",(0,t.jsx)(n.code,{children:"grid-row-gap"})," & ",(0,t.jsx)(n.code,{children:"grid-column-gap"}),"."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-auto-rows: 100px;\n  grid-row-gap: 10px;\n  grid-column-gap: 5px;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You should know that ",(0,t.jsx)(n.code,{children:"grid-row-gap"})," & ",(0,t.jsx)(n.code,{children:"grid-column-gap"})," (as well as ",(0,t.jsx)(n.code,{children:"grid-gap"})," which can be used to set both) got ",(0,t.jsx)(n.strong,{children:(0,t.jsx)(n.em,{children:"DEPRECATED"})}),", and got replaced with ",(0,t.jsx)(n.code,{children:"gap"}),". You should use ",(0,t.jsx)(n.code,{children:"gap"})," instead in the following manner:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-auto-rows: 100px;\n  gap: 10px 5px;\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"--k-grid-template-areas",children:"- K. grid-template-areas"}),"\n",(0,t.jsx)(n.p,{children:"I can't see the usefulness of this, and it seems super hard to maintain in the long run, but oh well... here's the jest of it:"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"grid-template-area"})," allows you to define template areas using nicknames, and then grid items can later then grab these nicknames using the ",(0,t.jsx)(n.code,{children:"grid-area"})," property to layout themselves within the grid."]}),"\n",(0,t.jsx)(n.p,{children:"Here's an example:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:'.gridContainer {\n  display: grid;\n  gap: 10px;\n  grid-templates-areas:\n    "header" "header" "header"\n    "sidebar" "content" "content"\n    "sidebar" "content" "content"\n}\n\n.gridItem1 {\n  grid-area: header;\n  background-color: red;\n}\n\n.gridItem2 {\n  grid-area: sidebar;\n  background-color: blue;\n}\n\n.gridItem2 {\n  grid-area: content;\n  background-color: green;\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Again, you'l rarely be using this, since there's a better way to achieve the same result in a more maintainable way. And that is with a property called ",(0,t.jsx)(n.code,{children:"grid-column-start"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"--l-grid-column-start--grid-column-end",children:"- L. grid-column-start & grid-column-end"}),"\n",(0,t.jsxs)(n.p,{children:["These two are properties given to the ",(0,t.jsx)(n.em,{children:"grid item"})," element.",(0,t.jsx)(n.br,{}),"\n","Using ",(0,t.jsx)(n.code,{children:"grid-column-start"}),", you can tell a grid item from which column it should start spanning from, counting starts from 1, and using ",(0,t.jsx)(n.code,{children:"grid-column-end"})," you can tell it to which column to span."]}),"\n",(0,t.jsx)(n.p,{children:"You might be thinking that start 1 and end 2 will span for 2 columns, but it actually counts as 1 column. The counting is actually that of lines on the grid. In a grid layout of 2 columns, there are 3 separating lines. 2 being that in the middle. In a grid layout of 5 columns, there are 6 separating lines. 3 being that which is in the middle."}),"\n",(0,t.jsx)(n.p,{children:"There's a special value of negative 1 (-1), which tells the grid item to span all the way across the end of the row."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridContainer {\n  display: grid;\n  grid-auto-rows: 100px;\n  grid: repeat(4,1fr);\n  gap: 10px;\n}\n\n.gridItem1 {\n  grid-column-start: 1;\n  grid-column-end: -1;\n}\n\n.gridItem2 {\n  grid-column-start: 1;\n  grid-column-end: 3;\n}\n\n.gridItem3 {\n  grid-column-start: 3;\n  grid-column-end: 4;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["There's even a shorthand writing for both the start & end properties, and that's called ",(0,t.jsx)(n.code,{children:"grid-column"}),", which accept 2 arguments. The first one is the start, and the second one is the end:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridItem1 {\n  grid-column: 1 / -1;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["NOTE! By not mentioning a ",(0,t.jsx)(n.code,{children:"grid-column-start"}),", but do mention a ",(0,t.jsx)(n.code,{children:"grid-column-end"}),", the value for ",(0,t.jsx)(n.code,{children:"grid-column-start"})," is being automatically set to the value you set under ",(0,t.jsx)(n.code,{children:"grid-column-end"}),", minus 1."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridItem1 {\n  grid-column-end: 4; /* `grid-column-start` will implicitly be set to 3! */\n}\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsxs)(n.strong,{children:["\u2022 The ",(0,t.jsx)(n.code,{children:"span \\d"})," value:"]})}),"\n",(0,t.jsxs)(n.p,{children:["Instead of giving numbers as values, you can say ",(0,t.jsx)(n.code,{children:"span 2"})," as the value for ",(0,t.jsx)(n.code,{children:"grid-column"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-css",children:".gridItem1 {\n  grid-column: span 2;\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["As you can imagine, ",(0,t.jsx)(n.code,{children:"span 1"})," is the default value."]}),"\n",(0,t.jsx)(n.h3,{id:"--l-grid-row-start--grid-row-end",children:"- L. grid-row-start & grid-row-end"}),"\n",(0,t.jsxs)(n.p,{children:["Just as we have ",(0,t.jsx)(n.code,{children:"grid-column-start"})," & ",(0,t.jsx)(n.code,{children:"grid-column-end"}),", we also have ",(0,t.jsx)(n.code,{children:"grid-row-start"})," & ",(0,t.jsx)(n.code,{children:"grid-row-end"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"The counting is the same. The total row lines are the amount of rows + 1."}),"\n",(0,t.jsx)(n.h3,{id:"--m-justify-content--align-content--justify-items--align-items",children:"- M. justify-content & align-content & justify-items & align-items"}),"\n",(0,t.jsxs)(n.p,{children:["This can be confusing, since you're used to ",(0,t.jsx)(n.code,{children:"justify-content"})," from flexbox."]}),"\n",(0,t.jsxs)(n.p,{children:["What does ",(0,t.jsx)(n.code,{children:"justify-content"})," do in the grid layout sense?"]}),"\n",(0,t.jsxs)(n.p,{children:["Just like in flexbox, ",(0,t.jsx)(n.code,{children:"justify-content"})," is used on the container. Consider the following case: You have a container, and for some reason, you gave fixed values for the width and height for the grid items. What would happen if the sum of those was smaller then the actual width & height of the container? How would the grid be aligned within that container?"]}),"\n",(0,t.jsxs)(n.p,{children:["There are a few options for ",(0,t.jsx)(n.code,{children:"justify-content"}),":"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"start"}),"\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"end"}),"\n",(0,t.jsx)(n.li,{children:"space-around"}),"\n",(0,t.jsx)(n.li,{children:"space-evenly"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Notice how it's ",(0,t.jsx)(n.code,{children:"start"})," and not ",(0,t.jsx)(n.code,{children:"flex-start"}),", and ",(0,t.jsx)(n.code,{children:"end"})," not ",(0,t.jsx)(n.code,{children:"flex-end"}),". Because we're not talking about flex here."]}),"\n",(0,t.jsx)(n.p,{children:"As you can just about now imagine, start would have them (the grid items) stick to the left, end would have them stick to the right, and center would center them."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"align-content"})," is much like flexbox's ",(0,t.jsx)(n.code,{children:"align-items"}),", in the sense that it controls the ",(0,t.jsx)(n.strong,{children:"vertical alignment"})," of the items."]}),"\n",(0,t.jsxs)(n.p,{children:["The options for ",(0,t.jsx)(n.code,{children:"align-content"})," are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"stretch"}),"\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"..."}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"justify-items"})," allows you control over how to align each item within its column."]}),"\n",(0,t.jsxs)(n.p,{children:["The options for ",(0,t.jsx)(n.code,{children:"justify-items"})," are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"start"}),"\n",(0,t.jsx)(n.li,{children:"end"}),"\n",(0,t.jsx)(n.li,{children:"stretch"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["start being to align to the left of the column, and end being to align to the right of the column. By default, the value is ",(0,t.jsx)(n.code,{children:"stretch"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"align-items"})," allows you control over how to align each item within its row."]}),"\n",(0,t.jsxs)(n.p,{children:["The options for ",(0,t.jsx)(n.code,{children:"align-items"})," are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"start"}),"\n",(0,t.jsx)(n.li,{children:"end"}),"\n",(0,t.jsx)(n.li,{children:"stretch"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"start being the top of the row, and end being the bottom of the row. By default, the value is set to stretch."}),"\n",(0,t.jsx)(n.h3,{id:"--n-align-self--justify-self",children:"- N. align-self & justify-self"}),"\n",(0,t.jsxs)(n.p,{children:["Just like flexbox, grid has a property called ",(0,t.jsx)(n.code,{children:"align-self"}),", where each grid item can choose to use in order to break from the setting which was set on the grid parent container, and align itself differently."]}),"\n",(0,t.jsxs)(n.p,{children:["Since ",(0,t.jsx)(n.code,{children:"grid"})," is 2-dimensional, it has two of those, whereas ",(0,t.jsx)(n.code,{children:"flexbox"}),", which is only 1-dimensional, only has one."]}),"\n",(0,t.jsxs)(n.p,{children:["The options for ",(0,t.jsx)(n.code,{children:"align-self"})," are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"start"}),"\n",(0,t.jsx)(n.li,{children:"end"}),"\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"stretch"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["where ",(0,t.jsx)(n.code,{children:"start"})," means to align to the ",(0,t.jsx)(n.strong,{children:"top"})," of the column, and ",(0,t.jsx)(n.code,{children:"end"})," means to align to the ",(0,t.jsx)(n.strong,{children:"bottom"})," of the column."]}),"\n",(0,t.jsxs)(n.p,{children:["The options for ",(0,t.jsx)(n.code,{children:"justify-self"})," are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"start"}),"\n",(0,t.jsx)(n.li,{children:"end"}),"\n",(0,t.jsx)(n.li,{children:"center"}),"\n",(0,t.jsx)(n.li,{children:"stretch"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["where ",(0,t.jsx)(n.code,{children:"start"})," means to align to the ",(0,t.jsx)(n.strong,{children:"left"})," of the column, and ",(0,t.jsx)(n.code,{children:"end"})," means to align to the ",(0,t.jsx)(n.strong,{children:"right"})," of the column."]})]})}function c(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},7252:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>r});var t=i(959);const s={},l=t.createContext(s);function r(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(l.Provider,{value:n},e.children)}}}]);