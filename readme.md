# Steps

Create Docker image
Create Pods using deployment
create service for networking for all pods
Skaffold - to handle change inside Infraction and code

To Access From Outside World
There are mainly 3 common approaches:

1. NodePort
2. LoadBalancer
3. Ingress Controller (Nginx Ingress)

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/cloud/deploy.yaml
