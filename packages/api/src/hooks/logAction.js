const jsonwebtoken = require("jsonwebtoken");
const knex = require("knex");

const answerWithError = require("../helpers/answerWithError");
const isUuidValid = require("../helpers/isUuidValid");

const { DEV_DB_PORT, NODE_ENV, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;
let { DB_URI } = process.env;
if (NODE_ENV !== "production") {
  DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;
}

const knexClient = knex({
  client: "pg",
  connection: DB_URI,
});

/**
 * @param {import("http").ClientRequest} proxyReq
 * @param {import("http").IncomingMessage} req
 */
async function logAction(proxyReq, req) {
  try {
    const { headers, method, url } = req;

    if (["GET", "OPTIONS"].includes(method) || ["/rpc/login", "/rpc/login_check"].includes(url)) {
      return;
    }

    const authorization = headers["authorization"];
    // const body = JSON.parse(req.read());
    // const data = body;
    const ip =
      headers["x-forwarded-for"] !== undefined
        ? headers["x-forwarded-for"]
        : req.connection.remoteAddress;

    let user_id;
    try {
      const user = jsonwebtoken.decode(authorization.slice(7));
      user_id = isUuidValid(user.id) ? user.id : null;
    } catch (err) {
      user_id = null;
    }

    const log = {
      action: method.toLowerCase(),
      ip,
      url,
      user_id,
    };

    await knexClient("api.logs").insert([log]);
  } catch (err) {
    answerWithError("hooks/logAction()", err);
  }
}

module.exports = logAction;
