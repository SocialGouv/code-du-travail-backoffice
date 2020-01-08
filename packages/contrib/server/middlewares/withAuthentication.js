const { USER_ROLE } = require("../constants");
const reportError = require("../libs/reportError");

async function getMe(ctx) {
  const jwt = ctx.cookies.get("jwt");

  if (jwt === undefined) {
    return { isAuthenticated: false };
  }

  const res = await ctx.pg.query(`SELECT * FROM api.login_check('${jwt}')`);
  if (!res.rows[0].valid) {
    return { isAuthenticated: false };
  }

  const data = res.rows[0].payload;
  const isAdmin = [USER_ROLE.ADMINISTRATOR, USER_ROLE.REGIONAL_ADMINISTRATOR].includes(data.role);

  return {
    isAdmin,
    isAuthenticated: true
  };
}

module.exports = async (ctx, next) => {
  try {
    // eslint-disable-next-line require-atomic-updates
    ctx.me = await getMe(ctx);
  } catch (err) {
    await reportError(ctx, "middlewares/withAuthentication()", err);
  }

  await next();
};
