# Web Container (including contrib & data-filler packages)

FROM node:12.14.1-slim

ARG API_DOMAIN
ARG API_PORT_PUBLIC
ARG API_SCHEME
ARG API_URI_DOCKER
ARG DATA_FILLER_PATH
ARG DB_URI
ARG NODE_ENV
ARG KINTO_BUCKET
ARG KINTO_URI
ARG WEB_PORT

ENV API_DOMAIN=$API_DOMAIN
ENV API_PORT_PUBLIC=$API_PORT_PUBLIC
ENV API_SCHEME=$API_SCHEME
ENV DATA_FILLER_PATH=$DATA_FILLER_PATH
ENV DB_URI=$DB_URI
ENV NODE_ENV=$NODE_ENV
ENV KINTO_BUCKET=$KINTO_BUCKET
ENV KINTO_URI=$KINTO_URI
ENV WEB_PORT=$WEB_PORT

WORKDIR /app

COPY . .

RUN yarn --pure-lockfile
# Otherwise, we have a fatal error:
# "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
# https://stackoverflow.com/a/55547893/2736233
RUN node --max-old-space-size=2048 ./node_modules/.bin/next build ./packages/contrib

WORKDIR /app/packages/contrib

ENTRYPOINT ["yarn", "start"]
