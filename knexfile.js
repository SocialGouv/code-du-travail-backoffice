module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://postgres:postgres@localhost:5432/cndt',
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
