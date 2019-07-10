# This is the Docker file runnning E2E Tests.

FROM igabriele/docker-compose-puppeteer

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn --frozen-lockfile && yarn cache clean

COPY ./features /app/features

ENTRYPOINT ["yarn", "test:e2e"]
