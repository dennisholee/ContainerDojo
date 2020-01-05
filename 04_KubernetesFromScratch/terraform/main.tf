provider "google" {
  project = "${var.project_id}"
  version = "3.0.0"
}

locals {
  app           = "k8s"
  terraform     = "terraform"
  zone          = "${var.zone}"
  region        = "${var.region}"
  ip_cidr_range = "192.168.0.0/24"

}

# -------------------------------------------------------------------------------
# Enable project services 
# -------------------------------------------------------------------------------

# resource "google_project_service" "service" {
#   for_each = toset([
#     "serviceusage.googleapis.com", 
#     "iam.googleapis.com", 
#     "cloudresourcemanager.googleapis.com"
#   ])
# 
#   service = each.key
# 
#   project = "your-project-id"
#   disable_on_destroy = false
# }

# resource "google_project_service" "api-serviceusage" {
#   project = "${var.project_id}"
#   service = "serviceusage.googleapis.com"
# 
# }
# 
# resource "google_project_service" "api-iam" {
#   project = "${var.project_id}"
#   service = "iam.googleapis.com"
# }
# 
# 
# resource "google_project_service" "api-cloudresourcemanager" {
#   project = "${var.project_id}"
#   service = "cloudresourcemanager.googleapis.com"
# }



# -------------------------------------------------------------------------------
# Service account
# -------------------------------------------------------------------------------

resource "google_service_account" "sa" {
  account_id = "${local.app}-sa"
}

resource "google_project_iam_binding" "sa-networkviewer-iam" {
  role   = "roles/compute.networkViewer"
  members = ["serviceAccount:${google_service_account.sa.email}"]
}

# -------------------------------------------------------------------------------
# Network
# -------------------------------------------------------------------------------

resource "google_compute_network" "vpc" {
  name                    = "${local.app}-network"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "subnet" {
  name                     = "${local.app}-subnet"
  region                   = "${local.region}"
  ip_cidr_range            = "${local.ip_cidr_range}"
  network                  = "${google_compute_network.vpc.self_link}"
  private_ip_google_access = true
}

# -------------------------------------------------------------------------------
# Public IP Address
# -------------------------------------------------------------------------------

resource "google_compute_address" "external-address-master" {
  name         = "${local.app}-external-address-master"
  region       = "${local.region}"
}

resource "google_compute_address" "external-address-worker-1" {
  name         = "${local.app}-external-address-worker-1"
  region       = "${local.region}"
}

resource "google_compute_address" "external-address-worker-2" {
  name         = "${local.app}-external-address-worker-2"
  region       = "${local.region}"
}

resource "google_compute_address" "external-address-management" {
  name         = "${local.app}-external-address-management"
  region       = "${local.region}"
}

# -------------------------------------------------------------------------------
# Firewall
# -------------------------------------------------------------------------------

resource "google_compute_firewall" "firewall" {
  name          = "fw-${local.app}-ssh"
  network       = "${google_compute_network.vpc.self_link}"
  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]
  
  allow {
    protocol = "tcp"
    ports    = ["22", "6443", "10250"]
  }

  target_tags = ["fw-${local.app}-ssh"]
}

# -------------------------------------------------------------------------------
# Compute Engine
# -------------------------------------------------------------------------------

resource "google_compute_instance" "master" {
  name                      = "${local.app}-master"
  machine_type              = "n1-standard-2"
  zone                      = "${local.zone}"
  count                     = 1
  
  metadata = {
    sshKeys  = "dennislee:${file("${var.public_key}")}"
  }

  service_account {
    email   = "${google_service_account.sa.email}"
    scopes  = ["cloud-platform"]
  }

  network_interface {
    subnetwork = "${google_compute_subnetwork.subnet.self_link}"
    access_config {
        nat_ip = "${google_compute_address.external-address-master.address}"
    }
  }

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }


  tags = ["${google_compute_firewall.firewall.name}"] 
}

resource "google_compute_instance" "worker-1" {
  name                      = "${local.app}-worker-1"
  machine_type              = "n1-standard-2"
  zone                      = "${local.zone}"
  count                     = 1
  
  metadata = {
    sshKeys  = "dennislee:${file("${var.public_key}")}"
  }

  service_account {
    email   = "${google_service_account.sa.email}"
    scopes  = ["cloud-platform"]
  }

  network_interface {
    subnetwork = "${google_compute_subnetwork.subnet.self_link}"
    access_config {
        nat_ip = "${google_compute_address.external-address-worker-1.address}"
    }
  }

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }


  tags = ["${google_compute_firewall.firewall.name}"] 
}

resource "google_compute_instance" "worker-2" {
  name                      = "${local.app}-worker-2"
  machine_type              = "n1-standard-2"
  zone                      = "${local.zone}"
  count                     = 1
  
  metadata = {
    sshKeys  = "dennislee:${file("${var.public_key}")}"
  }

  service_account {
    email   = "${google_service_account.sa.email}"
    scopes  = ["cloud-platform"]
  }

  network_interface {
    subnetwork = "${google_compute_subnetwork.subnet.self_link}"
    access_config {
        nat_ip = "${google_compute_address.external-address-worker-2.address}"
    }
  }

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }


  tags = ["${google_compute_firewall.firewall.name}"] 
}

resource "google_compute_instance" "management" {
  name                      = "${local.app}-management"
  machine_type              = "f1-micro"
  zone                      = "${local.zone}"
  count                     = 1
  
  metadata = {
    sshKeys  = "dennislee:${file("${var.public_key}")}"
  }

  service_account {
    email   = "${google_service_account.sa.email}"
    scopes  = ["cloud-platform"]
  }

  network_interface {
    subnetwork = "${google_compute_subnetwork.subnet.self_link}"
    access_config {
        nat_ip = "${google_compute_address.external-address-management.address}"
    }
  }

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }


  tags = ["${google_compute_firewall.firewall.name}"] 
}
