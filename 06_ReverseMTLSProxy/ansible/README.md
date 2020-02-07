Notes:

Create PKCS#12 file based on cert and private key
```sh
openssl pkcs12 -export -out cacert.pfx -inkey private/ca_privatekey.pem -in crt/cacert.crt 
```
