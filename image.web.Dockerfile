# Web Container (including contrib & data-filler packages)

FROM node:12.14.1-slim

ARG API_DOMAIN
ARG API_PORT
ARG API_SCHEME
ARG API_URI_DOCKER
ARG DATA_FILLER_PATH
ARG DB_URI
ARG NODE_ENV
ARG KINTO_BUCKET
ARG KINTO_URI
ARG WEB_DOMAIN
ARG WEB_PORT
ARG WEB_SCHEME

ENV API_DOMAIN=$API_DOMAIN
ENV API_PORT=$API_PORT
ENV API_SCHEME=$API_SCHEME
ENV API_URI_DOCKER=$API_URI_DOCKER
ENV DATA_FILLER_PATH=$DATA_FILLER_PATH
ENV DB_URI=$DB_URI
ENV NODE_ENV=$NODE_ENV
ENV KINTO_BUCKET=$KINTO_BUCKET
ENV KINTO_URI=$KINTO_URI
ENV WEB_DOMAIN=$WEB_DOMAIN
ENV WEB_PORT=$WEB_PORT
ENV WEB_SCHEME=$WEB_SCHEME

WORKDIR /app

# Package "contrib"
COPY ./packages/contrib/pages ./packages/contrib/pages
COPY ./packages/contrib/public ./packages/contrib/public
COPY ./packages/contrib/server ./packages/contrib/server
COPY ./packages/contrib/src ./packages/contrib/src
COPY ./packages/contrib/.babelrc ./packages/contrib/.babelrc
COPY ./packages/contrib/next.config.js ./packages/contrib/next.config.js
COPY ./packages/contrib/package.json ./packages/contrib/package.json

# Package "data-filler"
COPY ./packages/data-filler ./packages/data-filler
COPY ./packages/data-filler/pages ./packages/data-filler/pages
COPY ./packages/data-filler/src ./packages/data-filler/src
COPY ./packages/data-filler/package.json ./packages/data-filler/package.json

# Mono-repository
COPY ./lerna.json ./lerna.json
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn --frozen-lockfile
# Otherwise, we have a fatal error:
# "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
# https://stackoverflow.com/a/55547893/2736233
RUN node --max-old-space-size=2048 ./node_modules/.bin/next build ./packages/contrib

WORKDIR /app/packages/contrib

ENTRYPOINT ["yarn", "start"]
