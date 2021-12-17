FROM node:16.13.1-alpine

WORKDIR /app

# Add build-arg from github actions
ARG API_DOMAIN
ARG API_PORT_PUBLIC
ARG API_SCHEME
ARG API_URI_DOCKER
ARG CDTN_API_URL
ARG DB_URI
ARG NODE_ENV
ARG APP_PORT

ENV API_DOMAIN=$API_DOMAIN
ENV API_PORT_PUBLIC=$API_PORT_PUBLIC
ENV API_SCHEME=$API_SCHEME
ENV CDTN_API_URL=$CDTN_API_URL
ENV DB_URI=$DB_URI
ENV NODE_ENV=$NODE_ENV
ENV APP_PORT=$APP_PORT

COPY . .

# Install packages
RUN yarn 

# Build
RUN yarn build

# FIXME: This is a workaround for running the app in a container
RUN yarn add --dev typescript @types/node

CMD [ "yarn", "start"]
