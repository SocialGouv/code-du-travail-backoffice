module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://postgres@localhost:5432/cdtn',
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
