// @ts-check
// TODO Check and describe types.

const cache = require("../helpers/cache");
const convertHtmlToPlainText = require("../helpers/convertHtmlToPlainText");
const { LEGAL_REFERENCE_CATEGORY } = require("../constants");

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
 * @property {import("../types").ArticleState} etat
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
 * @property {?string} num - Article index.
 * @property {number} intOrdre
 * @property {string} content - Article HTML content.
 * @property {import("../types").ArticleState} etat
 * @property {string=} surtitre
 * @property {string=} historique - Article history note.
 */

/**
 * @typedef {object} AgreementIndex
 * @property {boolean=} active
 * @property {string=} date_publi - ISO Date.
 * @property {number=} effectif
 * @property {string=} etat
 * @property {string} id - KALI Agreement `id`.
 * @property {number=} mtime
 * @property {string} nature
 * @property {number} num - IDCC.
 * @property {string} shortTitle
 * @property {string=} texte_de_base
 * @property {string} title
 * @property {string=} url
 */

const CACHE_TTL = 4 * 60 * 60; // => 4h
/** @type {AgreementIndex[]} */
const AGREEMENTS_INDEX = require("@socialgouv/kali-data/data/index.json");

/**
 * @param {[import("../types").Article[], import("../types").Article]} prev
 * @param {AgreementArticle & AgreementSection} articleOrSection
 *
 * @returns {[import("../types").Article[], import("../types").Article | undefined]}
 */
function normalizeArticles([normalizedArticle, lastNormalizedSection], articleOrSection) {
  const { type } = articleOrSection;

  if (type === "section") {
    const { etat, id } = articleOrSection.data;
    const index = null;
    const state = etat;
    const subtitle = null;
    const title = articleOrSection.data.title.trim();

    const content = title;
    const fullText = title;

    /** @type {import("../types").Article} */
    const section = {
      content,
      fullText,
      id,
      index,
      state,
      subtitle,
      title,
      type,
    };

    return [[...normalizedArticle, section], section];
  }

  const { etat, id, num, surtitre } = articleOrSection.data;
  const content = convertHtmlToPlainText(articleOrSection.data.content);
  const index = num !== null ? num : null;
  const title = lastNormalizedSection !== undefined ? lastNormalizedSection.title : null;
  const state = etat;
  const subtitle = surtitre !== undefined ? surtitre.trim() : null;

  const fullText = `${index !== null ? `${index} ` : ""}${title !== null ? title : ""}`;

  /** @type {import("../types").Article} */
  const article = {
    content,
    fullText,
    id,
    index,
    state,
    subtitle,
    title,
    type,
  };

  return [[...normalizedArticle, article], lastNormalizedSection];
}

/**
 * Return flat list of sections and articles from a unist tree.
 *
 * @description
 * Also removes duplicated ids.
 *
 * @param {(AgreementArticle & AgreementSection)[]} tree
 * @param {AgreementArticle & AgreementSection} articleOrSection
 *
 * @returns {(AgreementArticle & AgreementSection)[]}
 *
 * @see https://github.com/syntax-tree/unist
 */
function flattenChildren(tree, articleOrSection) {
  const { id } = articleOrSection.data;

  // Skip duplicates:
  if (tree.length !== 0 && id === tree[tree.length - 1].data.id) {
    return tree;
  }

  if (articleOrSection.children === undefined) {
    return [...tree, articleOrSection];
  }

  return [...tree, articleOrSection, ...articleOrSection.children.reduce(flattenChildren, [])];
}

/**
 * Get an agreement KALI id from its IDCC.
 *
 * @param {string} idcc
 *
 * @returns {string}
 */
function getAgreementId(idcc) {
  const maybeAgreementIndex = AGREEMENTS_INDEX.find(({ num }) => num === Number(idcc));

  if (maybeAgreementIndex === undefined) {
    throw new Error(`There is no agreement for this IDCC (${idcc}).`);
  }

  return maybeAgreementIndex.id;
}

/**
 * Get an agreement normalized list of articles.
 *
 * @param {string} agreementIdOrIdcc
 *
 * @returns {import("../types").Article[]}
 */
function getArticles(agreementIdOrIdcc) {
  const agreementId = agreementIdOrIdcc.startsWith("KALICONT")
    ? agreementIdOrIdcc
    : getAgreementId(agreementIdOrIdcc);
  const cacheKey = `${LEGAL_REFERENCE_CATEGORY.AGREEMENT}-${agreementId}`;

  // Use cache instead of require if it exists:
  const maybeCachedArticles = cache.get(cacheKey);
  if (maybeCachedArticles !== undefined) {
    return maybeCachedArticles;
  }

  /** @type {Agreement} */
  const agreement = require(`@socialgouv/kali-data/data/${agreementId}.json`);

  if (agreement.children.length === 0) {
    cache.set(cacheKey, [], CACHE_TTL);

    return [];
  }

  const flatArticles = agreement.children.reduce(flattenChildren, []);
  const [normalizedArticles] = flatArticles.reduce(normalizeArticles, [[], undefined]);

  cache.set(cacheKey, normalizedArticles, CACHE_TTL);

  return normalizedArticles;
}

module.exports = {
  getArticles,
};
