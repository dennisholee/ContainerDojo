//===============================================================================
// Description: Generate certificates for HTTPS services
// Usage: go run main.go
//===============================================================================

package main

import (
  "crypto"
  "crypto/rand"
  "crypto/rsa"
  "crypto/x509"
  "crypto/x509/pkix"
  "encoding/pem"
  "fmt"
  "log"
  "math/big"
  "net"
  "os"
  "time"
)

const KEY_LENGTH   = 2048

const ORGANIZATION = "Acme Limited"

func generateRSAKeyPair() (*rsa.PrivateKey, crypto.PublicKey, error) {
  priKey, err := rsa.GenerateKey(rand.Reader, KEY_LENGTH)
  return priKey, priKey.Public(), err
}

func exportPrivateKeyAsPem(priKey *rsa.PrivateKey) string {
  priKey_bytes := x509.MarshalPKCS1PrivateKey(priKey)
  privkey_pem := pem.EncodeToMemory(
    &pem.Block{
       Type:  "RSA PRIVATE KEY",
       Bytes: priKey_bytes,
    },
  )
  return string(privkey_pem)
}

func exportCACertAsPem(csr []byte) string {
  cert_pem := pem.EncodeToMemory(
    &pem.Block{
      Type: "CERTIFICATE",
      Bytes: csr,
    },
  )
  return string(cert_pem)
}

func createCACert(privkey *rsa.PrivateKey, pubkey crypto.PublicKey) (*x509.Certificate, []byte) {
  template := x509.Certificate {
    SerialNumber: big.NewInt(2019),
	  Subject: pkix.Name{
  		Organization:  []string{ORGANIZATION},
  	},
  	NotBefore:             time.Now(),
  	NotAfter:              time.Now().AddDate(10, 0, 0),
  	KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageCRLSign | x509.KeyUsageCertSign, 
  	BasicConstraintsValid: true,
  	IsCA:                  true,
  }

  cert_der, err :=x509.CreateCertificate(rand.Reader, &template, &template, pubkey, privkey)

  if err != nil {
    log.Fatal(err)
  }

  root_cert, err := x509.ParseCertificate(cert_der)
  if err != nil {
    log.Fatal(err)
  }
  return root_cert, cert_der
}

func createCSRCert(priv_key *rsa.PrivateKey) []byte {
  template := x509.CertificateRequest {
	  Subject: pkix.Name{
  		Organization:  []string{ORGANIZATION},
  	},
		SignatureAlgorithm: x509.SHA512WithRSA,
  }
  csr_byte, err :=x509.CreateCertificateRequest(rand.Reader, &template, priv_key)

  if err != nil {
    log.Fatal(err)
  }

  return csr_byte
}

func signCSR(cacert *x509.Certificate, ca_prikey *rsa.PrivateKey, certReq *x509.CertificateRequest, san string) []byte  {
  serial, err := rand.Int(rand.Reader, (&big.Int{}).Exp(big.NewInt(2), big.NewInt(159), nil))

	if err != nil {
		log.Fatal(err)
	}

  now := time.Now()
  expiration := time.Hour * 24 * 10

	template := x509.Certificate{
	  Subject: pkix.Name{
  		Organization:  []string{ORGANIZATION},
    },
    
		SerialNumber:       serial,
    PublicKeyAlgorithm: certReq.PublicKeyAlgorithm,
    PublicKey:          certReq.PublicKey,

    NotBefore:          now.Add(-10 * time.Minute).UTC(),
    NotAfter:           now.Add(expiration).UTC(),

    DNSNames:           []string{san,"localhost"},
    IPAddresses:     []net.IP{net.IPv4(127, 0, 0, 1)},
	}

	clientcert_der, err := x509.CreateCertificate(rand.Reader, &template, cacert, template.PublicKey, ca_prikey)

  if err != nil {
    log.Fatal(err)
  }

  return clientcert_der
}

func main() {

  //==================================================
  // Create CA Cert.
  //==================================================
  ca_prikey, ca_pubkey, err := generateRSAKeyPair()

  if err != nil {
    log.Fatal(err)
  } else {
    fmt.Println(exportPrivateKeyAsPem(ca_prikey))
  }

  cacert, cacert_bytes := createCACert(ca_prikey, ca_pubkey)

  // output cert
  cacert_file, err := os.Create("ca.crt")
  if err != nil {
    log.Fatal(err)
  }

  pem.Encode(cacert_file, &pem.Block{Type: "CERTIFICATE", Bytes: cacert_bytes})
  cacert_file.Close()

  //==================================================
  // Create Node Cert Signing Request (CRS).
  //==================================================
  
  node_prikey, _, err := generateRSAKeyPair()

  if err != nil {
    log.Fatal(err)
  } 
 

  nodekey_file, err := os.Create("node.key")
  if err != nil {
    log.Fatal(err)
  }

  nodekey_str := exportPrivateKeyAsPem(node_prikey)
  nodekey_file.WriteString(nodekey_str)
  nodekey_file.Close()

  csr_byte :=createCSRCert(node_prikey)
  certReq, err := x509.ParseCertificateRequest(csr_byte)

  if err != nil {
    log.Fatal(err)
  }
  
  //==================================================
  // Create a CA signed node cert.
  //==================================================

  nodecert_bytes := signCSR(cacert, ca_prikey, certReq, "forest.local")

  nodecert_file, err := os.Create("node.crt")
  if err != nil {
    log.Fatal(err)
  }

  pem.Encode(nodecert_file, &pem.Block{Type: "CERTIFICATE", Bytes: nodecert_bytes})
  nodecert_file.Close()

}
