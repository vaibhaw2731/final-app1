pipeline {
    agent any
    environment{
      COMMIT_ID = "latest"
      NAMESPACE = "final"
      GIT_URL = "https://github.com/vaibhaw2731/final-app1"
      PROJECT_ID = "payment-platform-204588"
      CLUSTER_NAME = "final-cluster"
      DOCKER_BASE = "gcr.io"
      CLUSTER_ZONE = "us-central1-a"
      SONAR_URL = "http://35.222.169.94:9000/sonar"
      OLD_INGRESS_IP = "35.188.51.172"
      OLD_BASE_URL = "ui.shagun.35.188.51.171.nip.io"
      NEW_INGRESS_IP = "34.67.38.135"
      NEW_BASE_URL = "ui.final.34.67.38.135.nip.io"
      time = "300"
    }
    stages {
         stage("Git clone"){
             steps{
                 cleanWs()
                 git credentialsId: 'GIT_CRED', url: "${GIT_URL}"
             }
          }
        stage('Replace IP in all files') {
             steps{
                  sh "git grep -l ${OLD_INGRESS_IP} | xargs sed -i 's/${OLD_INGRESS_IP}/${NEW_INGRESS_IP}/g'"
                  sh "git grep -l ${OLD_BASE_URL} | xargs sed -i 's/${OLD_BASE_URL}/${NEW_BASE_URL}/g'"
                }
        }
        stage("Maven Clean, Build, Docker Push"){
              steps{ 
                       
                      sh "cd ui && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/${PROJECT_ID}/ui:${COMMIT_ID} && cd .."

                      sh "cd leave && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/${PROJECT_ID}/leave:${COMMIT_ID} && cd .."

                      sh "cd meeting && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/${PROJECT_ID}/meeting:${COMMIT_ID} && cd .."

                      sh "cd notification && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/${PROJECT_ID}/notification:${COMMIT_ID} && cd .."

                      sh "cd organization && ./mvnw -ntp -Pprod verify jib:build -Djib.to.image=${DOCKER_BASE}/${PROJECT_ID}/organization:${COMMIT_ID} && cd .."
                  }   
         }   
         stage("Sonar Ananlysis"){
            steps{
                    withSonarQubeEnv('sonarqube-server') {
                        sh "cd ui && ./mvnw -Pprod clean verify sonar:sonar -Dsonar.host.url=${SONAR_URL} && cd .."

                        sh "cd leave && ./mvnw -Pprod clean verify sonar:sonar -Dsonar.host.url=${SONAR_URL} && cd .."

                        sh "cd meeting && ./mvnw -Pprod clean verify sonar:sonar -Dsonar.host.url=${SONAR_URL} && cd .."

                        sh "cd notification && ./mvnw -Pprod clean verify sonar:sonar -Dsonar.host.url=${SONAR_URL} && cd .."

                        sh "cd organization && ./mvnw -Pprod clean verify sonar:sonar -Dsonar.host.url=${SONAR_URL} && cd .."
                        
                      }
            }
         }
         stage("Deploy"){ 
            steps{
                    sh "gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${CLUSTER_ZONE} --project ${PROJECT_ID}"

                    sh "cd kubernetes && sh kubectl-apply.sh && cd .."

                    sh "kubectl set image deployment.v1.apps/ui ui-app=${DOCKER_BASE}/${PROJECT_ID}/ui:${COMMIT_ID} -n=${NAMESPACE}"

                    sh "kubectl set image deployment.v1.apps/leave leave-app=${DOCKER_BASE}/${PROJECT_ID}/leave:${COMMIT_ID} -n=${NAMESPACE}"

                    sh "kubectl set image deployment.v1.apps/meeting meeting-app=${DOCKER_BASE}/${PROJECT_ID}/meeting:${COMMIT_ID} -n=${NAMESPACE}"

                    sh "kubectl set image deployment.v1.apps/notification notification-app=${DOCKER_BASE}/${PROJECT_ID}/notification:${COMMIT_ID} -n=${NAMESPACE}"

                    sh "kubectl set image deployment.v1.apps/organization organization-app=${DOCKER_BASE}/${PROJECT_ID}/organization:${COMMIT_ID} -n=${NAMESPACE}"
                    sleep time.toInteger()
                }
            
         }
        stage("End2End test"){
             steps{
                    sh 'cd ui && npm run e2e && cd ..'
             }
        }
    }
    post {
        always {
          script {
            googleStorageUpload bucket: 'gs://protractor_test_reports', credentialsId: 'PROTRACTOR_TEST_STORAGE', pattern: 'ui/mocha/reports/mochawesome.json'

            // googleStorageUpload bucket: 'gs://protractor_test_reports', credentialsId: 'PROTRACTOR_TEST_STORAGE', pattern: 'ui/mocha/reports/mochawesome.html'

          }
        }
    }
}
