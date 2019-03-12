FROM node:10-alpine

COPY . /app

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean
RUN yarn build
RUN yarn start
