#!/bin/bash

####################################################################################################
# This script prepare, build and start containers for a production environment.
####################################################################################################

# Exit when any command fails:
set -e

# Read .env file
export $(egrep -v '^#' .env | xargs)

API_URI="${API_SCHEME}://${API_DOMAIN}:${API_PORT}"
WEB_URI="${WEB_SCHEME}://${WEB_DOMAIN}:${WEB_PORT}"

echo "⏳ Checking variables…"
if [ -z "$API_URI" ] || [ -z "$WEB_URI" ]; then
  echo "Error: \$API_URI and/or \$WEB_URI is/are empty."
  exit 1
else
  echo "API_URI=${API_URI}"
  echo "WEB_URI=${WEB_URI}"
fi

if [ "$NODE_ENV" = "production" ] && [ "$CI" != "true" ]; then
  echo "⏳ Dumping current databases…"
  yarn db:backup
fi

echo "⏳ Stopping all existing containers…"
docker-compose down

echo "⏳ Installing dependencies…"
yarn --pure-lockfile

# We take the opportunity of the first "docker-compose" up to remove potential left orphans:
echo "⏳ Starting db container…"
docker-compose up -d --remove-orphans db

echo "⏳ Building master container…"
docker-compose build --force-rm --no-cache master

echo "⏳ Starting master container…"
docker-compose up -d master

echo "⏳ Running database migrations…"
docker-compose exec -T master npx knex migrate:latest

echo "⏳ Stopping master container…"
docker-compose stop master

echo "⏳ Building web container…"
docker-compose build web

# Seed databases for non-production environments:
if [ "$CI" = "true" ] || [ "$NODE_ENV" != "production" ]; then
  if [ "$CI" = "true" ]; then
    echo "⏳ Restoring databases snapshot for CI environment…"
  else
    echo "⏳ Restoring databases snapshot for development environment…"
  fi
  yarn db:snapshot:restore
fi

echo "⏳ Starting kinto container…"
docker-compose up -d kinto

echo "⏳ Starting web (and api) container…"
docker-compose up -d web
# bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' ${WEB_URI})" != "200" ]]; do sleep 5; done'
# bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' ${API_URI})" != "200" ]]; do sleep 5; done'

echo "🚀 The server is up and running!"

if [ "$NODE_ENV" = "production" ] && [ "$CI" != "true" ]; then
  echo "🗑 Cleaning unused containers, networks, images and build cache…"
  docker system prune -af
  yarn cache clean
fi
