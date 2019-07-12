#!/bin/bash

################################################################################
# This script prepare, build and start containers for a production environment.
################################################################################

# Exit when any command fails:
set -e

API_URI="$API_URI"
NODE_ENV="$NODE_ENV"

echo "⏳ Stopping all existing DC containers…"
sudo NODE_ENV=$NODE_ENV docker-compose stop

echo "⏳ Installing dependencies…"
if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "test" ]; then
  yarn --frozen-lockfile --no-cache
else
  yarn --frozen-lockfile
fi

echo "⏳ Starting db container…"
sudo NODE_ENV=$NODE_ENV docker-compose up -d db

# Buiding the web container before migrating is a strategy to let the db
# container be up and ready before running the migrations.
# Note: merely checking if the database port is used is not enough.
echo "⏳ Building web container…"
if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "test" ]; then
  if [ -z $API_URI ]; then
    sudo NODE_ENV=production docker-compose build --no-cache web
  else
    # Allow us to override the .env file API_URI value via the command line:
    sudo NODE_ENV=production API_URI=$API_URI docker-compose build --no-cache web
  fi
else
  if [ -z $API_URI ]; then
    sudo NODE_ENV=$NODE_ENV docker-compose build --no-cache web
  else
    # Allow us to override the .env file API_URI value via the command line:
    sudo NODE_ENV=$NODE_ENV API_URI=$API_URI docker-compose build --no-cache web
  fi
fi

echo "⏳ Running database migrations…"
yarn db:migrate

# Seed database for non-production environments:
if [ "$NODE_ENV" != "production" ]; then
  echo "⏳ Running database seeds for non-production environment…"
  yarn db:seed
fi

echo "⏳ Starting web (and api) container…"
sudo docker-compose up -d web

echo "🚀 The server is up and running!"
