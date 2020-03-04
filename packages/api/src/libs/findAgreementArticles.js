// @ts-check

const FuseJs = require("fuse.js");

const Agreement = require("../services/Agreement");

/**
 * @typedef {import("../types").Article} ArticleWithScore
 * @property {number} score
 */

/**
 * @param {string} idcc
 * @param {string} query
 *
 * @returns {ArticleWithScore[]}
 */
function findAgreementArticles(idcc, query) {
  const allArticles = Agreement.getArticles(idcc);

  /** @type {Fuse.FuseOptions<import("../types").Article>} */
  const fuseJsOptions = {
    distance: 100,
    includeScore: true,
    keys: ["fullText"],
    matchAllTokens: true,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    shouldSort: true,
    threshold: 0.6,
    tokenize: true,
  };

  const fuseJs = new FuseJs(allArticles, fuseJsOptions);
  const foundArticles =
    /** @type {Fuse.FuseResultWithScore<import("../types").Article>[]} */
    (fuseJs.search(query));

  const foundArticlesWithScore = foundArticles
    .slice(0, 10)
    .map(({ item, score }) => ({ ...item, score }));

  return foundArticlesWithScore;
}

module.exports = findAgreementArticles;
