if (process.env.PGRST_DB_URI === undefined) {
  require("dotenv").config({ path: `${__dirname}/.env` })
}

const { PGRST_DB_URI } = process.env;

module.exports = {
  development: {
    client: "postgresql",
    connection: PGRST_DB_URI,
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
    connection: PGRST_DB_URI,
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
    connection: PGRST_DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds/dev`
    }
  }
};
