// @ts-check
// TODO Check and describe types.

const flatFilter = require("unist-util-flat-filter");
const FuseJs = require("fuse.js");

const cache = require("../helpers/cache");
const { LEGAL_REFERENCE_TYPE } = require("../constants");

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
 * Get an agreement raw data from dependencies or cache.
 *
 * @param {string} idcc
 *
 * @returns {AgreementArticleData[]}
 */
function getAgreement(idcc) {
  const id = getAgreementId(idcc);
  const cacheKey = `${LEGAL_REFERENCE_TYPE.AGREEMENT}-${id}`;

  // Use cache instead of require if it exists:
  const maybeCachedRawData = cache.get(cacheKey);
  if (maybeCachedRawData !== undefined) {
    return maybeCachedRawData;
  }

  /** @type {Agreement} */
  const agreement = require(`@socialgouv/kali-data/data/${id}.json`);

  if (agreement.children.length === 0) {
    cache.set(cacheKey, [], CACHE_TTL);

    return [];
  }

  /** @type {* | { type: string, children: AgreementArticle[] }} */
  const flatAgreementArticles = flatFilter(agreement, "article");

  /** @type {AgreementArticleData[]} */
  const agreementArticles = flatAgreementArticles.children.map(article => article.data);

  cache.set(cacheKey, agreementArticles, CACHE_TTL);

  return agreementArticles;
}

/**
 * @param {string} idcc
 * @param {string} query
 *
 * @returns {AgreementArticleData[]}
 */
function getAgreementArticles(idcc, query) {
  const rawData = getAgreement(idcc);

  /** @type {AgreementArticleData[]} */
  let filteredData = [];
  if (query !== undefined) {
    /** @type {import("fuse.js").FuseOptions<AgreementArticleData>} */
    const fuseJsOptions = {
      keys: [
        { name: "num", weight: 0.7 },
        { name: "content", weight: 0.3 },
      ],
    };

    const fuseJs = new FuseJs(rawData, fuseJsOptions);
    /** @type {*} */
    const results = fuseJs.search(query);
    /** @type {AgreementArticleData} */
    filteredData = results;
  } else {
    filteredData = [...rawData];
  }

  const data = filteredData.slice(0, 10);

  return data;
}

module.exports = getAgreementArticles;
