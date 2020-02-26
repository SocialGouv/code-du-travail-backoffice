#!/bin/bash

####################################################################################################
# This script prepare, build and start containers for a production environment.
####################################################################################################

# Exit when any command fails:
set -e

# Read .env file
export $(egrep -v '^#' ./.env | xargs)

API_URI="${API_SCHEME}://${API_DOMAIN}:${API_PORT_PUBLIC}"
APP_URI="${APP_SCHEME}://${APP_DOMAIN}:${APP_PORT_PUBLIC}"

echo "⏳ Checking variables…"
if [ -z "$API_URI" ] || [ -z "$APP_URI" ]; then
  echo "Error: \$API_URI and/or \$APP_URI is/are empty."
  exit 1
else
  echo "API_URI=${API_URI}"
  echo "APP_URI=${APP_URI}"
fi

if [ "$NODE_ENV" = "production" ] && [ "$CI" != "true" ]; then
  echo "⏳ Dumping current databases…"
  yarn db:backup

  # We take the opportunity of the first "docker-compose" up to remove potential left orphans:
  echo "⏳ Stopping all existing containers…"
  docker-compose down

  echo "⏳ Installing dependencies…"
  yarn --pure-lockfile
fi

echo "⏳ Starting db container…"
docker-compose up -d --remove-orphans db

echo "⏳ Looking for new database migrations…"
SAVED_MIGRATION_FILE=$(ls -p ./.shadow/db/migrations | grep -v / | sort -V | tail -n 1) || ""
LAST_MIGRATION_FILE=$(ls -p ./db/migrations | grep -v / | sort -V | tail -n 1)
if [ -z "$LAST_MIGRATION_FILE" ]; then
  echo "Error: Could not find last database migration file."
  exit 1
elif [ -z "$SAVED_MIGRATION_FILE" ] || [ "$LAST_MIGRATION_FILE" != "$SAVED_MIGRATION_FILE" ]; then
  echo "⏳ Building master container…"
  docker-compose build --force-rm --no-cache master

  echo "⏳ Starting master container…"
  docker-compose up -d master

  echo "⏳ Running database migrations…"
  docker-compose exec -T master npx knex migrate:latest

  echo "⏳ Stopping master container…"
  docker-compose stop master

  echo "⏳ Saving a shadow copy of the last database migration file…"
  mkdir -p ./.shadow/db/migrations
  cp "./db/migrations/${LAST_MIGRATION_FILE}" "./.shadow/db/migrations/${LAST_MIGRATION_FILE}"
fi

echo "⏳ Building api container…"
docker-compose build api

echo "⏳ Building app container…"
docker-compose build app

# Seed databases for non-production environments:
if [ "$CI" = "true" ] || [ "$NODE_ENV" != "production" ]; then
  if [ "$CI" = "true" ]; then
    echo "⏳ Restoring database snapshot for CI environment…"
  else
    echo "⏳ Restoring database snapshot for development environment…"
  fi
  yarn db:snapshot:restore
fi

echo "⏳ Starting postgrest, api and app containers…"
docker-compose up -d app

# echo "⏳ Waiting for api and app containers to be up and running…"
# while [[ "$(curl -s -o /dev/null -w %{http_code} ${APP_URI})" != "200" ]]; do sleep 5; done
# while [[ "$(curl -s -o /dev/null -w %{http_code} ${API_URI})" != "200" ]]; do sleep 5; done

echo "🚀 The server is (should be) up and running!"

if [ "$NODE_ENV" = "production" ] && [ "$CI" != "true" ]; then
  echo "🗑 Cleaning unused containers, networks, images and build cache…"
  docker system prune -af

  echo "✔ Cache cleaned."
fi
