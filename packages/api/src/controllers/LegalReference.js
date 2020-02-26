// @ts-check

const url = require("url");

const answerWithError = require("../helpers/answerWithError");
const getAgreementArticles = require("../libs/getAgreementArticles");
const getArticleContent = require("../libs/getArticleContent");
const getLaborCodeArticles = require("../libs/getLaborCodeArticles");
const { COMMON_HEADERS, LEGAL_REFERENCE_TYPE } = require("../constants");

const LEGAL_REFERENCE_TYPES = Object.values(LEGAL_REFERENCE_TYPE);

class LegalReference {
  /**
   * @param {import("http").IncomingMessage} req
   * @param {import("http").ServerResponse} res
   */
  get(req, res) {
    try {
      const path = String(url.parse(String(req.url)).pathname);
      const id = path.substr(path.lastIndexOf("/") + 1);

      const body = getArticleContent(id);

      res.writeHead(200, COMMON_HEADERS);
      res.end(body);
    } catch (err) {
      answerWithError("controllers/LegalReference#get()", err, res);
    }
  }

  /**
   * @param {import("http").IncomingMessage} req
   * @param {import("http").ServerResponse} res
   *
   * @example
   * - http://localhost:3200/legal-references?idcc=2216&type=agreement&query=12.1
   * - http://localhost:3200/legal-references?idcc=2216&type=labor_code&query=L1234-5
   */
  index(req, res) {
    try {
      const queryParams = url.parse(String(req.url), true).query;
      const { category, idcc, query } = queryParams;

      switch (true) {
        case typeof category === "undefined":
          throw new Error("The `category` query parameter is mandatory.");

        case typeof query === "undefined":
          throw new Error("The `query` query parameter is mandatory.");

        case typeof category !== "string":
          throw new Error("The `category` query parameter must be a {string}.");

        case typeof query !== "string":
          throw new Error("The `query` query parameter must be a {string}.");

        case !LEGAL_REFERENCE_TYPES.includes(String(category)):
          // eslint-disable-next-line no-case-declarations
          const types = `"${LEGAL_REFERENCE_TYPES.join(`", "`)}"`;
          throw new Error(`The \`type\` category parameter must be one of: ${types}.`);

        case category === LEGAL_REFERENCE_TYPE.AGREEMENT && typeof idcc === "undefined":
          throw new Error("The `idcc` query parameter is mandatory.");

        case category === LEGAL_REFERENCE_TYPE.AGREEMENT && typeof idcc !== "string":
          throw new Error("The `idcc` query parameter must be a {string}.");
      }

      let body;
      switch (String(category)) {
        case LEGAL_REFERENCE_TYPE.AGREEMENT:
          body = getAgreementArticles(String(idcc), String(query));
          break;

        case LEGAL_REFERENCE_TYPE.LABOR_CODE:
          body = getLaborCodeArticles(String(query));
          break;
      }

      res.writeHead(200, COMMON_HEADERS);
      res.end(JSON.stringify(body));
    } catch (err) {
      answerWithError("controllers/LegalReference#index()", err, res);
    }
  }
}

module.exports = new LegalReference();
