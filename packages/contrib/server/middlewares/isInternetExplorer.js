/* eslint-disable max-len, prettier/prettier */

const UAParser = require("ua-parser-js");

module.exports = async (ctx, next) => {
  const userAgent = new UAParser(ctx.req.headers["user-agent"]);
  const browserName = userAgent.getBrowser().name;

  if (browserName === "IE") {
    ctx.body =
`<html>
  <head>
    <title>Outil de contribution au Code du travail numérique</title>
  </head>
  <body>
    <div style="text-align: center;">
      <p><img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/51.0.2/archive/internet-explorer_9-11/internet-explorer_9-11_64x64.png"></p>
      <p><strong>L'outil de contribution n'est pas compatible avec Internet Explorer.</strong></p>
      <p>Nous vous conseillons d'utiliser Chrome, Edge ou Firefox pour pouvoir l'utiliser.</p>
    </div>
  </body>
</html>`;

    return;
  }

  await next();
};
