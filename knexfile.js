require("dotenv").config({ path: `${__dirname}/.env` })

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.POSTGRE_URI,
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: "migrations"
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.POSTGRE_URI,
    migrations: {
      directory: `${__dirname}/db/migrations`,
      tableName: "migrations"
    }
  }
};
