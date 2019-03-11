require("dotenv").config({ path: `${__dirname}/.env` })

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.PGRST_DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.PGRST_DB_URI,
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: "migrations"
    }
  }
};
