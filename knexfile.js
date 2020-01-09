let DB_URI;
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/.env` });
}

const { DB_PUBLIC_URI } = process.env;

module.exports = {
  development: {
    client: "postgresql",
    connection: DB_PUBLIC_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds/dev`
    }
  },

  production: {
    client: "postgresql",
    connection: DB_PUBLIC_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds/prod`
    }
  },

  test: {
    client: "postgresql",
    connection: DB_PUBLIC_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds/dev`
    }
  }
};
