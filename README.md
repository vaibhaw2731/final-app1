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

### Configure Kubernetes Cluster Engine

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

### Install Google Chrome

```
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update 
sudo apt-get install google-chrome-stable
```

### Install Chrome Driver

```
sudo apt-get update
sudo apt-get install -y unzip xvfb libxi6 libgconf-2-4
wget https://chromedriver.storage.googleapis.com/78.0.3904.70/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/bin/chromedriver
sudo chown root:root /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver
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


# Sonar-server instance

## Setup

### 1. Perform a system update

```
   sudo apt-get update
   sudo apt-get -y upgrade
```

### 2. Install jdk

```
   sudo apt-get install default-jdk
```

### 3. Install and configure PostgreSQL

   - Install the PostgreSQL repository

   ```
       sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
       wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
   ```

   - Install the PostgreSQL database server by running

   ```
       sudo apt-get -y install postgresql postgresql-contrib
   ```

   - Start PostgreSQL server and enable it to start automatically at boot time by running

   ```
       sudo systemctl start postgresql
       sudo systemctl enable postgresql
   ```

   - Change the password for the default PostgreSQL use
   	
   ```
    	sudo passwd postgres
   ```
     
   - Switch to the postgres user
    
   ```
       su - postgres
   ```

   - Create a new user by typing
    
   ```
     createuser sonar
   ```

   - Switch to the PostgreSQL shell
    
   ```
       psql
   ```

   - Set a password for the newly created user for SonarQube database
    
   ```
        ALTER USER sonar WITH ENCRYPTED password 'P@ssword';
   ```

   - Create a new database for PostgreSQL database by running
    
   ```
        CREATE DATABASE sonar OWNER sonar;
   ```

   - Exit from the psql shell
    
   ```
        \q
   ```

   - Switch back to the sudo user by running the exit command
    
   ```
        exit
   ```

### 4. Download and configure SonarQube

   - Download the SonarQube installer files archive
    
   ```
        wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.3.zip
   ```

   - Install unzip by running
    
   ```
        apt-get -y install unzip
   ```

   - Unzip the archive using the following command
    
   ```
        sudo unzip sonarqube-7.3.zip -d /opt
   ```

   - Rename the directory
    
   ```
        sudo mv /opt/sonarqube-7.3 /opt/sonarqube
   ```

   - Add a sonar user

   ```
        adduser <name of user>    e.g; adduser sonaradmin
   ```

   - Add a password
    
   ```
        passwd
   ```
   - Assign permissions to sonar user(sonaradmin) for directory /opt/sonarqube
       
   ```
        sudo chown -R sonaradmin:sonaradmin /opt/sonarqube/
   ```

   - Open the SonarQube configuration file using any text editor
       
   ```
        sudo nano /opt/sonarqube/conf/sonar.properties
   ```

   - Find the following lines
    
   ```
         #sonar.jdbc.username=
         #sonar.jdbc.password=
   ```

   - Uncomment and provide the PostgreSQL username and password of the database that we have created earlier. It should look like
    
   ```
         sonar.jdbc.username=sonar
         sonar.jdbc.password=P@ssword
   ```

   - Find and uncomment the below line
    
   ```
        #sonar.jdbc.url=jdbc:postgresql://localhost/sonar
   ```

   - Finally, tell SonarQube to run in server mode
    
   ```
       sonar.web.javaAdditionalOpts=-server
   ```

   - Uncomment these lines
    
   ```
        sonar.web.host=0.0.0.0     (By default, ports will be used on all IP addresses associated with the server)
        sonar.web.context=/sonar   (sonar-server will be accessed as http://ip:9000/sonar)
        sonar.web.port=9000        (deafault value is 9000)
   ```

   - save the file and exit from the editor


### 5. Configure Systemd service

   - SonarQube can be started directly using the startup script provided in the installer package. As a matter of convenience, 
     we will setup a Systemd unit file for SonarQube

   - open sonar.service file

   ```
       sudo nano /etc/systemd/system/sonar.service
   ```

   - Populate the file with
   
   ```
      [Unit]
      Description=SonarQube service
      After=syslog.target network.target

      [Service]
      Type=forking

      ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
      ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop

      User=sonaradmin   (sonar user which we created)
      Group=sonaradmin
      Restart=always

      [Install]
      WantedBy=multi-user.target

   ```

   - Start the application by running

   ```
        sudo systemctl start sonar
   ```

   - Enable the SonarQube service to automatically start at boot time
    
   ```
        sudo systemctl enable sonar
   ```

   - To check if the service is running, run
    
   ```
        sudo systemctl status sonar
   ```

### 6. Accessing Sonarqube Server 

   - http://server_domain_name:9000/sonar
    

### 7. Integrating sonarqube with Jenkins (Assumed Jenkins is up and running)
    
   - Install sonarqube scanner for jenkins
    
   ```
       Jenkins -> Manage Jenkins -> Manage Plugins -> Available -> search for SonarQube Scanner for Jenkins and install it
   ```

   - Configuring Jenkins to connect with sonar server
    
   ```
       Jenkins -> Manage Jenkins -> Configure System -> Sonarque servers
         -> Name:       sonarqube-server
         -> Server Url: http://server_domain_name:9000/sonar/projects
         -> Server authentication token:
              -> For server authentication token, login as admin in sonarqube server(user:admin && password:admin) and generate a server-token
                 by clicking on security. Copy that token and save as secret text in your jenkins credentials.
   ```

   - Configuring Sonarqube scanner installations
    
   ```
        Jenkins -> Manage Jenkins -> Global Tool Configuration -> Sonarqube Scanner  (Install sonarqube in /opt/sonarqube on sonar-instance)
          -> Name: sonar-scanner-4.2.0.1873 -linux (name of sonar scanner u downloaded)
          -> SONAR_RUNNER_HOME: /opt/sonarqube/
   ```

### 8. Dowmload XML plugin in sonarqube server to print Xml report as well

   - Login as admin on sonarqube server -> Administration -> Market Place -> Available
   - Install Jacoco(JaCoCo XML report importer)

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

##### Changes in Deployment Files

###### add parameter 
```
spec > strategy > type: Recreate
spec > template > containers > imagePullPolicy: Always
```

# For running protractor cases

### Change in protractor conf file

From the base project directory
```
cd ui\src\test\javascript
```

Open **protractor.conf.js** file

Under **capabilities** change it to

```
	browserName: 'chrome',
    chromeOptions: {
		binary: <google-chrome-stable location>,   (In our case, "/usr/bin/google-chrome-stable") 
        args:[ '--headless', '--disable-gpu', '--window-size=800,600', '--disable-gpu', '--window-size=800,600','--no-sandbox','--disable-dev-shm-usage' ]
    }
```

In **base url** mention the url of your application

```
<app-name>.<namespace>.<ingress-ip>.nip.io (In our case 'http://ui.shagun.35.188.51.171.nip.io/')
```

### To generate and upload protractor reports on google storage.

#### 1. Install mochawesome reporter inside your react project repository

```
npm install --save-dev mocha mochawesome mochawesome-merge mochawesome-report-generator
```

#### 2. Add mocha reporter configuartion to your protrcator.conf.js file

```
cd 
mochaOpts: {
		     reporter: "mochawesome",
		     reporterOptions: {
		       reportDir: "mocha/reports",
		       overwrite: true,
		       html: true,
		       json: true
		    }
       }
```
#### 3. To uplaod report on google storage

   - To enable cloud storage and Google cloud storage json APIs

```
Navigation menu->API & services-> libray->search for APIs->enable
```

   - To create credential so that u can acces ur cloud resouces in jenkins pipeline

```
Navigation menu->API & services->credentials->create credential->service account key->select compute engine default service account->choose json format->create
```

   - To create bucket

```
Storage ->create bucket->give unique name to ur bucket->save
```

#### 4. To configure ur jenkins server

##### To update jackson2-api plgugin to 2.10.1-rc98.daee086b15cf version or greater than 2.10.0

   - download plugin upi file from the given link:https://mvnrepository.com/artifact/org.jenkins-ci.plugins/jackson2-api/2.10.1-rc98.daee086b15cf
   - Go to Manage Jenkins->Manage Plugins-> Advanced -> upload upi file->restart jenkins
      ->Install Google Cloud Storage plugin in jenkins

#### 5. To upload report to bucket

   - Write following code in jenkinfile after stages block

```
post {
	        always {
			          script {
			            googleStorageUpload bucket: 'gs://protractor_test_reports', credentialsId: 'PROTRACTOR_TEST_STORAGE', pattern: 'ui/mocha/reports/mochawesome.json'

			            // googleStorageUpload bucket: 'gs://protractor_test_reports', credentialsId: 'PROTRACTOR_TEST_STORAGE', pattern: 'ui/mocha/reports/mochawesome.html'

			          }
	        }
    	}
```


