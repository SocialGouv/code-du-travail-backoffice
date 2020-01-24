# Web Container (including contrib & data-filler packages)

FROM node:12.14.1-slim

WORKDIR /app

# Package "data-filler"
COPY ./db/migrations ./db/migrations
COPY ./scripts/db/getMigrationQuery.js ./scripts/db/getMigrationQuery.js
COPY ./knexfile.js ./knexfile.js

RUN npm i knex@0.20.8 pg@7.17.1
