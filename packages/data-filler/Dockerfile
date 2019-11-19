FROM node:10-alpine

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn build

ENV NODE_ENV="production"

ENTRYPOINT ["yarn", "start"]


