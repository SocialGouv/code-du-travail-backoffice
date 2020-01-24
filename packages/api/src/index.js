const httpProxy = require("http-proxy");

const logActions = require("./middlewares/logActions");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { API_PORT, DEV_POSTGREST_PORT } = process.env;
let { POSTGREST_URI } = process.env;
if (NODE_ENV === "development") {
  POSTGREST_URI = `http://localhost:${DEV_POSTGREST_PORT}`;
}

httpProxy
  .createProxyServer({ target: POSTGREST_URI })
  .listen(API_PORT)
  .on("proxyReq", logActions);

console.info(`> API ready on ${API_PORT} (${NODE_ENV}).`);
