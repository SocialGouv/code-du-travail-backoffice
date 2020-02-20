# Web Image
#
# TODO Move this image back to its own package?

FROM node:12.16.0-alpine

ARG API_DOMAIN
ARG API_PORT_PUBLIC
ARG API_SCHEME
ARG API_URI_DOCKER
ARG DB_URI
ARG NODE_ENV
ARG APP_PORT

ENV API_DOMAIN=$API_DOMAIN
ENV API_PORT_PUBLIC=$API_PORT_PUBLIC
ENV API_SCHEME=$API_SCHEME
ENV DB_URI=$DB_URI
ENV NODE_ENV=$NODE_ENV
ENV APP_PORT=$APP_PORT

WORKDIR /app

COPY . .

RUN yarn --pure-lockfile
# Otherwise, we have a fatal error:
# "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
# https://stackoverflow.com/a/55547893/2736233
RUN node --max-old-space-size=2048 ./node_modules/.bin/next build ./packages/app

WORKDIR /app/packages/app

ENTRYPOINT ["yarn", "start"]
