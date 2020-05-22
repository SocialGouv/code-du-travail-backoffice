// @ts-check

const cache = require("../helpers/cache");
const convertHtmlToPlainText = require("../helpers/convertHtmlToPlainText");
const { LEGAL_REFERENCE_CATEGORY } = require("../constants");

const CACHE_TTL = 4 * 60 * 60; // => 4h
const AGREEMENTS_INDEX =
  /** @type {import("@socialgouv/kali-data").IndexAgreement[]} */
  require("@socialgouv/kali-data/data/index.json");

/**
 * @param {[LegalReference.Article[], string | undefined]} prev
 * @param {import("@socialgouv/kali-data").AgreementArticleOrSection} articleOrSection
 *
 * @returns {[LegalReference.Article[], string | undefined]}
 */
function normalizeMainArticles([normalizedArticles, lastSectionTitle], articleOrSection) {
  const { type } = articleOrSection;

  if (type === "section") {
    const kaliSection =
      /** @type {import("@socialgouv/kali-data").AgreementSection} */
      (articleOrSection);
    const { title } = kaliSection.data;

    const sectionTitle = title.trim();

    return [normalizedArticles, sectionTitle];
  }

  const kaliArticle =
    /** @type {import("@socialgouv/kali-data").AgreementArticle} */
    (articleOrSection);
  const { cid, etat, id, num, surtitre } = kaliArticle.data;
  const content = convertHtmlToPlainText(kaliArticle.data.content);
  const index = num !== null ? num : null;
  const title = lastSectionTitle !== undefined ? lastSectionTitle : null;
  const state = etat;
  const subtitle = surtitre !== undefined ? surtitre.trim() : null;

  const fullText = `${index !== null ? `Article ${index}` : ""}${
    title !== null ? ` (${title})` : ""
  }`;

  /** @type {LegalReference.Article} */
  const article = {
    agreementId: "",
    cid,
    content,
    fullText,
    id,
    index,
    isAnnex: false,
    state,
    subtitle,
    title,
    type,
  };

  return [[...normalizedArticles, article], lastSectionTitle];
}

/**
 * @param {import("@socialgouv/kali-data").AgreementArticleOrSection} articleOrSection
 * @param {string[]} path
 *
 * @returns {LegalReference.Article[]}
 */
function normalizeAdditionalSectionArticles(articleOrSection, path) {
  const { type } = articleOrSection;

  if (type === "section") {
    const kaliSection =
      /** @type {import("@socialgouv/kali-data").AgreementSection} */
      (articleOrSection);
    const {
      children,
      data: { title },
    } = kaliSection;

    path.push(title);

    return children.reduce(
      (prev, kaliSection) => [...prev, ...normalizeAdditionalSectionArticles(kaliSection, path)],
      [],
    );
  }

  const kaliArticle =
    /** @type {import("@socialgouv/kali-data").AgreementArticle} */
    (articleOrSection);
  const { cid, etat, id, num, surtitre } = kaliArticle.data;
  const content = convertHtmlToPlainText(kaliArticle.data.content);
  const index = num !== null ? num : null;
  const title = path.join(" » ");
  const state = etat;
  const subtitle = surtitre !== undefined ? surtitre.trim() : null;

  const fullText = `${title}${index !== null ? ` » Article ${index}` : ""}`;

  /** @type {LegalReference.Article} */
  const article = {
    agreementId: "",
    cid,
    content,
    fullText,
    id,
    index,
    isAnnex: true,
    state,
    subtitle,
    title,
    type,
  };

  return [article];
}

/**
 * @param {LegalReference.Article[]} normalizedArticles
 * @param {import("@socialgouv/kali-data").AgreementSection} section
 *
 * @returns {LegalReference.Article[]}
 */
function flattenAdditionalArticles(normalizedArticles, section) {
  const {
    children,
    data: { title },
  } = section;

  const newNormalizedArticles = children.reduce(
    (prev, articleOrSection) => [
      ...prev,
      ...normalizeAdditionalSectionArticles(articleOrSection, [title]),
    ],
    [],
  );

  return [...normalizedArticles, ...newNormalizedArticles];
}

/**
 * Return flat list of sections and articles from a unist tree.
 *
 * @description
 * Also removes duplicated ids.
 *
 * @param {import("@socialgouv/kali-data").AgreementArticle[]} tree
 * @param {import("@socialgouv/kali-data").AgreementArticleOrSection} articleOrSection
 *
 * @returns {import("@socialgouv/kali-data").AgreementArticleOrSection[]}
 *
 * @see https://github.com/syntax-tree/unist
 */
function flattenMainArticles(tree, articleOrSection) {
  const { type } = articleOrSection;
  const { id } = articleOrSection.data;

  // Skip duplicates:
  if (tree.length !== 0 && id === tree[tree.length - 1].data.id) {
    return tree;
  }

  if (type === "article") {
    const kaliArticle =
      /** @type {import("@socialgouv/kali-data").AgreementArticle} */
      (articleOrSection);

    return [...tree, kaliArticle];
  }

  const kaliSection =
    /** @type {import("@socialgouv/kali-data").AgreementSection} */
    (articleOrSection);
  const sectionWithoutChildren =
    /** @type {import("@socialgouv/kali-data").AgreementSection} */
    ({ ...kaliSection });
  delete sectionWithoutChildren.children;

  return [...tree, sectionWithoutChildren, ...kaliSection.children.reduce(flattenMainArticles, [])];
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
 * @returns {LegalReference.Article[]}
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

  const agreement =
    /** @type {import("@socialgouv/kali-data").Agreement} */
    require(`@socialgouv/kali-data/data/${agreementId}.json`);

  if (agreement.children.length === 0) {
    cache.set(cacheKey, [], CACHE_TTL);

    return [];
  }

  const flatMainArticles = agreement.children[0].children.reduce(flattenMainArticles, []);
  const [normalizedMainArticles] = flatMainArticles.reduce(normalizeMainArticles, [[], undefined]);

  const normalizedAdditionalArticles =
    agreement.children.length > 1
      ? agreement.children.slice(1).reduce(flattenAdditionalArticles, [])
      : [];

  const normalizedArticles = [
    ...normalizedMainArticles,
    ...normalizedAdditionalArticles,
  ].map(article => ({ ...article, agreementId }));

  cache.set(cacheKey, normalizedArticles, CACHE_TTL);

  return normalizedArticles;
}

module.exports = {
  getArticles,
};
