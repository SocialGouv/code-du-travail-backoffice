const { Client: PostgresClient } = require("pg");

const reportError = require("../libs/reportError");

const { DB_URI } = process.env;

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
