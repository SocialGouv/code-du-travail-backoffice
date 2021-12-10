let { DB_URI } = process.env;
if (DB_URI === undefined) {
  const dotenv = require("dotenv");
  dotenv.config();
  const { DEV_DB_PORT, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;

  DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;
}

module.exports = {
  development: {
    client: "postgresql",
    connection: DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations",
    },
  },
};
