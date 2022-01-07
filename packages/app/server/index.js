const Koa = require("koa");
const next = require("next");
const proxy = require("koa-proxies");

const isInternetExplorer = require("./middlewares/isInternetExplorer");
const withAuthentication = require("./middlewares/withAuthentication");
const withPostgres = require("./middlewares/withPostgres");

const router = require("./router");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { POSTGREST_URI, APP_PORT = 3000 } = process.env;

const proxyMiddleware = proxy("/postgrest", {
  target: POSTGREST_URI,
  rewrite: path => path.replace(/^\/postgrest/, "/"),
  logs: true,
});

const nextApp = next({ dev: NODE_ENV === "development" });

async function start() {
  console.info(`> Starting kow webserver on http://127.0.0.1:${APP_PORT} (${NODE_ENV}).`);

  await nextApp.prepare();

  const koaApp = new Koa();
  const requestHandler = nextApp.getRequestHandler();

  // Attach postgrest proxy
  koaApp.use(proxyMiddleware);

  // Show a page advising the user to use Chrome if the current browser is IE:
  koaApp.use(isInternetExplorer);

  // Attach PostgreSQL connection (via `ctx.pg`):
  koaApp.use(withPostgres);

  // Attach authentication data (via `ctx.me`):
  koaApp.use(withAuthentication);

  // Attach routes:
  koaApp.use(router(nextApp, requestHandler));

  koaApp.listen(APP_PORT, err => {
    if (err) throw err;

    console.info(`> Website ready on http://127.0.0.1:${APP_PORT} (${NODE_ENV}).`);
  });
}

start();
