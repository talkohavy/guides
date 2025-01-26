"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[8774],{9849:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"programming/databases/mongodb","title":"MongoDB","description":"1. Installing mongoDB","source":"@site/docs/programming/databases/mongodb.md","sourceDirName":"programming/databases","slug":"/programming/databases/mongodb","permalink":"/guides/docs/programming/databases/mongodb","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/databases/mongodb.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- ElasticSearch","permalink":"/guides/docs/programming/databases/elasticsearch"},"next":{"title":"- AWS Kubernetes","permalink":"/guides/docs/programming/aws-kubernetes"}}');var a=s(6070),r=s(7010);const t={},i="MongoDB",d={},l=[{value:"1. Installing mongoDB",id:"1-installing-mongodb",level:2},{value:"- A. Run a mongoDB server using docker",id:"--a-run-a-mongodb-server-using-docker",level:3},{value:"- B. Install mongo CLI",id:"--b-install-mongo-cli",level:3},{value:"- C. Connect to your remote server",id:"--c-connect-to-your-remote-server",level:3},{value:"1. Using CLI <code>mongosh</code>",id:"1-using-cli-mongosh",level:4},{value:"2. MongoDB Configuration",id:"2-mongodb-configuration",level:2},{value:"3. Most Used Commands",id:"3-most-used-commands",level:2},{value:"- Way Number 1: Using MQL",id:"--way-number-1-using-mql",level:3},{value:"- Command 1: return the document with the <strong>MAX/MIN HIGHEST SCORE</strong>",id:"--command-1-return-the-document-with-the-maxmin-highest-score",level:4},{value:"- Command 2: return only the records which <strong>FIELD DOES/DOESN&#39;T EXISTS</strong>",id:"--command-2-return-only-the-records-which-field-doesdoesnt-exists",level:4},{value:"- Command 3: Does a field exist, is of type array, and <strong>ARRAY CONTAINS AT LEAST ONE ELEMENT</strong>?",id:"--command-3-does-a-field-exist-is-of-type-array-and-array-contains-at-least-one-element",level:4},{value:"- Command 4: <strong>COUNT HOW MANY</strong> records are there that answer QUERY",id:"--command-4-count-how-many-records-are-there-that-answer-query",level:4},{value:"- Command 5: return documents which FIELD IS NOT EQUAL TO some value",id:"--command-5-return-documents-which-field-is-not-equal-to-some-value",level:4},{value:"- Command 6: return documents and PROJECT ONLY SOME FIELDS",id:"--command-6-return-documents-and-project-only-some-fields",level:4},{value:"- Command 1: <strong>ADD NEW FIELD</strong> to one/many/all documents",id:"--command-1-add-new-field-to-onemanyall-documents",level:4},{value:"- Command 2: <strong>DELETE AN EXISTING FIELD</strong> from all (similar to MySql&#39;s DROP COLUMN)",id:"--command-2-delete-an-existing-field-from-all-similar-to-mysqls-drop-column",level:4},{value:"- Command 3: <strong>ADD SUB-DOCUMENT TO ARRAY</strong> field",id:"--command-3-add-sub-document-to-array-field",level:4},{value:"- Command 4: <strong>DELETE SUB-DOCUMENT FROM ARRAY</strong> field",id:"--command-4-delete-sub-document-from-array-field",level:4},{value:"- Way Number 2: Using Aggregation Pipelines",id:"--way-number-2-using-aggregation-pipelines",level:3},{value:"- Command 1: ...",id:"--command-1-",level:4},{value:"- Command 1: Set field equal to another field",id:"--command-1-set-field-equal-to-another-field",level:4},{value:"- Command 2: Unset a field",id:"--command-2-unset-a-field",level:3},{value:"- Command 3: Update a specific object inside an array field",id:"--command-3-update-a-specific-object-inside-an-array-field",level:3},{value:"- Part 1: <code>$[&lt;identifier&gt;]</code>",id:"--part-1-identifier",level:3},{value:"- Part 2: arrayFilters",id:"--part-2-arrayfilters",level:3}];function c(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"mongodb",children:"MongoDB"})}),"\n",(0,a.jsx)(n.h2,{id:"1-installing-mongodb",children:"1. Installing mongoDB"}),"\n",(0,a.jsx)(n.h3,{id:"--a-run-a-mongodb-server-using-docker",children:"- A. Run a mongoDB server using docker"}),"\n",(0,a.jsx)(n.p,{children:"Go to the Official Image of mongo:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.a,{href:"https://hub.docker.com/_/mongo",children:"https://hub.docker.com/_/mongo"})}),"\n",(0,a.jsx)(n.p,{children:'In the "How to use this image" section, you\'ll see the following command:'}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"docker run --name mongo -d -p 27017:27017 mongo:6\n"})}),"\n",(0,a.jsx)(n.p,{children:"Or with a password:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"docker run --name mongo -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo\n"})}),"\n",(0,a.jsx)(n.p,{children:'where "my-local-mongo" is the name to your container, and 6 is the tag.'}),"\n",(0,a.jsxs)(n.p,{children:["You now should have a container running a ",(0,a.jsx)(n.strong,{children:"MongoDB server"})," listening on the standard MongoDB port ",(0,a.jsx)(n.strong,{children:"27017"}),"."]}),"\n",(0,a.jsx)(n.p,{children:"You can check its logs using:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"docker logs mongo\n"})}),"\n",(0,a.jsx)(n.p,{children:"Or you can ssh into it using:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"docker exec -it mongo bash\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"info",children:(0,a.jsxs)(n.p,{children:["You can also be using ",(0,a.jsx)(n.strong,{children:"MongoDB Atlas"}),", which gives you your own personal remote mongoDB server for free."]})}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h3,{id:"--b-install-mongo-cli",children:"- B. Install mongo CLI"}),"\n",(0,a.jsxs)(n.p,{children:["You first need to install your ",(0,a.jsx)(n.strong,{children:"mongo cli"})," tool."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"- MacOS:"})}),"\n",(0,a.jsxs)(n.p,{children:["Use ",(0,a.jsx)(n.code,{children:"homebrew"})," to install (the official recommended way):"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"brew install mongocli\n"})}),"\n",(0,a.jsxs)(n.p,{children:["You now have access to the global command ",(0,a.jsx)(n.code,{children:"mongosh"}),"."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"- Windows:"})}),"\n",(0,a.jsxs)(n.p,{children:["Go to: ",(0,a.jsx)(n.a,{href:"https://www.mongodb.com/docs/mongocli/current/",children:"https://www.mongodb.com/docs/mongocli/current/"})]}),"\n",(0,a.jsxs)(n.p,{children:["And hit ",(0,a.jsx)(n.strong,{children:"Install MongoDB CLI"}),", then hit the ",(0,a.jsx)(n.strong,{children:"Download"})," button."]}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h3,{id:"--c-connect-to-your-remote-server",children:"- C. Connect to your remote server"}),"\n",(0,a.jsx)(n.p,{children:"To connect to your remote database, you can type one of two commands; One which includes your password, and one that isn't."}),"\n",(0,a.jsxs)(n.h4,{id:"1-using-cli-mongosh",children:["1. Using CLI ",(0,a.jsx)(n.code,{children:"mongosh"})]}),"\n",(0,a.jsx)(n.p,{children:"In your terminal, run the following command:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'mongosh "mongodb://localhost:27017"\n'})}),"\n",(0,a.jsx)(n.p,{children:"Or if you have a password:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"mongosh --host localhost:27017 --username mongoadmin --password secret --authenticationDatabase admin\n"})}),"\n",(0,a.jsx)(n.p,{children:"All of the below work:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"mongosh localhost:27017\nmongosh mongodb://localhost:27017\nmongosh --host localhost --port 27017\nmongosh --host localhost:27017\nmongosh --host 127.0.0.1 --port 27017\n"})}),"\n",(0,a.jsx)(n.p,{children:"You should see the following output:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"Current Mongosh Log ID:\t67909697207e4a089faba1d2\nConnecting to:\t\tmongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3\n(node:56199) ExperimentalWarning: CommonJS module /opt/homebrew/Cellar/mongosh/2.3.3/libexec/lib/node_modules/@mongosh/cli-repl/node_modules/@mongodb-js/devtools-proxy-support/dist/fetch.js is loading ES Module /opt/homebrew/Cellar/mongosh/2.3.3/libexec/lib/node_modules/@mongosh/cli-repl/node_modules/node-fetch/src/index.js using require().\nSupport for loading ES Module in require() is an experimental feature and might change at any time\n(Use `node --trace-warnings ...` to show where the warning was created)\nUsing MongoDB:\t\t6.0.20\nUsing Mongosh:\t\t2.3.3\n\nFor mongosh info see: https://www.mongodb.com/docs/mongodb-shell/\n\n------\n   The server generated these startup warnings when booting\n   2025-01-22T06:56:17.488+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem\n   2025-01-22T06:56:18.084+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted\n   2025-01-22T06:56:18.084+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never' in this binary version\n   2025-01-22T06:56:18.084+00:00: vm.max_map_count is too low\n------\n\ntest>\n"})}),"\n",(0,a.jsx)(n.p,{children:"You should now be able to run mongodb commands."}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"2-mongodb-configuration",children:"2. MongoDB Configuration"}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h2,{id:"3-most-used-commands",children:"3. Most Used Commands"}),"\n",(0,a.jsx)(n.h3,{id:"--way-number-1-using-mql",children:"- Way Number 1: Using MQL"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:(0,a.jsx)("font",{size:"4",children:"-- How to Query:"})})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-1-return-the-document-with-the-maxmin-highest-score",children:["- Command 1: return the document with the ",(0,a.jsx)(n.strong,{children:"MAX/MIN HIGHEST SCORE"})]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'db.users.find({},{ _id: 0, userID: 1}).sort({"userID": -1}).limit(1)\n'})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-2-return-only-the-records-which-field-doesdoesnt-exists",children:["- Command 2: return only the records which ",(0,a.jsx)(n.strong,{children:"FIELD DOES/DOESN'T EXISTS"})]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.find({ myField: { $exists : true } })\n"})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-3-does-a-field-exist-is-of-type-array-and-array-contains-at-least-one-element",children:["- Command 3: Does a field exist, is of type array, and ",(0,a.jsx)(n.strong,{children:"ARRAY CONTAINS AT LEAST ONE ELEMENT"}),"?"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.find({ myArray : { $elemMatch : { $exists : true } } })\n"})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-4-count-how-many-records-are-there-that-answer-query",children:["- Command 4: ",(0,a.jsx)(n.strong,{children:"COUNT HOW MANY"})," records are there that answer QUERY"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.find({<query>}).count()\n"})}),"\n",(0,a.jsx)(n.h4,{id:"--command-5-return-documents-which-field-is-not-equal-to-some-value",children:"- Command 5: return documents which FIELD IS NOT EQUAL TO some value"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.find({ userID: { $ne: 1 }})\n"})}),"\n",(0,a.jsx)(n.h4,{id:"--command-6-return-documents-and-project-only-some-fields",children:"- Command 6: return documents and PROJECT ONLY SOME FIELDS"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.find({} , { _id: 0, userID: 1, nickname: 1, email: 1 })\n"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:(0,a.jsx)("font",{size:"4",children:"-- How to Update:"})})}),"\n",(0,a.jsx)(n.p,{children:"When you don't want to use other fields values as reference, you can use this simple MQL operations, that don't include an aggregation pipeline."}),"\n",(0,a.jsxs)(n.h4,{id:"--command-1-add-new-field-to-onemanyall-documents",children:["- Command 1: ",(0,a.jsx)(n.strong,{children:"ADD NEW FIELD"})," to one/many/all documents"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'db.users.updateMany( { } ,{ $set: { newField: "defaultValue" } } )\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsx)(n.p,{children:"NOTE! If the field already exists, it overrides its contents."})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-2-delete-an-existing-field-from-all-similar-to-mysqls-drop-column",children:["- Command 2: ",(0,a.jsx)(n.strong,{children:"DELETE AN EXISTING FIELD"})," from all (similar to MySql's DROP COLUMN)"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'db.grades.updateMany( { studentID: 1 , classID: 460 } , { $unset: { arr1: "" , arr2: "" } } )\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsx)(n.p,{children:"NOTE! If the field doesn't exist? updateMany does nothing."})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-3-add-sub-document-to-array-field",children:["- Command 3: ",(0,a.jsx)(n.strong,{children:"ADD SUB-DOCUMENT TO ARRAY"})," field"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.updateMany( { userID: 1 } , { $addToSet: { iWatched: { userID:306, ...values } } } )\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["NOTE! The ",(0,a.jsx)(n.code,{children:"$addToSet"})," doesn't really apply to an array containing sub-documents, in the sense that it will allow inserting a new sub-document with the same values."]})}),"\n",(0,a.jsxs)(n.h4,{id:"--command-4-delete-sub-document-from-array-field",children:["- Command 4: ",(0,a.jsx)(n.strong,{children:"DELETE SUB-DOCUMENT FROM ARRAY"})," field"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.updateMany( { userID: 1 } , { $pull: { iWatched: { userID: 306 } } } )\n"})}),"\n",(0,a.jsx)(n.hr,{}),"\n",(0,a.jsx)(n.h3,{id:"--way-number-2-using-aggregation-pipelines",children:"- Way Number 2: Using Aggregation Pipelines"}),"\n",(0,a.jsxs)(n.p,{children:["When you ",(0,a.jsx)(n.strong,{children:"NEED"})," to use other fields values as reference, you can use an aggregation pipeline MQL update operations. Though their names are the same (like $set and $unset), they work differently when inside a regular update or an aggregation pipeline update."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:(0,a.jsx)("font",{size:"4",children:"-- How to Query:"})})}),"\n",(0,a.jsx)(n.h4,{id:"--command-1-",children:"- Command 1: ..."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"...\n"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:(0,a.jsx)("font",{size:"4",children:"-- How to Update:"})})}),"\n",(0,a.jsx)(n.h4,{id:"--command-1-set-field-equal-to-another-field",children:"- Command 1: Set field equal to another field"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"$set"})," works exactly the same as it is in normal MQL update, only now you can use other fields values as references."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.updateMany(\n  {\n    userID: 354,\n  },\n  [\n    {\n      $set: {\n        'myPrefs.turnsMeOn': '$myDetails.turnsMeOn',\n        'myPrefs.inPurposeOf': '$myDetails.inPurposeOf',\n    },\n  },\n])\n"})}),"\n",(0,a.jsx)(n.h3,{id:"--command-2-unset-a-field",children:"- Command 2: Unset a field"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"$unset"})," works differently in aggregation than in normal MQL update. If you try to apply ",(0,a.jsx)(n.code,{children:"$unset"})," as its form in the normal MQL update within an aggregation update, you would get an error saying:"]}),"\n",(0,a.jsxs)(n.blockquote,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"$unset"})," specification must be a string or an array"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"The proper way of applying $unset in an aggregation pipeline update is either by giving it a string with the field's name to unset, or an array of names in case there's more than 1 field you'd like to unset:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.updateMany(\n{\n  userID: 354,\n},\n[\n  {\n    $unset: ['myDetails.turnsMeOn', 'myDetails.inPurposeOf']\n  }\n])\n"})}),"\n",(0,a.jsx)(n.h3,{id:"--command-3-update-a-specific-object-inside-an-array-field",children:"- Command 3: Update a specific object inside an array field"}),"\n",(0,a.jsx)(n.p,{children:"The full form:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"db.users.updateMany(\n  {\n    userID: 354,\n  },\n  {\n    $set: {\n      'messages.$[i].msgReadOnUnix': 1652348270,\n  },\n  {\n    arrayFilters: [\n      {\n        $and: [\n          { 'i.senderID': 306 },\n          { 'i.msgReadOnUnix': -1 },\n        ]\n      }\n    ]\n  }\n)\n"})}),"\n",(0,a.jsx)(n.p,{children:"Explanation on how to use:"}),"\n",(0,a.jsxs)(n.h3,{id:"--part-1-identifier",children:["- Part 1: ",(0,a.jsx)(n.code,{children:"$[<identifier>]"})]}),"\n",(0,a.jsx)(n.p,{children:"To achieve this, we use a normal MQL update, along with the familiar $set operation, only with a little twist. To reference an array cell, we need to use a special syntax of $[IDENTIFIER]."}),"\n",(0,a.jsx)(n.p,{children:"Like so:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-mongo",children:"$set: { '<array>.$[<identifier>].fieldName': some-value }\n"})}),"\n",(0,a.jsx)(n.h3,{id:"--part-2-arrayfilters",children:"- Part 2: arrayFilters"}),"\n",(0,a.jsxs)(n.p,{children:["In the third object parameter of the update operator, we provide an ",(0,a.jsx)(n.code,{children:"arrayFilters"}),". ",(0,a.jsx)(n.code,{children:"arrayFilters"})," is a special operator, that contains the conditions that would help determine which object inside the array are going to be updated. arrayFilters has a complex behavior, so in order to learn how to use it we need to discuss its rules, and how it behaves."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"-- ARRAY FILTER RULES"})}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Must be an array\n",(0,a.jsx)(n.code,{children:"arrayFilters"})," is followed by an array structure --\x3e ",(0,a.jsx)(n.code,{children:"arrayFilters: []"})]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:['A single filter - an object inside the array\nThe array of arrayFilters contains objects which are filters. Now you must be thinking "Oh! Each object inside the array must be a filter in the sense that a filter means a single condition, that together have a relation of AND". Well... then no. Each object inside the array is a ',(0,a.jsx)(n.strong,{children:"reference to exactly one array"}),". What does it mean? Consider a case where you have an array of objects, and an object in that array contains another array within. MongoDB gives you a way to filter within that inner array! And that can be done by providing a ",(0,a.jsx)(n.strong,{children:"first"})," filter object that would filter by the first array, and a ",(0,a.jsx)(n.strong,{children:"second"})," filter object that would filter by the second array. In 99% percent of cases, you would have an arrayFilters that contains only 1 object in its top level. So now we know that the array of arrayFilters contains filter objects, that each object is a reference to an array in accordance to the level, and that in most cases we would only really need one filter for one top level array."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"AND"})," relation between ",(0,a.jsx)(n.strong,{children:"different"})," fields\nTo get an ",(0,a.jsx)(n.strong,{children:"AND"})," relation effect between ",(0,a.jsx)(n.strong,{children:"different"})," inner fields, we simply add them one after another, line by line, like so:"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"arrayFilters: [{\n  'i.userID': 306,\n  'i.lastUpdated': { $lt: 555 }\n}]\n"})}),"\n",(0,a.jsx)(n.admonition,{type:"warning",children:(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"WARNING!"}),(0,a.jsx)(n.br,{}),"\n","This implicit way of writing the AND relation can cause issues if you're using the ",(0,a.jsx)(n.strong,{children:"same"})," field name twice!"]})}),"\n",(0,a.jsx)(n.p,{children:"In the example above, it is implied that we wish for an AND relation. We ask for userID 306 AND lastUpdated before 555. Even though the AND form has a default mode, you can always mention it explicitly:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"arrayFilters: [{\n  $and: [\n    { 'i.userID': 306 },\n    { 'i. lastUpdated':{ $lt: 555 }}\n}]\n"})}),"\n",(0,a.jsx)(n.p,{children:"Notice how many more notes need to be added to get the same result!"}),"\n",(0,a.jsxs)(n.ol,{start:"4",children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"AND"})," relation for the same key - duplicate key appearance"]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["We saw that the filter in its default mode obscures an AND operation behind it, and that the filter has an object-like structure. Since the filter object is an object, a key ",(0,a.jsx)(n.strong,{children:"CANNOT"})," appear twice! It's not an error if it does, it's just that the last appearance of a key would override its predecessors."]}),"\n",(0,a.jsx)(n.p,{children:"Let's see an example:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"arrayFilters: [{\n  'i.userID': 306,\n  'i.userID': 304,\n  'i.userID':{ $lt: 2 }\n}]\n"})}),"\n",(0,a.jsx)(n.p,{children:"In the example above, only the third one would be taken into account."}),"\n",(0,a.jsxs)(n.ol,{start:"5",children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"OR"})," relation between ",(0,a.jsx)(n.strong,{children:(0,a.jsx)(n.em,{children:"all"})})," fields"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"To get the effect of an OR relation, you must use the explicit way, like so:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"To get the effect of an OR relation, you must use the explicit way, like so:\narrayFilters: [{\n  $or: [\n    { 'i.userID': 306 },\n    { 'i. lastUpdated':{ $lt: 555 }}\n}]\n"})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},7010:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>i});var o=s(758);const a={},r=o.createContext(a);function t(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);