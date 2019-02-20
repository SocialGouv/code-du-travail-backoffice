const Koa = require("koa");
const next = require("next");

const db = require("./db");
const routes = require("./routes");
const sockets = require("./sockets");

const { NODE_ENV, PORT } = process.env;
const environment = NODE_ENV !== undefined ? NODE_ENV : "development";
const dbUri = require("../../knexfile")[environment].connection;
const port = PORT !== undefined ? parseInt(PORT) : 3100;

const app = next({ dev: environment !== "production" });

async function start() {
  await app.prepare();
  const pool = await db(dbUri);

  const server = new Koa();

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(routes(app).routes());

  // const server = createServer((req, res) => routes(app, req, res));
  // Link websocket listeners
  sockets(server, pool);

  server.listen(port, err => {
    if (err) throw err;

    console.info(`> Ready on http://localhost:${port} (${environment})`);
  });
}

start();
