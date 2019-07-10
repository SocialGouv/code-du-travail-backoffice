#!/bin/bash

################################################################################
# This script is the master docker image entrypoint.
################################################################################

# Exit when any command fails:
set -e

# Migrate database schemas:
yarn db:migrate

# Seed database for non-production environments:
if [ "$NODE_ENV" != "production" ]; then
  yarn db:seed
fi
