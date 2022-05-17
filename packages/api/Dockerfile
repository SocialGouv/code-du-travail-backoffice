# API Image
ARG NODE_VERSION=16.13.1-alpine

FROM node:$NODE_VERSION

WORKDIR /app

COPY . .

RUN yarn --production --pure-lockfile

ENTRYPOINT ["yarn", "start"]
