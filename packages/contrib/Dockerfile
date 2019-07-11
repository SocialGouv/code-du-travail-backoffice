FROM node:10-slim

ARG API_URI
ARG NODE_ENV
ENV API_URI=$API_URI
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

COPY . ./

RUN yarn --frozen-lockfile
RUN yarn build

ENTRYPOINT ["yarn", "start"]
