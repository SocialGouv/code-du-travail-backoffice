# This is the "master" Docker file used to prepare de production building.

FROM node:10-slim

COPY ./knexfile.js /app/knexfile.js
COPY ./scripts/db /app/scripts/db
COPY ./scripts/docker /app/scripts/docker
COPY ./db /app/db
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

ENTRYPOINT ["./scripts/docker/master.sh"]
