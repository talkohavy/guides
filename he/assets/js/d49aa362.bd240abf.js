"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[5229],{9059:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>o,toc:()=>i});var r=s(6070),t=s(5710);const a={},c="Guide For ELK",o={id:"programming/elk",title:"Guide For ELK",description:"Elasticsearch, Logstash & Kibana.",source:"@site/docs/programming/elk.md",sourceDirName:"programming",slug:"/programming/elk",permalink:"/guides/he/docs/programming/elk",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/elk.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- Docker",permalink:"/guides/he/docs/programming/docker"},next:{title:"- Git",permalink:"/guides/he/docs/programming/git"}},l={},i=[{value:"<strong>1. Install Elasticsearch</strong>",id:"1-install-elasticsearch",level:2},{value:"<strong>2. Install Kibana</strong>",id:"2-install-kibana",level:2},{value:"3. Need a new Token for enrollment",id:"3-need-a-new-token-for-enrollment",level:2},{value:"4. Test Connectivity",id:"4-test-connectivity",level:2},{value:"5. Need to create a new password",id:"5-need-to-create-a-new-password",level:2},{value:"6. How to add more nodes",id:"6-how-to-add-more-nodes",level:2}];function d(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"guide-for-elk",children:"Guide For ELK"}),"\n",(0,r.jsx)(n.p,{children:"Elasticsearch, Logstash & Kibana."}),"\n",(0,r.jsx)(n.h2,{id:"1-install-elasticsearch",children:(0,r.jsx)(n.strong,{children:"1. Install Elasticsearch"})}),"\n",(0,r.jsx)(n.p,{children:"First create a docker network:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker network create elastic\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Run ",(0,r.jsx)(n.strong,{children:"elasticsearch"})," server and expose it to the host:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker run --name es01 --net elastic -p 9200:9200 -it --rm -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.2\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Copy the ",(0,r.jsx)(n.strong,{children:"password"}),".",(0,r.jsx)(n.br,{}),"\n","The ",(0,r.jsx)(n.strong,{children:"username"})," is ",(0,r.jsx)(n.code,{children:"elastic"}),".",(0,r.jsx)(n.br,{}),"\n","Copy the ",(0,r.jsx)(n.strong,{children:"Enrollment token"}),"."]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"2-install-kibana",children:(0,r.jsx)(n.strong,{children:"2. Install Kibana"})}),"\n",(0,r.jsx)(n.p,{children:"Start a Kibana container:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker run --name kib01 --net elastic --rm -p 5601:5601 docker.elastic.co/kibana/kibana:8.12.2\n"})}),"\n",(0,r.jsx)(n.p,{children:"Open the link from the logs."}),"\n",(0,r.jsxs)(n.p,{children:["Paste the ",(0,r.jsx)(n.strong,{children:"enrollment token"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Log in to Kibana using ",(0,r.jsx)(n.code,{children:"elastic"})," username with the password."]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"3-need-a-new-token-for-enrollment",children:"3. Need a new Token for enrollment"}),"\n",(0,r.jsxs)(n.p,{children:["You can generate a new ",(0,r.jsx)(n.code,{children:"enrollment token"})," using the following command:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana\n"})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"4-test-connectivity",children:"4. Test Connectivity"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl -k -u elastic:$ELASTIC_PASSWORD https://localhost:9200\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If you want to test connectivity of a secure encrypted connection, you need to copy the ",(0,r.jsx)(n.code,{children:"http_ca.crt"})," SSL certificate from the container to your local machine:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .\n"})}),"\n",(0,r.jsx)(n.p,{children:"Make a REST API call to Elasticsearch to ensure the Elasticsearch container is running."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200\n"})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"5-need-to-create-a-new-password",children:"5. Need to create a new password"}),"\n",(0,r.jsx)(n.p,{children:"You'll always be able to reset your password using:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker exec -it es01 sh\n"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"bin/elasticsearch-reset-password -u elastic\n"})}),"\n",(0,r.jsx)(n.p,{children:"and hit 'Yes' to print it to console."}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"6-how-to-add-more-nodes",children:"6. How to add more nodes"}),"\n",(0,r.jsx)(n.p,{children:"Use an existing node to generate a enrollment token for the new node."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node\n"})}),"\n",(0,r.jsx)(n.p,{children:"Once again, the enrollment token is valid for 30 minutes."}),"\n",(0,r.jsx)(n.p,{children:"Start a new Elasticsearch container. Include the enrollment token as an environment variable."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'docker run -e ENROLLMENT_TOKEN="<token>" --name es02 --net elastic -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.2\n'})}),"\n",(0,r.jsx)(n.p,{children:"Call the cat nodes API to verify the node was added to the cluster."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200/_cat/nodes\n"})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},5710:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>o});var r=s(758);const t={},a=r.createContext(t);function c(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);