# Master Container for db migrations

FROM igabriele/knex-pg:12.0.7.0

COPY ./db/migrations ./db/migrations
COPY ./scripts/db/getMigrationQuery.js ./scripts/db/getMigrationQuery.js
COPY ./knexfile.js ./knexfile.js
