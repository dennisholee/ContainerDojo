


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
kubectl run -i --tty busybox --image=busybox --restart=Never -- sh
```

# Miscellaneous

* [https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-use-ansible-to-install-and-set-up-docker-on-ubuntu-18-04)
