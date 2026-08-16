pipeline {

    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')

        DOCKER_IMAGE_BACKEND = 'vijayvs6383/student-backend'
        DOCKER_IMAGE_FRONTEND = 'vijayvs6383/student-frontend'

        IMAGE_TAG = "${BUILD_NUMBER}"

        KUBECONFIG = '/var/jenkins_home/.kube/config'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out Student Management application...'
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                echo 'Validating project files...'

                sh '''
                    test -f backend/package.json
                    test -f backend/server.js
                    test -f backend/Dockerfile

                    test -f frontend/index.html
                    test -f frontend/app.js
                    test -f frontend/style.css
                    test -f frontend/nginx.conf
                    test -f frontend/Dockerfile

                    test -f kubernetes/secret.yml
                    test -f kubernetes/mysql-configmap.yml
                    test -f kubernetes/mysql-pvc.yml
                    test -f kubernetes/mysql-deployment.yml
                    test -f kubernetes/mysql-service.yml
                    test -f kubernetes/backend-configmap.yml
                    test -f kubernetes/backend-deployment.yml
                    test -f kubernetes/backend-service.yml
                    test -f kubernetes/frontend-deployment.yml
                    test -f kubernetes/frontend-service.yml
                '''
            }
        }

        stage('Docker Build Backend') {
            steps {
                sh """
                    docker build \
                    -t ${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG} \
                    -t ${DOCKER_IMAGE_BACKEND}:latest \
                    ./backend
                """
            }
        }

        stage('Docker Build Frontend') {
            steps {
                sh """
                    docker build \
                    -t ${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG} \
                    -t ${DOCKER_IMAGE_FRONTEND}:latest \
                    ./frontend
                """
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login \
                    -u "$DOCKERHUB_CREDENTIALS_USR" \
                    --password-stdin
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                sh """
                    docker push ${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE_BACKEND}:latest

                    docker push ${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE_FRONTEND}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f kubernetes/
                '''
            }
        }

        stage('Update Images') {
            steps {
                sh """
                    kubectl set image deployment/student-backend \
                    backend=${DOCKER_IMAGE_BACKEND}:${IMAGE_TAG}

                    kubectl set image deployment/student-frontend \
                    frontend=${DOCKER_IMAGE_FRONTEND}:${IMAGE_TAG}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status deployment/mysql --timeout=180s
                    kubectl rollout status deployment/student-backend --timeout=180s
                    kubectl rollout status deployment/student-frontend --timeout=180s

                    kubectl get pods
                    kubectl get services
                '''
            }
        }
    }

    post {
        success {
            echo 'Student Management POC deployed successfully!'
        }

        failure {
            echo 'Student Management POC pipeline failed.'
        }
    }
}