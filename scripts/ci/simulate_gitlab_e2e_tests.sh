#!/bin/bash

################################################################################
# This script simulates a CI run locally (likely on a developer machine).
################################################################################

# Exit when any command fails:
set -e

echo "⏳  Overriding environment variables…"
# Override API_URI environment variable (declare in the .env file) because
# localhost won't available within the container:
# https://docs.docker.com/compose/networking/
# https://docs.docker.com/compose/environment-variables/#the-env-file
export API_URI=http://api:3000
export WEB_URI=http://web:3100
# This is useful to inform the master container entrypoint script that we need
# to seed the database with some dummy data:
export NODE_ENV=test
# Remove docker-compose warnings (because this environment variable is ised by
# the test container):
export CONFIG_ONLY=false

echo "⏳  Removing db containers & its volume…"
docker-compose down -v > /dev/nul
docker-compose rm -v db > /dev/nul

echo "⏳  Building and starting db container…"
# Start db (we manually start it so that it has the time to start during the
# other containers build process):
docker-compose up -d db > /dev/nul

echo "⏳  Building and starting all other containers…"
# This will build & start all the other containers as well as run database
# migrations & seeds:
CONFIG_ONLY=true docker-compose up -d --always-recreate-deps --build --force-recreate test > /dev/nul

echo "⏳  Restarting api container…"
# We need to restart the api container to apply the authentication process:
docker-compose restart api > /dev/nul

echo "💻  Running e2e tests…"
# Starting test will automatically migrate & seed the database before running
# the e2e tests (as well as build & start all the other containers):
docker-compose up --abort-on-container-exit --exit-code-from test test

echo "✅  Cleaning environment variables and stopping docker-dind, test & web…"
# Clean the environment:
unset API_URI, NODE_ENV, WEB_URI
# Stop the useless containers:
docker-compose stop test docker-dind web test > /dev/nul
