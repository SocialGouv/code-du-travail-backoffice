const { Client: PostgresClient } = require("pg");

const reportError = require("../libs/reportError");

const { DEV_DB_PORT, NODE_ENV, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;
let { DB_URI } = process.env;
if (NODE_ENV !== "production") {
  DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;
}

let postgresClient;
let postgresClientIsConnected = false;

module.exports = async (ctx, next) => {
  try {
    if (!postgresClientIsConnected) {
      postgresClient = new PostgresClient({ connectionString: DB_URI });
      await postgresClient.connect();

      // eslint-disable-next-line require-atomic-updates
      postgresClientIsConnected = true;
    }

    ctx.pg = postgresClient;
  } catch (err) {
    await reportError(ctx, "middlewares/withPostgres()", err);
  }

  await next();
};
