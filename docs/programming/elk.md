---
sidebar_label: '99. ELK'
sidebar_position: 98
---

# Guide For ELK

Elasticsearch, Logstash & Kibana.

## **1. Install Elasticsearch**

First create a docker network:

```bash
docker network create elastic
```

Run **elasticsearch** server and expose it to the host:

```bash
docker run --name es01 --net elastic -p 9200:9200 -it --rm -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.2
```

Copy the **password**.  
The **username** is `elastic`.  
Copy the **Enrollment token**.

---

## **2. Install Kibana**

Start a Kibana container:

```bash
docker run --name kib01 --net elastic --rm -p 5601:5601 docker.elastic.co/kibana/kibana:8.12.2
```

Open the link from the logs.

Paste the **enrollment token**.

Log in to Kibana using `elastic` username with the password.

---

## 3. Need a new Token for enrollment

You can generate a new `enrollment token` using the following command:

```bash
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

---

## 4. Test Connectivity

```bash
curl -k -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

If you want to test connectivity of a secure encrypted connection, you need to copy the `http_ca.crt` SSL certificate from the container to your local machine:

```bash
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
```

Make a REST API call to Elasticsearch to ensure the Elasticsearch container is running.

```bash
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

---

## 5. Need to create a new password

You'll always be able to reset your password using:

```bash
docker exec -it es01 sh
```

```bash
bin/elasticsearch-reset-password -u elastic
```

and hit 'Yes' to print it to console.

---

## 6. How to add more nodes

Use an existing node to generate a enrollment token for the new node.

```bash
docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node
```

Once again, the enrollment token is valid for 30 minutes.

Start a new Elasticsearch container. Include the enrollment token as an environment variable.

```bash
docker run -e ENROLLMENT_TOKEN="<token>" --name es02 --net elastic -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.12.2
```

Call the cat nodes API to verify the node was added to the cluster.

```bash
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200/_cat/nodes
```
