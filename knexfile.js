require('dotenv').config()

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.POSTGRE_URI,
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.POSTGRE_URI,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
