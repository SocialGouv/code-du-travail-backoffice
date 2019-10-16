module.exports = async (ctx, scope, err) => {
  const message = typeof err === "string" ? err : err.message;
  process.stderr.write(`[${scope}] ${message}`);

  ctx.error = err;
  ctx.status = 500;
};
