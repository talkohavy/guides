"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[8579],{693:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>t,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>l,toc:()=>a});var r=s(6070),o=s(5710);const i={sidebar_label:"13. AWS Kubernetes",sidebar_position:12},c="AWS kubernetes Cluster Guide",l={id:"programming/aws-kubernetes",title:"AWS kubernetes Cluster Guide",description:"This guide will help you get to a stage where you can see all your kubernetes clusters on AWS.",source:"@site/docs/programming/aws-kubernetes.md",sourceDirName:"programming",slug:"/programming/aws-kubernetes",permalink:"/guides/docs/programming/aws-kubernetes",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/aws-kubernetes.md",tags:[],version:"current",sidebarPosition:12,frontMatter:{sidebar_label:"13. AWS Kubernetes",sidebar_position:12}},t={},a=[{value:"1. Show list of all your AWS profiles",id:"1-show-list-of-all-your-aws-profiles",level:2},{value:"2. Create/Configure new AWS Profile",id:"2-createconfigure-new-aws-profile",level:2},{value:"3. Show contents of a specific profile",id:"3-show-contents-of-a-specific-profile",level:2}];function d(e){const n={br:"br",code:"code",h1:"h1",h2:"h2",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"aws-kubernetes-cluster-guide",children:"AWS kubernetes Cluster Guide"}),"\n",(0,r.jsx)(n.p,{children:"This guide will help you get to a stage where you can see all your kubernetes clusters on AWS."}),"\n",(0,r.jsx)(n.h2,{id:"1-show-list-of-all-your-aws-profiles",children:"1. Show list of all your AWS profiles"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure list-profiles\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.p,{children:["List the profiles available to the AWS CLI.",(0,r.jsx)(n.br,{}),"\n","It would be an empty response if you haven't configured any profiles yet."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Response example:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"default\nprod\n"})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"2-createconfigure-new-aws-profile",children:"2. Create/Configure new AWS Profile"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure --profile profile_name\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.p,{children:["Create an AWS profile. You'll be prompted to insert your Access Key and Secret Key, which either have been provided to you, or you created on your own on your AWS account IAM. Also set the region to us-east-1.",(0,r.jsx)(n.br,{}),"\n","This command will generate 2 files for you locally on your local at:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cat $HOME/.aws/credentials\ncat $HOME/.aws/config\n"})}),"\n",(0,r.jsxs)(n.p,{children:["An example contents for the ",(0,r.jsx)(n.code,{children:"credentials"})," file is:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"[default]\naws_access_key_id=AKIAIOSFODNN7EXAMPLE\naws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n\n[user1]\naws_access_key_id=AKIAI44QH8DHBEXAMPLE\naws_secret_access_key=je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY\n"})}),"\n",(0,r.jsxs)(n.p,{children:["An example contents for the ",(0,r.jsx)(n.code,{children:"config"})," file is:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"[default]\nregion=us-west-2\noutput=json\n\n[profile user1]\nregion=us-east-1\noutput=text\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Usage Example"})}),"\n",(0,r.jsxs)(n.p,{children:["You can configure 2 profiles: ",(0,r.jsx)(n.code,{children:"default"})," & ",(0,r.jsx)(n.code,{children:"prod"}),".",(0,r.jsx)(n.br,{}),"\n","Run the following to configure the ",(0,r.jsx)(n.code,{children:"default"})," profile."]}),"\n",(0,r.jsxs)(n.p,{children:["Create the ",(0,r.jsx)(n.code,{children:"default"})," profile:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Create the ",(0,r.jsx)(n.code,{children:"prod"})," profile:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure --profile=<aws_profile_name>\n"})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"3-show-contents-of-a-specific-profile",children:"3. Show contents of a specific profile"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure list --profile profile_name\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsx)(n.p,{children:"You can also view the contents of the credentials file through a command.\nThis lists the profile's content:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"access key"}),"\n",(0,r.jsx)(n.li,{children:"secret key"}),"\n",(0,r.jsx)(n.li,{children:"region"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["Those are the configurations used for the specified profile. If you don't specify a ",(0,r.jsx)(n.code,{children:"--profile"}),", the ",(0,r.jsx)(n.code,{children:"default"})," profile is taken."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Example Usage:"})}),"\n",(0,r.jsxs)(n.p,{children:["Get contents of the ",(0,r.jsx)(n.code,{children:"default"})," profile:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure list\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Get contents of a ",(0,r.jsx)(n.code,{children:"specific"})," profile:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws configure list --profile profile_name\n"})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h1,{id:"4-show-list-of-eks-clusters",children:"4. Show list of eks clusters"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws eks list-clusters --profile profile_name\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsx)(n.p,{children:"Lists the Amazon EKS clusters in your Amazon Web Services account in the specified Amazon Web Services Region."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Response example:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'{\n  "clusters": []\n}\n'})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h1,{id:"5-show-list-of-kubernetes-contexts",children:"5. Show list of kubernetes contexts"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl config get-contexts\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsx)(n.p,{children:"Display a list of all your contexts."}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h1,{id:"6-check-your-k8s-configuration-kubeconfig",children:"6. Check your k8s configuration (kubeconfig)"}),"\n",(0,r.jsxs)(n.p,{children:["Before we update your kubernetes configuration, let's check what they are.",(0,r.jsx)(n.br,{}),"\n","Your kubernetes configuration is actually a file, most commonly named as the ",(0,r.jsx)(n.code,{children:"kubeconfig"}),". Let's check out its contents.",(0,r.jsx)(n.br,{}),"\n","This file exists on your local machine, on path:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cat $HOME/.kube/config\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Hence the name, ",(0,r.jsx)(n.code,{children:"kubeconfig"}),"."]}),"\n",(0,r.jsx)(n.p,{children:"When no cluster has been configured yet, it's contents are:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:'apiVersion: v1\nclusters: null\ncontexts: null\ncurrent-context: ""\nkind: Config\npreferences: {}\nusers: null\n'})}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h1,{id:"7-create-or-update-the-kubeconfig-file-for-your-cluster",children:"7. Create or update the kubeconfig file for your cluster"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws eks --region <region> update-kubeconfig --name <cluster_name> --profile=<aws_profile_name>\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.p,{children:["Configures ",(0,r.jsx)(n.code,{children:"kubectl"})," so that you can connect to an Amazon EKS cluster. You must have ",(0,r.jsx)(n.code,{children:"kubectl"})," installed and in your PATH environment variable to use the resulting configuration."]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Response example:"})}),"\n",(0,r.jsx)(n.p,{children:"You should see something like:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"Added new context arn:aws:eks:us-east-1:743607119258:cluster/luckylove-eks-dev to /Users/tal.kohavy/.kube/config\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Usage Example:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"aws eks update-kubeconfig --region us-east-1 --name luckylove-eks-dev --profile=prod\n"})}),"\n",(0,r.jsx)(n.p,{children:"LuckyLove's clusters are:"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Cluster Name"}),(0,r.jsx)(n.th,{children:"Region"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"luckylove-eks-dev"}),(0,r.jsx)(n.td,{children:"us-east-1"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"luckylove-eks-prod"}),(0,r.jsx)(n.td,{children:"us-east-1"})]})]})]}),"\n",(0,r.jsxs)(n.p,{children:["Now let's check that it worked!",(0,r.jsx)(n.br,{}),"\n","Try to list out k8s contexts once again:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"kubectl config get-contexts\n"})}),"\n",(0,r.jsx)(n.p,{children:"You should see the eks cluster has been added."})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},5710:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>l});var r=s(758);const o={},i=r.createContext(o);function c(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);