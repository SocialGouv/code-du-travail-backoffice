// @ts-check

const Agreement = require("../services/Agreement");
const LaborCode = require("../services/LaborCode");

const INDEX = /** @type {LegalReference.ArticleIndex[]} */ (require("../../data/index.json"));

/**
 * @param {string} articleId
 *
 * @returns {?LegalReference.Article}
 */
function getArticleById(articleId) {
  /** @type {LegalReference.Article[]} */
  let articles;

  if (articleId.startsWith("KALI")) {
    const maybeIndex = INDEX.find(({ id }) => id === articleId);
    if (typeof maybeIndex === "undefined") {
      return null;
    }

    const { agreementId } = maybeIndex;
    articles = Agreement.getArticles(agreementId);
  } else {
    articles = LaborCode.getArticles();
  }

  const maybeArticle = articles.find(({ id }) => id === articleId);
  if (typeof maybeArticle === "undefined") {
    return null;
  }

  return maybeArticle;
}

module.exports = getArticleById;
