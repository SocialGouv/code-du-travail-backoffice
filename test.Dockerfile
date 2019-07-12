# This is the Docker file runnning E2E Tests.

FROM igabriele/docker-compose-puppeteer:latest

ENV CONFIG_ONLY=false

ENV DB_URI=
ENV DOCKER_HOST=
ENV NODE_ENV=
ENV PGRST_JWT_SECRET=
ENV POSTGRES_DB=
ENV WEB_URI=

COPY db ./db
COPY features ./features
COPY scripts ./scripts
COPY knexfile.js package.json yarn.lock ./

RUN yarn --frozen-lockfile

ENTRYPOINT ["./scripts/docker/test.sh"]
