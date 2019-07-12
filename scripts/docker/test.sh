#!/bin/bash

################################################################################
# This script is the master docker image entrypoint.
################################################################################

# Exit when any command fails:
set -e

if [ "$CONFIG_ONLY" = "true" ]; then
  # Migrate database schemas:
  yarn db:migrate

  # Seed database for non-production environments:
  if [ "$NODE_ENV" != "production" ]; then
    yarn db:seed
  fi
fi

if [ "$CONFIG_ONLY" != "true" ]; then
  # Run e2e tests:
  yarn test:e2e
fi
