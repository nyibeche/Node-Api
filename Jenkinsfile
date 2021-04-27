pipeline {
    agent {
        label'master'
    }
    parameters {
        choice(name: 'aws_region', choices: ['us-east-1', 'us-west-2', ''], description: 'AWS region to push to NodeJs tar ball to',)
    }
    stages {
        stage('clone down NodeJs repo') {
            steps {
                git branch: '',
                    credentialsId: '',
                        url: 'git@github.com:nyibeche/Node-Api.git'
        }
    
     }
     stage('Code Quality') {
         steps {
             script {
                 def scannerHome = tool 'testsonarscanner';
                 withSonarQubeEnv = 'testSonarqubeserver'; 
                 sh """
                 ${tool("testsonarscanner")}/bin/sonar-scanner
                 """
             }
         }
        
      }
      stage('NodeJs install') {
         steps {
             sh """
              npm install
              """
         }
      }
      stage('NodeJs Test') {
         steps {
             sh """
              npm test
              """
         }
      }
      stage('NodeJs package as a tar file') {
         steps {
             sh """
              tar cvf $WORKSPACE/nodejs.tar.gz *.json src/ test/
              """
         }
      }
      stage('Push tarFile to s3 bucket') {
         steps {
             sh """
              aws s3 cp $WORKSPACE/nodejs.tar.gz s3://cornel-nodejstodo
              """
         }
      }
    }
}

