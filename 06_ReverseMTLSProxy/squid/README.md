Ensure the packages and source repositories are listed.
```sh
cat /etc/apt/sources.list
deb http://deb.debian.org/debian buster main
deb http://security.debian.org/debian-security buster/updates main
deb http://deb.debian.org/debian buster-updates main
deb-src http://deb.debian.org/debian buster main
```

Download source and binaries
```sh
apt update 
apt install -y dpkg-dev
apt-get source squid3
apt-get build-dep squid3
apt-get install -y libssl-dev


./configure --with-openssl --enable-ssl-crtd
make all
make install
```

Initialize SSL DB
```sh
mkdir -p  /usr/local/squid/var/lib
/usr/local/squid/libexec/security_file_certgen -c -s /usr/local/squid/var/lib/ssl_db -M 4 MB
```


