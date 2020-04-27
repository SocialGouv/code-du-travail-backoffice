// @ts-check

const FuseJs = require("fuse.js");

const LaborCode = require("../services/LaborCode");

/**
 * @typedef {LegalReference.Article} ArticleWithScore
 * @property {number} score
 */

/**
 * @param {string} query
 *
 * @returns {ArticleWithScore[]}
 */
function findLaborCodeArticles(query) {
  const allArticles = LaborCode.getArticles();

  /** @type {Fuse.IFuseOptions<LegalReference.Article>} */
  const fuseJsOptions = {
    distance: 0,
    includeScore: true,
    keys: ["index"],
    shouldSort: true,
  };

  const fuseJs = new FuseJs(allArticles, fuseJsOptions);
  const foundArticles =
    /** @type {Fuse.FuseResult<LegalReference.Article>[]} */
    (fuseJs.search(query));

  const foundArticlesWithScore = foundArticles
    .slice(0, 10)
    .map(({ item, score }) => ({ ...item, score }));

  return foundArticlesWithScore;
}

module.exports = findLaborCodeArticles;
