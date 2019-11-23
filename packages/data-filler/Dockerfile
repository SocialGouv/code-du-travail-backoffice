FROM node:12.13.1-slim

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

WORKDIR /app

COPY . ./

RUN yarn --frozen-lockfile
RUN yarn build:docker

ENTRYPOINT ["yarn", "start"]
