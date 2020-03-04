// @ts-check

const cache = require("../helpers/cache");
const convertHtmlToPlainText = require("../helpers/convertHtmlToPlainText");

const { LEGAL_REFERENCE_CATEGORY } = require("../constants");

/**
 * @typedef {object} LaborCodeArticle
 * @property {string} id
 * @property {string} cid
 * @property {string} num - Article index.
 * @property {number} intOrdre
 * @property {string} title
 * @property {string} content - Article HTML content.
 * @property {import("../types").ArticleState} etat
 */

const CACHE_TTL = 4 * 60 * 60; // => 4h

/**
 * @param {LaborCodeArticle} rawArticle
 *
 * @returns {import("../types").Article}
 */
function normalizeArticle(rawArticle) {
  const { etat, id, num, title } = rawArticle;
  const content = convertHtmlToPlainText(rawArticle.content);
  const index = num;
  const state = etat;
  const subtitle = null;
  const type = "article";

  const fullText = `${index} ${title}`;

  return {
    content,
    fullText,
    id,
    index,
    state,
    subtitle,
    title,
    type,
  };
}

/**
 * Get an agreement normalized list of articles.
 *
 * @returns {import("../types").Article[]}
 */
function getArticles() {
  const cacheKey = LEGAL_REFERENCE_CATEGORY.LABOR_CODE;

  // Use cache instead of require if it exists:
  const maybeCachedArticles = cache.get(cacheKey);
  if (maybeCachedArticles !== undefined) {
    return maybeCachedArticles;
  }

  const rawArticles =
    /** @type {LaborCodeArticle[]} */
    (require("../../data/labor-code.json"));

  const normalizedArticles = rawArticles.map(normalizeArticle);

  cache.set(cacheKey, normalizedArticles, CACHE_TTL);

  return normalizedArticles;
}

module.exports = {
  getArticles,
};
