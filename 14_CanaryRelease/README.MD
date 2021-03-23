# Canary Release 

## Guidelines
1. Deploy Ingress Controller

https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml
```

2. Verify controller is installed

```
kubectl get pods -n ingress-nginx
```

3. Deploying local registry: https://docs.docker.com/registry/deploying/

```
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

4. Build Docker image

```
cd src
docker build -f Dockerfile -t local:canaryapi .
```

5. Push Docker image to local registry

```
docker tag local/canaryapi localhost:5000/canaryapi
docker push  localhost:5000/canaryapi
```

6. Verify image is published

```
curl http://localhost:5000/v2/_catalog
curl http://localhost:5000/v2/canaryapi/tags/list
```

7. Update local domain (alternative use DNS server)

```
# sudo vi /etc/hosts
127.0.0.1 forest.local
```

8. Deploy version 1

```
kubectl apply -f deployment.yaml
curl forest.local
```

9. Deploy version 2

```
kubectl apply -f deployment-release.yaml
curl forest.local # Run this few times.
```

## Notes

1. Port forward request to cluster application (useful for debugging)

https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/

```
kubectl port-forward deployment/canaryrelease-deployment -n canaryrelease 3000:3000
```


