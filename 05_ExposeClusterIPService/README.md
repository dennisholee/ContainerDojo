```bash
kubectl run mynginx --image nginx --port 80
```
```console
deployment.apps/mynginx created
```

```bash
kubectl get pods -o wide 
```

```console
NAME                       READY   STATUS    RESTARTS   AGE   IP          NODE             NOMINATED NODE   READINESS GATES
mynginx-74bc69fc95-8qv8x   1/1     Running   0          44s   10.1.0.14   docker-desktop   <none>           <none>
mynode-6cffd6c87b-pmvxg    1/1     Running   0          35h   10.1.0.12   docker-desktop   <none>           <none>
```

```bash
kubectl get deployments
```

```console
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
mynginx   1/1     1            1           117s
mynode    1/1     1            1           35h

```

```bash
kubectl expose deployment mynginx --port 80 --target-port 80
```

```console
service/mynginx exposed
(base) dennislees-MBP:05_ExposeClusterIPService dennislee$ kubectl get svc
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP    2d12h
mynginx      ClusterIP   10.96.223.91     <none>        80/TCP     6s
mynode       ClusterIP   10.104.138.145   <none>        3000/TCP   35h
```

```bash
kubectl port-forward mynginx-74bc69fc95-8qv8x 8080:80
```

```console
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

```bash
curl -i localhost:8080
```

```console
HTTP/1.1 200 OK
Server: nginx/1.17.7
Date: Sat, 18 Jan 2020 02:14:21 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 24 Dec 2019 13:07:53 GMT
Connection: keep-alive
ETag: "5e020da9-264"
Accept-Ranges: bytes

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```
