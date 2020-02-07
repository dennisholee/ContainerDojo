


Load the workstation's ssh public key to the ansible docker instance to enable ansible to connect to GCE via ssh.

```
docker run -it -v $(pwd)/kube-cluster:/kube-cluster -v /Users/dennislee/.ssh:/root/.ssh --net host dennis:ansible bash
```

Use the workstation's ssh key to connect to the GCP compute instances that was created by the Terraform script.

```
ansible all -i /kube-cluster/hosts -m ping -u dennislee
worker2 | SUCCESS => {
    "changed": false, 
    "ping": "pong"
}
worker1 | SUCCESS => {
    "changed": false, 
    "ping": "pong"
}
master | SUCCESS => {
    "changed": false, 
    "ping": "pong"
}
```


Install docker

```
ansible-playbook -i /kube-cluster/hosts /kube-cluster/docker-dependencies.yml 
```

Install kubernetes

```sh
ansible-playbook -i /kube-cluster/hosts /kube-cluster/kube-dependencies.yml
```

# Useful commands

```sh
# Start dummy container
kubectl run -i --tty busybox --image=busybox --restart=Never -- sh

# Restart / refresh deployments
kubectl scale deployment <deployment_name> --replicas 0 -n <namespace>
kubectl scale deployment <deployment_name> --replicas <number> -n <namespace>
```

# Network Policies

## Deny all ingress

```yaml
# network-ingress-deny-all.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

```
kubectl -f network-ingress-deny-all.yaml
kubectl get networkpolicy
```



# Troubleshooting

## DNS Resolution

```sh`
kubectl get pods -o wide -n kube-system
NAME                                 READY   STATUS    RESTARTS   AGE   IP            NODE           NOMINATED NODE   READINESS GATES
coredns-6955765f44-jcwtj             1/1     Running   0          56m   10.244.0.3    k8s-master     <none>           <none>
coredns-6955765f44-sdlfh             1/1     Running   0          56m   10.244.0.2    k8s-master     <none>           <none>

kubectl scale deployments coredns --replicas 0 -n kube-system

kubectl scale deployments coredns --replicas 2 -n kube-system

kubectl get pods -o wide -n kube-system
NAME                                 READY   STATUS    RESTARTS   AGE   IP            NODE           NOMINATED NODE   READINESS GATES
coredns-6955765f44-gkbd7             1/1     Running   0          35s   10.244.1.4    k8s-worker-2   <none>           <none>
coredns-6955765f44-vv2zm             1/1     Running   0          35s   10.244.2.5    k8s-worker-1   <none>           <none>
```

```sh
kubectl run -it busybox --image busybox --restart Never -- sh

nslookup hostnames

Server:		10.96.0.10
Address:	10.96.0.10:53

Name:	hostnames.default.svc.cluster.local
Address: 10.96.233.157

kubectl get svc -o wide
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE   SELECTOR
hostnames    ClusterIP   10.96.233.157   <none>        9376/TCP   47m   app=hostnames
```

## No servers cloud be reached

```sh
nslookup hostnames
;; connection timed out; no servers could be reached
```

```sh
kubectl get deployments
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
hostnames   2/2     2            2           103m

kubectl get services
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   109m

kubectl expose deployment hostnames --port 9376 --port 80
service/hostnames exposed

kubectl get services
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
hostnames    ClusterIP   10.96.102.59   <none>        80/TCP    11s
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   110m

nslookup hostnames
Server:		10.96.0.10
Address:	10.96.0.10:53

Name:	hostnames.default.svc.cluster.local
Address: 10.96.102.59

```

# Miscellaneous

* [https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-18-04)
