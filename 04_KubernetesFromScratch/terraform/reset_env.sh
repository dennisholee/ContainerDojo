#!/bin/bash

#-------------------------------------------------------------------------------
# Usage: reset_env.sh <project_id>
# Parameters:
#   project_id - GCP Project ID
#-------------------------------------------------------------------------------

shift 2

# Update project ID
sed -i ".0"  "s/\(project_id\).*/\1  = \"$1\"/" terraform.tfvars

# Remove statue
rm terraform.tfstate

