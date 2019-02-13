FROM node:10-alpine

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

COPY ./packages/contrib/package.json /app/packages/contrib/package.json
COPY ./packages/contrib/yarn.lock /app/packages/contrib/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./lerna.json /app/lerna.json
COPY ./packages /app/packages

WORKDIR /app

RUN yarn build
