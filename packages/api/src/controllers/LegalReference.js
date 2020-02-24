// @ts-check

const url = require("url");

const answerWithError = require("../helpers/answerWithError");
const getAgreementArticles = require("../libs/getAgreementArticles");
const getLaborCodeArticles = require("../libs/getLaborCodeArticles");
const { COMMON_HEADERS, LEGAL_REFERENCE_TYPE } = require("../constants");

const LEGAL_REFERENCE_TYPES = Object.values(LEGAL_REFERENCE_TYPE);

/**
 * @typedef {"PERIME" | "REMPLACE" | "VIGUEUR" | "VIGUEUR_ETEN" | "VIGUEUR_NON_ETEN"} AgreementState
 * - PERIME: ...
 * - REMPLACE: ...
 * - VIGUEUR: ...
 * - VIGUEUR_ETEN: ...
 * - VIGUEUR_NON_ETEN: ...
 *
 * TODO Check and describe this type.
 */
/**
 * @typedef {object} Agreement
 * @property {"section"} type
 * @property {AgreementData} data
 * @property {AgreementSection[]} children
 */
/**
 * @typedef {object} AgreementData
 * @property {string} id
 * @property {number} num
 * @property {string} shortTitle
 * @property {string[]} categorisation
 */
/**
 * @typedef {object} AgreementSection
 * @property {"section"} type
 * @property {AgreementSectionData} data
 * @property {(AgreementArticle | AgreementSection)[]} children
 */
/**
 * @typedef {object} AgreementSectionData
 * @property {number} intOrdre
 * @property {string} title
 * @property {string} id
 * @property {AgreementState} etat
 */
/**
 * @typedef {object} AgreementArticle
 * @property {"article"} type
 * @property {AgreementArticleData} data
 */
/**
 * @typedef {object} AgreementArticleData
 * @property {string} id
 * @property {string} cid
 * @property {string | null} num - Article index.
 * @property {number} intOrdre
 * @property {string} title
 * @property {string} content - Article HTML content.
 * @property {AgreementState} etat
 * @property {string=} historique - Article history note.
 */

/**
 * @typedef {object} BodyWithFullData
 * @property {string} name
 * @property {AgreementArticleData[]} data
 */

class LegalReference {
  /**
   * @param {import("http").IncomingMessage} req
   * @param {import("http").ServerResponse} res
   *
   * @example
   * - http://localhost:3200/legal-references?idcc=2216&type=agreement&category=article
   */
  index(req, res) {
    try {
      const queryParams = url.parse(String(req.url), true).query;
      const { idcc, query, type } = queryParams;

      switch (true) {
        case typeof idcc === "undefined":
          throw new Error("The `id` query parameter is mandatory.");

        case typeof type === "undefined":
          throw new Error("The `type` query parameter is mandatory.");

        case typeof idcc !== "string":
          throw new Error("The `id` query parameter must be a {string}.");

        case typeof type !== "string":
          throw new Error("The `type` query parameter must be a {string}.");

        case typeof query !== "undefined" && typeof query !== "string":
          throw new Error("The `query` query parameter must be a {string}.");

        case !LEGAL_REFERENCE_TYPES.includes(String(type)):
          // eslint-disable-next-line no-case-declarations
          const types = `"${LEGAL_REFERENCE_TYPES.join(`", "`)}"`;
          throw new Error(`The \`type\` query parameter must be one of: ${types}.`);
      }

      let body;
      switch (String(type)) {
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
