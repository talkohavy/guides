---
sidebar_label: '12. Configuration Server'
sidebar_position: 9
---

# Guide For Spring Boot Configuration Server

## 1. Goals

- Externalized
- Environment specific
- Consistent
- Version history
- Real-time management

## 999. Spring Cloud Configuration Server

In this section we will learn about the Spring Cloud Configuration Server, see what it is, what's the model that it operates on, and why you should be using it for micro-services.

So we've looked at property files and profiles, and all those sorts of things, which let you configure your spring boot application, which is great for configuring single applications, but now let's move our focus from single services to multiple micro-services which run together.

So far, the goals we have achieved are:

- ✅ Externalized (using property files)
- ✅ Environment specific (using spring profiles)
- ❌ Consistent ()
- ❌ Version history
- ❌ Real-time management

Consistency is super important in configuration. And even more so in the context of micro-services. Why more? because there's more of them! A whole lot of services running together. You need to make sure that they're all referring to the same configuration values. We want all of them refer to a consistent and reliable configuration values. Now, how do we do that? We certainly can't achieve that by having each micro-service holding its own configuration. So, the obvious answer is... take that out, and create a separate configuration service! Have all this services talk to a separate configuration service, have that be the single source of truth and have that manage all the information.

**Config as a micro-service**

This is a common pattern where you essentially have one service which is responsible for providing your configuration, and all the other micro-services just go ask that one particular service "hey, what's the value of this and that?" and then it provides the service.

The **When** part, of _when_ it asks for the value, can depend. It can be when the application starts up, but that's a different issue falling under the category of _real-time updates_! Real-time updates is a different issue. But at least? it is consistent. There is one source which provides that information. So that why a config server is very popular.

Options for Configuration Server. You have:

- Apache Zookeeper
- ETCD - distributed key-value store
- Hashicorp Consul
- Spring Cloud Configuration Server

Apache Zookeeper is a very popular solution. It's a centralized service for maintaining this configuration information. It also does a lot more! It provides distributed synchronization, it provides naming services, and a whole lot more. Zookeeper is a popular choice for saving this information. You have a zookeeper instance running and all these different services go ask zookeeper for a specific value for a key.

ETCD is another distributed key-value store.

Hashicorp consul is another popular solution which is based off of a data source.

Spring Cloud Configuration Server is the most popular one, specifically in the context of Spring Boot and Spring Cloud, which is what we're going to build throughout this guide.

### - Version History

Spring Cloud config server can connect to various different data sources, but there is one data source which is _extremely_ popular. Remember we talked about version controlled config, right? What is a popular solution for version control store? A git repo! Spring Cloud config server can actually directly connect with a git repo that's hosted somewhere online, either Github, Bitbucket, GitLab, you name it, and so it can directly look up the values of properties on files inside of a git repo which is online. Isn't that cool?

What is the benefit of doing that?

- Skipping the build process
- Simply push new configuration to your git repo
- Get version control free out-of-the-box

### - Getting Started

Go to [start.spring.io](https://start.spring.io/), and choose Maven, Java, name your artifact as `spring-cloud-config-server`, and in the dependencies search for `cloud-config` as your one dependency. Download the project files and open them in your IDE.

In the project you downloaded, you should see a file:

```java title="./src/main/java/SpringCloudConfigServerApplication.java"
package luckylove.springcloudconfigserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringCloudConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringCloudConfigServerApplication.class, args);
	}
}
```

In this one file you're going to add annotation to the class:

```java title="./src/main/java/SpringCloudConfigServerApplication.java"
package luckylove.springcloudconfigserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer; // <--- this one

@SpringBootApplication
@EnableConfigServer // <--- and this one
public class SpringCloudConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringCloudConfigServerApplication.class, args);
	}
}
```

The server is good to go, except... it doesn't know where to pull up the values from. We need to set up the connection with our remote git repo. Open up the file `application.properties`, and change its extension to `.yaml`. Then, fill it like so:

```bash
server:
  port: 8888
spring:
  cloud:
    config:
      server:
        git:
          uri: git@github.com:talkohavy/luckylove-configuration-server.git
          ignoreLocalSshSettings: true
          privateKey: |
            -----BEGIN OPENSSH PRIVATE KEY-----
            ...
            gXA6iFIAq32zE4THCZGCqTU7D1iALGDsbgj
            ...
            -----END OPENSSH PRIVATE KEY-----
```

Now we can start our server! Let's run it:

```bash
mvn spring-boot:run
```

And you should see it running successfully.  
But how do we grab our configurations? What is the url path?

The URL format for fetching a configuration is the following rule:

```bash
http://localhost:<PORT>/<filename>/<profile>
```

For example: `http://localhost:8888/application/default`

Now, the next step is have all your different micro-services consume this configuration from the spring cloud config server. That's what we're going to do in the next section by creating a **Spring Cloud Config Client**.

### - Spring Cloud Config Client

In this section we're gonna create a Spring Cloud configuration client.

So basically what we need to do now is have a micro-service connect to a spring cloud config server, and get the configuration from there, rather than from the traditional way of having a `.env` file.
