const reportError = require("../libs/reportError");

const UAParser = require("ua-parser-js");

module.exports = async (ctx, next) => {
  try {
    const userAgent = new UAParser(ctx.req.headers["user-agent"]);
    const browserName = userAgent.getBrowser().name;

    if (browserName === "IE") {
      ctx.body = `
        <html>
          <head>
            <title>Outil de contribution au Code du travail numérique</title>
          </head>
          <body>
            <div style="text-align: center;">
              <p><img src="/static/images/ie.png"></p>
              <p>
                <b>
                  L'outil de contribution n'est pas compatible avec Internet
                  Explorer.
                </b>
              </p>
              <p>
                Nous vous conseillons d'utiliser Chrome, Edge ou Firefox pour
                pouvoir l'utiliser.
              </p>
            </div>
          </body>
        </html>
      `;

      return;
    }
  } catch (err) {
    await reportError(ctx, "middlewares/withAuthentication()", err);
  }

  await next();
};
