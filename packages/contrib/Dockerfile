FROM node:10-alpine

COPY ./__mocks__ /app/__mocks__
COPY ./.babelrc /app/.babelrc
COPY ./static /app/static
COPY ./routes.js /app/routes.js
COPY ./server.js /app/server.js
COPY ./next.config.js /app/next.config.js

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./store.js /app/store.js
COPY ./pages /app/pages
COPY ./src /app/src

RUN yarn build
RUN yarn start
