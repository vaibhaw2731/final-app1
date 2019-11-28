# final-jhipster

JHipster Application with 4 microservices

## Setup

### Install Java

```
sudo apt update
sudo apt install openjdk-8-jdk
```

### Install Kubernetes

```
sudo apt-get update -y
sudo apt-get install -y apt-transport-https
sudo su -
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
```

###### Write into kubernetes.list (Copy All the lines together)

```
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
```

###### Delete swap memory
```
apt-get update -y
swapoff -a
sed -i '/swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

###### Enable ip tables because master machine and kubernetes cluster machine will talk to each other and also pod to pod commuication will happen with this
		
```
modprobe br_netfilter
sysctl -p 
sudo sysctl net.bridge.bridge-nf-call-iptables=1
```

###### Install Kubernetes and Related Modules
```
apt-get install -y kubelet kubeadm kubectl kubernetes-cni
systemctl daemon-reload
systemctl start kubelet
systemctl enable kubelet.service
```

### Connect to Project

```
gcloud auth login 
gcloud config set project payment-platform-204588
```

### Create GKE Cluster

```
gcloud container clusters create final-cluster  --zone us-central1-a --num-nodes 4 --machine-type n1-standard-2
gcloud container clusters get-credentials final-cluster --zone us-central1-a
```

### Configure Kubernetes Cluseter Engine

```
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user="shagunbandi@gmail.com"
```

###### Get Pod related Info

```
kubectl get pods -n avengers
```

### Install Jenkins

###### 1. Add the Jenkins Debian Repository

```
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

###### 2. Install Jenkins 

```
sudo apt update
sudo apt install jenkins
systemctl status jenkins (Check Status if installed properly or not)
sudo systemctl restart jenkins
```

###### 3. Adjust Firewall - Open port 8080

###### 4. Launch Jenkins

```
http://your_ip_or_domain:8080 
sudo cat /var/lib/jenkins/secrets/initialAdminPassword (Location to Password)
Install suggested Plugins```
```

### Install Docker

###### 1. Install Docker

```
curl -fsSL get.docker.com | /bin/bash 
```

###### 2. Add Jenkins user to docker group

```
sudo usermod -aG docker jenkins 
```

###### 3. Restart Jenkins

```
sudo systemctl restart jenkins
```

### Install Istio and Helm on your local machine

##### 1. Install Helm ( https://github.com/helm/helm ) 

###### Run this script to install helm

```
https://raw.githubusercontent.com/helm/helm/master/scripts/get
```

##### 2. Install Istio

```
wget https://github.com/istio/istio/releases/download/1.0.6/istio-1.0.6-linux.tar.gz
tar xvfz istio-1.0.6-linux.tar.gz 
cd istio-1.0.6
kubectl apply -f install/kubernetes/helm/istio/templates/crds.yaml
kubectl apply -f install/kubernetes/istio-demo.yaml --as=admin --as-group=system:masters
```

###### Get Istio Ingress IP
		
```
kubectl get services -n istio-system ( 34.67.38.135 )
```

### Install Kiali

```
kubectl apply -f configuration.yaml (Find it in the enclosed folder)
```

### Install Elastic GKE Logging

```
GCP -> Kubernetes Engine -> Application -> Elastic GKE logging -> Create New Namespace -> Create
Change the ip to your ip in this file
kubectl apply -f kibana-gateway.yml
```

### Install Node 

```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install nodejs
```

### Install Jhipster

```
npm install -g generator-jhipster
npm install -g yo ( Optional )
```

### Create Jhipster Application from jdl file

```
script.jh ( Find it in the enclosed folder )	
```

### Build and Publish Doocker images
	
##### Run the ./mvnw command in each folder

```
./mvnw -ntp -Pprod  verify jib:build -Djib.to.image=shagunbandi/<Image Name>
```

##### example 

```
cd /home/shagunbandi/project/ui && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=shagunbandi/ui && cd /home/shagunbandi/project/organization && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=shagunbandi/organization && cd /home/shagunbandi/project/leave && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=shagunbandi/leave && cd /home/shagunbandi/project/meeting && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=shagunbandi/meeting && cd /home/shagunbandi/project/notification && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=shagunbandi/notification 
```

### Run Images on Kubernetes

```
gcloud container clusters get-credentials final-cluster --zone us-central1-a
cd kubernetes
kubectl apply -f namespace.yml
kubectl label namespace avengers istio-injection=enabled --overwrite=true
kubectl apply -f ui/	
kubectl apply -f organization/
kubectl apply -f leave/
kubectl apply -f meeting/
kubectl apply -f notification/
kubectl apply -f istio/
```

### Check Deployment Status

```
kubectl get pods -n avengers
```

##### If everything is Running try http://ui.avengers.34.67.38.135.nip.io

### Setup Jenkins

```
Add Plugin 
	Manage Jenkins -> Manage Plugins -> Available -> Kubernetes Continuous Deploy Plugin
Add Maven
	Manage Jenkins -> Global Tool Configuration -> Add Maven
Add Git Credentials
	Credentials -> Add Credentials (next to global) -> Username With Password (Kind), Username and Password, ID = GIT_CRED
Add Docker Password Secret File
	Credentials -> Add Credentials -> Secret Text (Kind) -> ID = DOCKER_CRED
```

# Links

###### Please find the below useful endpoints
	Gateway - http://ui.avengers.34.67.38.135.nip.io
	Zipkin - http://zipkin.istio-system.34.67.38.135.nip.io
	Grafana - http://grafana.istio-system.34.67.38.135.nip.io
	Kiali - http://kiali.istio-system.34.67.38.135.nip.io

# Debug Help

##### 1. You might want to give permission to docker.sock if not working as root user. 

```
sudo chmod 777 /var/run/docker.sock
```

##### 2. Docker Login is required

###### Enter your username and password to login to docker

```
docker login -u <username>
```

##### 3. Delete a Pod

###### Get all pods with default namespace

```
kubectl get pods
```

###### Get all pods with <namespace> namespace

```
kubectl get pods -n <namespace>
```

###### Delete pods <pod-name> with <namespace> namespace

```
kubectl delete pods <pod-name> -n <namespace>
```

##### 3. If Permission Error while creating cluster-admin-role

###### Make sure you are the owner of the project or have enough permissions. You can check that by going to IAM roles.

# Jenkins Pipeline

##### Changes in Depployment Files

###### add parameter 
```
spec > strategy > type: Recreate
spec > template > containers > imagePullPolicy: Always
```

##### This is the pipeline script. change the url, DOCKER_CRED, Docker Username, tagname, project name accordingly.

	pipeline {
	    agent any

	    environment {
		GIT_URL = "https://github.com/manvinirwal/final-jhipster"
		DOCKER_BASE = "shagunbandi"
		BRIDGE = "bridge"
		CLUSTER_NAME = "final-cluster"
		PROJECT_ID = "payment-platform-204588"
		NAMESPACE = "avengers"
		COMMIT_ID = find_commit_id()
	    }
	    stages {

		stage("Git clone"){
		    steps {
			git credentialsId: 'GIT_CRED_MANVI', url: "${GIT_URL}"
		    }
		}

		stage("Maven Clean, Build, Docker Push for UI"){
		    agent { label 'master' }
		    steps{
			withCredentials([string(credentialsId: 'DOCKER_CRED', variable: 'DOCKER_CRED')]) {
			    sh "docker login -u ${DOCKER_BASE} -p ${DOCKER_CRED}"
			}
			sh "cd ui && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/ui:${env.COMMIT_ID} && cd .."
			sh 'cd ui && npm run e2e && cd..'
		    }
		}

		stage("Deploy"){
		    agent { label 'master' }
		    steps {
			sh "gcloud container clusters get-credentials ${CLUSTER_NAME} --zone us-central1-a --project ${PROJECT_ID}"
			sh "cd kubernetes && sh kubectl-apply.sh && cd .."
			sh "kubectl set image deployment.v1.apps/ui ui-app=${DOCKER_BASE}/ui:${env.COMMIT_ID} -n=${NAMESPACE}"
		    }
		}
	    }
	}

	def find_commit_id() {
	    node('master') {
		sh "git rev-parse HEAD > .git/commit-id"
		return readFile('.git/commit-id').trim() 
	    }
	}
