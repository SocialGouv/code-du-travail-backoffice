# Master Image

FROM node:14.7.0-alpine

WORKDIR /app

COPY ./db/migrations ./db/migrations
COPY ./db/seeds ./db/seeds
COPY ./scripts/db/getMigrationQuery.js ./scripts/db/getMigrationQuery.js
COPY ./scripts/db/restore.js ./scripts/db/restore.js
COPY ./knexfile.js .
COPY package.json .
COPY yarn.lock .

RUN yarn --production --pure-lockfile --ignore-scripts

USER node

