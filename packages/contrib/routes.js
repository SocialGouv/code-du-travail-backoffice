const { parse } = require("url");

module.exports = function(app, req, res) {
  const handle = app.getRequestHandler();
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  switch (pathname) {
    default:
      handle(req, res, parsedUrl);
  }
};
