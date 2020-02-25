// @ts-check

const FuseJs = require("fuse.js");

/**
 * @typedef {object} LaborCodeArticle
 * @property {string} id
 * @property {string} cid
 * @property {string} num - Article index.
 * @property {number} intOrdre
 * @property {string} title
 * @property {string} content - Article HTML content.
 * @property {"VIGUEUR"} etat
 */

/** @type {*} */
const LABOR_CODE_ARTICLES = require("../../data/labor-code.json");

/**
 * @param {string} query
 *
 * @returns {LaborCodeArticle[]}
 */
function getLaborCodeArticles(query) {
  /** @type {LaborCodeArticle[]} */
  const rawData = LABOR_CODE_ARTICLES;

  /** @type {import("fuse.js").FuseOptions<LaborCodeArticle>} */
  const fuseJsOptions = {
    keys: [
      { name: "num", weight: 0.9 },
      { name: "content", weight: 0.1 },
    ],
  };

  const fuseJs = new FuseJs(rawData, fuseJsOptions);
  /** @type {*} */
  const results = fuseJs.search(query);
  /** @type {LaborCodeArticle[]} */
  const filteredData = results;

  const data = filteredData.slice(0, 10);

  return data;
}

module.exports = getLaborCodeArticles;
