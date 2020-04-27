// @ts-check

const FuseJs = require("fuse.js");

const Agreement = require("../services/Agreement");

/**
 * @typedef {LegalReference.Article} ArticleWithScore
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

  let cleanQuery = query
    .replace(/\s+-|-\s+/g, " ")
    .replace(/[^a-z0-9áâàäéêèëíîìïóôòöúûùüç\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
  cleanQuery = "'" + cleanQuery.replace(/\s/g, " '");
  if (!cleanQuery.includes("article") && /'\d{1,2}$/.test(cleanQuery)) {
    cleanQuery = cleanQuery.replace(/'(\d{1,2}$)/, " '» 'Article $1$");
  }

  /** @type {Fuse.IFuseOptions<LegalReference.Article>} */
  const fuseJsOptions = {
    caseSensitive: false,
    distance: 999,
    findAllMatches: false,
    includeMatches: false,
    includeScore: true,
    keys: ["fullText"],
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.5,
    useExtendedSearch: true,
  };

  const fuseJs = new FuseJs(allArticles, fuseJsOptions);
  const foundArticles =
    /** @type {Fuse.FuseResult<LegalReference.Article>[]} */
    (fuseJs.search(cleanQuery));

  const foundArticlesWithScore = foundArticles
    .slice(0, 10)
    .map(({ item, score }) => ({ ...item, score }));

  return foundArticlesWithScore;
}

module.exports = findAgreementArticles;
