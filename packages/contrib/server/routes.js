/* eslint-disable require-atomic-updates */

const Router = require("koa-router");

const router = new Router();

module.exports = function(nextApp) {
  const handle = nextApp.getRequestHandler();

  router.get("/", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/answers", {
      page: 1,
      state: "todo"
    });
    ctx.respond = false;
  });

  router.get("/answers/edit/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/answers/edit", { ...ctx.params });
    ctx.respond = false;
  });

  router.get("/answers/:state/:page", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/answers", { ...ctx.params });
    ctx.respond = false;
  });

  router.get("/login", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/login", { ...ctx.query });
    ctx.respond = false;
  });

  router.get("/admin/agreements/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/agreements/new", {});
    ctx.respond = false;
  });

  router.get("/admin/agreements/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/agreements/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/answers/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/answers/new", {});
    ctx.respond = false;
  });

  router.get("/admin/answers/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/answers/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/generic-answers/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/generic-answers/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/locations/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/locations/new", {});
    ctx.respond = false;
  });

  router.get("/admin/locations/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/locations/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/questions/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/questions/new", {});
    ctx.respond = false;
  });

  router.get("/admin/questions/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/questions/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/migrations/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/migrations/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/tags/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/tags/new", {});
    ctx.respond = false;
  });

  router.get("/admin/tags/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/tags/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/users/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/users/new", {});
    ctx.respond = false;
  });

  router.get("/admin/users/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/users/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("/admin/zones/new", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/zones/new", {});
    ctx.respond = false;
  });

  router.get("/admin/zones/:id", async ctx => {
    await nextApp.render(ctx.req, ctx.res, "/admin/zones/edit", {
      ...ctx.params
    });
    ctx.respond = false;
  });

  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  return router.routes();
};
