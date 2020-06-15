const Koa = require("koa");
const next = require("next");

const isInternetExplorer = require("./middlewares/isInternetExplorer");
const withAuthentication = require("./middlewares/withAuthentication");
const withPostgres = require("./middlewares/withPostgres");

const router = require("./router");

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development";
const { APP_PORT } = process.env;

const nextApp = next({ dev: NODE_ENV === "development" });

async function start() {
  await nextApp.prepare();

  const koaApp = new Koa();
  const requestHandler = nextApp.getRequestHandler();

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

    console.info(`> Website ready on port ${APP_PORT} (${NODE_ENV}).`);
  });
}

start();
