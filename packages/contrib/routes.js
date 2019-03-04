const Router = require("koa-router");

const router = new Router();

module.exports = function(nextApp) {
  const handle = nextApp.getRequestHandler();

  router.get("/answer/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/answer", { ...ctx.query });
    ctx.respond = false;
  });

  router.get("/login", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/login", { ...ctx.query });
    ctx.respond = false;
  });

  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  return router.routes();
};
