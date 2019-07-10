#!/bin/bash

################################################################################
# This script simulates a CI run locally (likely on a developer machine).
################################################################################

# Exit when any command fails:
set -e

ENV_FILE="$PWD/.env"
GREEN="\033[0;32m"
NC='\033[0m'

# Override API_URI environment variable (declare in the .env file) because
# localhost won't available within the container:
# https://docs.docker.com/compose/networking/
# https://docs.docker.com/compose/environment-variables/#the-env-file
export API_URI=http://api:3000
# This is useful to inform the master container entrypoint script that we need
# to seed the database with some dummy data:
export NODE_ENV=test

echo "${GREEN}> Removing db containers & its volume…${NC}"
docker-compose rm -v db > /dev/nul
echo "${GREEN}> Starting db…${NC}"
docker-compose up -d db > /dev/nul
echo "${GREEN}> Building master, test & web…${NC}"
docker-compose build master test web > /dev/nul
# Starting master will automatically migrate & seed the database:
echo "${GREEN}> Migrating & seeding database…${NC}"
docker-compose up -d master

echo "${GREEN}> Running e2e tests…${NC}"
docker-compose up --abort-on-container-exit --exit-code-from test test

# Clean the environment:
unset API_URI

echo "${GREEN}> Stopping docker-dind, master, test & web…${NC}"
docker-compose stop master test docker-dind web test > /dev/nul
