# Master Image

FROM igabriele/knex-pg:12.0.7.0

WORKDIR /app

COPY ./db/migrations ./db/migrations
COPY ./scripts/db/getMigrationQuery.js ./scripts/db/getMigrationQuery.js
COPY ./knexfile.js ./knexfile.js
