// @ts-check

const Agreement = require("../services/Agreement");
const LaborCode = require("../services/LaborCode");

const INDEX = require("../../data/index.json");

/**
 * @param {string} articleId
 *
 * @returns {LegalReference.Article}
 */
function getArticleById(articleId) {
  /** @type {LegalReference.Article[]} */
  let articles;

  if (articleId.startsWith("KALI")) {
    const maybeIndex = INDEX.find(({ id }) => id === articleId);
    if (typeof maybeIndex === "undefined") {
      throw new Error(`This article "${articleId}" is not indexed.`);
    }

    const { agreementId } = maybeIndex;
    articles = Agreement.getArticles(agreementId);
  } else {
    articles = LaborCode.getArticles();
  }

  const maybeArticle = articles.find(({ id }) => id === articleId);
  if (typeof maybeArticle === "undefined") {
    throw new Error(`This article "${articleId}" could not be found.`);
  }

  return maybeArticle;
}

module.exports = getArticleById;
