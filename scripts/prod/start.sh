#!/bin/bash

####################################################################################################
# This script prepare, build and start containers for a production environment.
####################################################################################################

# Exit when any command fails:
set -e

# Read .env file
export $(egrep -v '^#' ../.env | xargs)

# Remove docker-compose warnings (because this environment variable is ised by
# the test container):
export CONFIG_ONLY=false

echo "⏳ Stopping all existing DC containers…"
docker-compose stop

echo "⏳ Installing dependencies…"
yarn --frozen-lockfile --no-cache

echo "⏳ Starting db container…"
docker-compose up -d db

echo "⏳ Starting elastic container…"
docker-compose up -d elastic

# Buiding the web container before migrating is a strategy to let the db
# container be up and ready before running the migrations.
# Note: merely checking if the database port is used is not enough.
echo "⏳ Building web container…"
if [ "$NODE_ENV" = "test" ]; then
  NODE_ENV=production docker-compose build --no-cache web
else
  docker-compose build --no-cache web
fi

# Crate Kinto database for non-production environments:
if [ "$NODE_ENV" != "production" ]; then
  echo "⏳ Create Kinto database for non-production environment…"
  yarn db:init
fi

echo "⏳ Starting kinto container…"
docker-compose up -d kinto

echo "⏳ Running database migrations…"
yarn db:migrate

# Seed database for non-production environments:
if [ "$NODE_ENV" != "production" ]; then
  echo "⏳ Running database seeds for non-production environment…"
  yarn db:seed
fi

echo "⏳ Starting web (and api) container…"
docker-compose up -d web
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' ${TEST_WEB_URI})" != "200" ]]; do sleep 5; done'
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' ${API_URI})" != "200" ]]; do sleep 5; done'

echo "🚀 The server is up and running!"
