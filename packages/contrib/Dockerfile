FROM node:10-alpine

COPY ./__mocks__ /app/__mocks__
COPY ./.babelrc /app/.babelrc
COPY ./next.config.js /app/next.config.js
COPY ./routes.js /app/routes.js
COPY ./server.js /app/server.js
COPY ./static /app/static

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./src /app/src
COPY ./pages /app/pages

RUN yarn build

ENTRYPOINT ["yarn", "start"]
