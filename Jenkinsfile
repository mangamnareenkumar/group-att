pipeline {
agent any

stages {

    stage('Checkout') {
        steps {
            checkout scm
        }
    }

    stage('Run Semgrep SAST') {
    steps {
    sh '''
    docker run --rm 
    -v "$PWD:/src" 
    semgrep/semgrep 
    semgrep scan 
    --config auto 
    /src/server /src/web
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
