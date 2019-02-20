const Router = require("koa-router");

const router = new Router();

module.exports = function(app) {
  const handle = app.getRequestHandler();

  router.get("/answer/:id", async ctx => {
    await app.render(ctx.req, ctx.res, "/answer", {
      ...ctx.query,
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  return router;
};
