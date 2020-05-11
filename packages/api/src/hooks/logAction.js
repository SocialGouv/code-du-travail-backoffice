// @ts-check

const jsonwebtoken = require("jsonwebtoken");
const knex = require("knex");

const answerWithError = require("../helpers/answerWithError");
const isJsonValid = require("../helpers/isJsonValid");
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
 * @param {import("http").ServerResponse} res
 */
async function logAction(proxyReq, req, res) {
  try {
    const { headers, method, url: path } = req;

    if (method === undefined || path === undefined || ["GET", "OPTIONS"].includes(method)) {
      return;
    }

    const authorization = headers["authorization"];
    const ip = String(
      headers["x-forwarded-for"] !== undefined
        ? headers["x-forwarded-for"]
        : req.connection.remoteAddress,
    );

    /** @type {string | null} */
    let body = null;
    /** @type {string | null} */
    let maybeUserId = null;

    try {
      if (["/rpc/login", "/rpc/login_check"].includes(path)) {
        const bodyString = String(req.read());

        if (isJsonValid(bodyString)) {
          const bodyObject = isJsonValid(bodyString) ? JSON.parse(bodyString) : {};

          if (bodyObject.password !== undefined) {
            delete bodyObject.password;
          }

          body = JSON.stringify(bodyObject);

          if (path === "/rpc/login" && typeof bodyObject.email === "string") {
            /** @type {User.User[]} */
            const maybeUsers = await knexClient("auth.users").where({ email: bodyObject.email });

            if (maybeUsers.length === 1) {
              maybeUserId = maybeUsers[0].id;
            }
          }

          if (path === "/rpc/login_check") {
            const user = jsonwebtoken.decode(bodyObject.token);
            maybeUserId = user.id;
          }
        } else {
          body = bodyString;
        }
      } else if (authorization !== undefined) {
        const user = jsonwebtoken.decode(authorization.slice(7));
        maybeUserId = user.id;
      }
    } finally {
      let user_id = null;
      if (maybeUserId !== null && isUuidValid(maybeUserId)) {
        /** @type {User.User[]} */
        const maybeUsers = await knexClient("auth.users").where({ id: maybeUserId });

        if (maybeUsers.length === 1) {
          user_id = maybeUserId;
          body = null;
        }
      }

      /** @type {Log.Log} */
      const log = {
        body,
        ip,
        method: method.toLocaleLowerCase(),
        path,
        user_id,
      };

      await knexClient("public.logs").insert([log]);
    }
  } catch (err) {
    answerWithError("hooks/logAction()", err, res);
  }
}

module.exports = logAction;
