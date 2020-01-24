const httpProxy = require("http-proxy");

const logActions = require("./middlewares/logActions");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { API_DOMAIN, API_PORT, API_SCHEME, DEV_POSTGREST_PORT } = process.env;
let { POSTGREST_URI } = process.env;
if (NODE_ENV === "development") {
  POSTGREST_URI = `http://localhost:${DEV_POSTGREST_PORT}`;
}

const API_URI = `${API_SCHEME}://${API_DOMAIN}:${API_PORT}`;

httpProxy
  .createProxyServer({ target: POSTGREST_URI })
  .listen(API_PORT)
  // eslint-disable-next-line no-unused-vars
  .on("proxyReq", async (proxyReq, req, res, options) => {
    await logActions(proxyReq, req, res, options);
  });

console.info(`> API ready on ${API_URI} (${NODE_ENV})`);
