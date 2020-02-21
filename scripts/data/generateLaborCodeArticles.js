const fs = require("fs");
const path = require("path");

/**
 * @typedef {object} LaborCodeArticleRaw
 * @property {string} id
 * @property {string} cid
 * @property {string} num - Article index.
 * @property {string} nota - HTML content.
 * @property {string} bloc_textuel - Article HTML content.
 * @property {string} titre
 * @property {string} date_debut - ISO Date.
 */

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

const DEST_PATH = path.join(__dirname, `../../packages/api/data/labor-code.json`);

/** @type LaborCodeArticleRaw[] */
const rawLaborCodeArticles = require("./code-du-travail-20190701.json");

/** @type LaborCodeArticle[] */
const laborCodeArticles = rawLaborCodeArticles.map(({ id, cid, num, bloc_textuel, titre }) => ({
  id,
  cid,
  num,
  intOrdre: 0,
  title: titre,
  content: bloc_textuel,
  etat: "VIGUEUR",
}));

/** @type LaborCodeArticle[] */
const filteredLaborCodeArticles = laborCodeArticles
  // Remove strange L1, L2, L3 & Annexes... results.
  .filter(({ num }) => num.length > 2 && /^[DRL]/.test(num));

fs.writeFileSync(DEST_PATH, JSON.stringify(filteredLaborCodeArticles, null, 2));
