// @ts-check

const url = require("url");

const answerWithError = require("../helpers/answerWithError");
const findAgreementArticles = require("../libs/findAgreementArticles");
const findLaborCodeArticles = require("../libs/findLaborCodeArticles");
const getArticleById = require("../libs/getArticleById");
const { COMMON_HEADERS, LEGAL_REFERENCE_CATEGORY } = require("../constants");

const LEGAL_REFERENCE_CATEGORYS = Object.values(LEGAL_REFERENCE_CATEGORY);

class LegalReference {
  /**
   * @param {import("http").IncomingMessage} req
   * @param {import("http").ServerResponse} res
   */
  get(req, res) {
    try {
      const path = String(url.parse(String(req.url)).pathname);
      const id = path.substr(path.lastIndexOf("/") + 1);

      const body = getArticleById(id);

      if (body === null) {
        answerWithError(
          "controllers/LegalReference#get()",
          `Could not find any matching legal reference with {id}="${id}".`,
          res,
          404,
        );
      }

      res.writeHead(200, COMMON_HEADERS);
      res.end(JSON.stringify(body));
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

        case !LEGAL_REFERENCE_CATEGORYS.includes(String(category)):
          // eslint-disable-next-line no-case-declarations
          const types = `"${LEGAL_REFERENCE_CATEGORYS.join(`", "`)}"`;
          throw new Error(`The \`type\` category parameter must be one of: ${types}.`);

        case category === LEGAL_REFERENCE_CATEGORY.AGREEMENT && typeof idcc === "undefined":
          throw new Error("The `idcc` query parameter is mandatory.");

        case category === LEGAL_REFERENCE_CATEGORY.AGREEMENT && typeof idcc !== "string":
          throw new Error("The `idcc` query parameter must be a {string}.");
      }

      let body;
      switch (String(category)) {
        case LEGAL_REFERENCE_CATEGORY.AGREEMENT:
          body = findAgreementArticles(String(idcc), String(query));
          break;

        case LEGAL_REFERENCE_CATEGORY.LABOR_CODE:
          body = findLaborCodeArticles(String(query));
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
