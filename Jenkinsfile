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
                    set -x

                    echo "===== Current Directory ====="
                    pwd

                    echo "===== Workspace Contents ====="
                    ls -la

                    echo "===== Server Directory ====="
                    ls -la server

                    echo "===== Web Directory ====="
                    ls -la web

                    docker run --rm \
                        -v "$PWD:/src" \
                        semgrep/semgrep \
                        semgrep scan \
                        --config auto \
                        /src/server \
                        /src/web \
                        --verbose
                '''
            }
        }

        stage('Archive Report') {
            steps {
                echo 'Skipping report archive while debugging.'
            }
        }
    }
}
