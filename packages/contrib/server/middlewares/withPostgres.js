const { Client } = require("pg");

const reportError = require("../libs/reportError");

// If we are in a non-production environment, we want to load the env vars via
// the monorepo global .env file.
let DB_URI;
if (!["production", "test"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: `${__dirname}/../../../../.env` });

  DB_URI = process.env.DB_PUBLIC_URI;
} else {
  DB_URI = process.env.DB_URI;
}

let client;
let isConnected = false;

module.exports = async (ctx, next) => {
  try {
    if (!isConnected) {
      client = new Client({ connectionString: DB_URI });
      await client.connect();

      // eslint-disable-next-line require-atomic-updates
      isConnected = true;
    }

    ctx.pg = client;
  } catch (err) {
    await reportError(ctx, "middlewares/withPostgres()", err);
  }

  await next();
};
