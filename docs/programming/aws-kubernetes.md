# AWS kubernetes Cluster Guide

This guide will help you get to a stage where you can see all your kubernetes clusters on AWS.

## 1. Show list of all your AWS profiles

**- Command's form:**

```bash
aws configure list-profiles
```

**- Description:**

List the profiles available to the AWS CLI.  
It would be an empty response if you haven't configured any profiles yet.

**- Response example:**

```bash
default
prod
```

---

## 2. Create/Configure new AWS Profile

**- Command's form**

```bash
aws configure --profile profile_name
```

**- Description:**

Create an AWS profile. You'll be prompted to insert your Access Key and Secret Key, which either have been provided to you, or you created on your own on your AWS account IAM. Also set the region to us-east-1.  
This command will generate 2 files for you locally on your local at:

```bash
cat $HOME/.aws/credentials
cat $HOME/.aws/config
```

An example contents for the `credentials` file is:

```bash
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[user1]
aws_access_key_id=AKIAI44QH8DHBEXAMPLE
aws_secret_access_key=je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
```

An example contents for the `config` file is:

```bash
[default]
region=us-west-2
output=json

[profile user1]
region=us-east-1
output=text
```

**- Usage Example**

You can configure 2 profiles: `default` & `prod`.  
Run the following to configure the `default` profile.

Create the `default` profile:

```bash
aws configure
```

Create the `prod` profile:

```bash
aws configure --profile=<aws_profile_name>
```

---

## 3. Show contents of a specific profile

**- Command's form:**

```bash
aws configure list --profile profile_name
```

**- Description:**

You can also view the contents of the credentials file through a command.
This lists the profile's content:

- access key
- secret key
- region

Those are the configurations used for the specified profile. If you don't specify a `--profile`, the `default` profile is taken.

**- Example Usage:**

Get contents of the `default` profile:

```bash
aws configure list
```

Get contents of a `specific` profile:

```bash
aws configure list --profile profile_name
```

---

# 4. Show list of eks clusters

**- Command's form:**

```bash
aws eks list-clusters --profile profile_name
```

**- Description:**

Lists the Amazon EKS clusters in your Amazon Web Services account in the specified Amazon Web Services Region.

**- Response example:**

```bash
{
  "clusters": []
}
```

---

# 5. Show list of kubernetes contexts

**- Command's form:**

```bash
kubectl config get-contexts
```

**- Description:**

Display a list of all your contexts.

---

# 6. Check your k8s configuration (kubeconfig)

Before we update your kubernetes configuration, let's check what they are.  
Your kubernetes configuration is actually a file, most commonly named as the `kubeconfig`. Let's check out its contents.  
This file exists on your local machine, on path:

```bash
cat $HOME/.kube/config
```

Hence the name, `kubeconfig`.

When no cluster has been configured yet, it's contents are:

```
apiVersion: v1
clusters: null
contexts: null
current-context: ""
kind: Config
preferences: {}
users: null
```

---

# 7. Create or update the kubeconfig file for your cluster

**- Command's form:**

```bash
aws eks --region <region> update-kubeconfig --name <cluster_name> --profile=<aws_profile_name>
```

**- Description:**

Configures `kubectl` so that you can connect to an Amazon EKS cluster. You must have `kubectl` installed and in your PATH environment variable to use the resulting configuration.

**- Response example:**

You should see something like:

```
Added new context arn:aws:eks:us-east-1:743607119258:cluster/luckylove-eks-dev to /Users/tal.kohavy/.kube/config
```

**- Usage Example:**

```bash
aws eks update-kubeconfig --region us-east-1 --name luckylove-eks-dev --profile=prod
```

LuckyLove's clusters are:

| Cluster Name       | Region    |
| ------------------ | --------- |
| luckylove-eks-dev  | us-east-1 |
| luckylove-eks-prod | us-east-1 |

Now let's check that it worked!  
Try to list out k8s contexts once again:

```bash
kubectl config get-contexts
```

You should see the eks cluster has been added.
