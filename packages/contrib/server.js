const Koa = require("koa");
const next = require("next");

const routes = require("./routes");

const { NODE_ENV, PORT } = process.env;
const environment = NODE_ENV !== undefined ? NODE_ENV : "development";
const port = PORT !== undefined ? parseInt(PORT) : 3100;

const nextApp = next({ dev: environment !== "production" });

async function start() {
  await nextApp.prepare();

  const koaApp = new Koa();

  // Attach routes
  koaApp.use(routes(nextApp));

  koaApp.listen(port, err => {
    if (err) throw err;

    console.info(`> Ready on http://localhost:${port} (${environment})`);
  });
}

start();
