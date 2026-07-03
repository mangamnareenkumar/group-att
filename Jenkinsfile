pipeline {
agent any

stages {

    stage('Checkout') {
        steps {
            checkout scm
        }
    }

    stage('Debug Workspace') {
        steps {
            sh '''
            pwd
            ls -la
            find . -maxdepth 2
            '''
        }
    }

    stage('Archive Report') {
        steps {
            archiveArtifacts artifacts: 'semgrep-report.json'
        }
    }
}


}
