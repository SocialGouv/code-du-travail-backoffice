# This is the "master" Docker file used to prepare de production building.

FROM node:10-alpine

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./knexfile.js /app/knexfile.js
COPY ./db /app/db
