const { DB_URI } = process.env;

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
