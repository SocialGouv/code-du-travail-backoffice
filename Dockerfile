# Web container (including contrib & data-filler packages)

FROM node:12.13.1-slim

ARG API_DOCKER_URI
ARG API_URI
ARG DATA_FILLER_PATH
ARG DB_URI
ARG NODE_ENV
ARG KINTO_BUCKET
ARG KINTO_URI
# ARG SENTRY_DSN
# ARG SENTRY_PUBLIC_DSN
ARG WEB_PORT

ENV API_DOCKER_URI=$API_DOCKER_URI
ENV API_URI=$API_URI
ENV DATA_FILLER_PATH=$DATA_FILLER_PATH
ENV DB_URI=$DB_URI
ENV NODE_ENV=$NODE_ENV
ENV KINTO_BUCKET=$KINTO_BUCKET
ENV KINTO_URI=$KINTO_URI
# ENV SENTRY_DSN=$SENTRY_DSN
# ENV SENTRY_PUBLIC_DSN=$SENTRY_PUBLIC_DSN
ENV WEB_PORT=$WEB_PORT

WORKDIR /app

COPY . ./

RUN yarn --frozen-lockfile
# Otherwise, we have a fatal error:
# "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
# https://stackoverflow.com/a/55547893/2736233
RUN node --max-old-space-size=2048 ./node_modules/.bin/next build ./packages/contrib

ENTRYPOINT ["yarn", "start"]
