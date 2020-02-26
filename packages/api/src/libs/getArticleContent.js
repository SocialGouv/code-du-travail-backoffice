// @ts-check

const htmlToText = require("html-to-text");
const unistUtilFlatFilter = require("unist-util-flat-filter");

const cache = require("../helpers/cache");
const { LEGAL_REFERENCE_TYPE } = require("../constants");

const INDEX = require("../../data/index.json");
/** @type {*} */
const LABOR_CODE_ARTICLES = require("../../data/labor-code.json");

/**
 * @typedef {"PERIME" | "REMPLACE" | "VIGUEUR" | "VIGUEUR_ETEN" | "VIGUEUR_NON_ETEN"} AgreementState
 * - PERIME: ...
 * - REMPLACE: ...
 * - VIGUEUR: ...
 * - VIGUEUR_ETEN: ...
 * - VIGUEUR_NON_ETEN: ...
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
 * @property {string=} surtitre
 * @property {string=} historique - Article history note.
 */

const CACHE_TTL = 4 * 60 * 60; // => 4h

/**
 * Get an agreement raw data from dependencies or cache.
 *
 * @param {string} articleId
 *
 * @returns {AgreementArticleData[]}
 *
 * TODO Dry that with getAgreementArticles().
 */
function getAgreement(articleId) {
  const cacheKey = `${LEGAL_REFERENCE_TYPE.AGREEMENT}-${articleId}`;

  // Use cache instead of require if it exists:
  const maybeCachedRawData = cache.get(cacheKey);
  if (maybeCachedRawData !== undefined) {
    return maybeCachedRawData;
  }

  /** @type {Agreement} */
  const agreement = require(`@socialgouv/kali-data/data/${articleId}.json`);

  if (agreement.children.length === 0) {
    cache.set(cacheKey, [], CACHE_TTL);

    return [];
  }

  /** @type {* | { type: string, children: AgreementArticle[] } | null } */
  const flatAgreementArticles = unistUtilFlatFilter(agreement, "article");

  /** @type {AgreementArticleData[]} */
  const agreementArticles =
    flatAgreementArticles === null
      ? []
      : flatAgreementArticles.children.map(article => article.data);

  cache.set(cacheKey, agreementArticles, CACHE_TTL);

  return agreementArticles;
}

/**
 * @param {string} articleId
 *
 * @returns {string}
 */
function getArticleContent(articleId) {
  let maybeArticle;

  if (articleId.startsWith("LEGIARTI")) {
    const articles = LABOR_CODE_ARTICLES;
    maybeArticle = articles.find(({ id }) => id === articleId);
    if (typeof maybeArticle === "undefined") {
      throw new Error(`This article "${articleId}" could not be found in Labor Code.`);
    }
  } else {
    const maybeIndex = INDEX.find(({ id }) => id === articleId);
    if (typeof maybeIndex === "undefined") {
      throw new Error(`This article "${articleId}" is not indexed.`);
    }

    const { agreementId } = maybeIndex;
    const articles = getAgreement(agreementId);
    maybeArticle = articles.find(({ id }) => id === articleId);
    if (typeof maybeArticle === "undefined") {
      throw new Error(`This article "${articleId}" could not be found in "${agreementId}".`);
    }
  }

  return htmlToText
    .fromString(maybeArticle.content, { wordwrap: 60 })
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

module.exports = getArticleContent;
