# This is the "master" Docker file building the back-office front-end.
# The front-end only includes the "contrib" package for now.

FROM node:10-alpine

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./lerna.json /app/lerna.json
COPY ./packages/contrib/package.json /app/packages/contrib/package.json
COPY ./packages/contrib/yarn.lock /app/packages/contrib/yarn.lock

RUN yarn lerna bootstrap && yarn cache clean

COPY ./knexfile.js /app/knexfile.js
COPY ./db /app/db
COPY ./packages /app/packages

RUN yarn build
