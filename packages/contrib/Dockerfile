FROM node:10-slim

ARG API_URI
ARG NODE_ENV
ENV API_URI=$API_URI
ENV NODE_ENV=$NODE_ENV

# TODO Publish @SocialGouv/meditor on npm.
# Yarn needs git to install @SocialGouv/meditor:
RUN apt-get update -qq \
  && apt-get install -qq \
    git \
    > /dev/nul

WORKDIR /app

COPY . ./

RUN yarn --frozen-lockfile
RUN yarn build

ENTRYPOINT ["yarn", "start"]
