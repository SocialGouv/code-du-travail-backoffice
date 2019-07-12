if (process.env.DB_URI === undefined) {
  require("dotenv").config({ path: `${__dirname}/.env` })
}

const { DB_URI } = process.env;

module.exports = {
  development: {
    client: "postgresql",
    connection: DB_URI,
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
    connection: DB_URI,
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
    connection: DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds/dev`
    }
  }
};
