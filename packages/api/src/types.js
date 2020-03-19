// @ts-check
// TODO Check and describe types.

/**
 * @typedef {object} Article
 * @property {"article" | "section"} type
 * @property {string} id
 * @property {?string} index - Article index.
 * @property {ArticleState} state
 * @property {?string} title
 * @property {?string} subtitle
 * @property {?string} content - Article HTML content.
 * @property {string} fullText - Full-text for fuse search purposes.
 * @property {boolean} isAnnex - Is it an addional text article or section?
 */
/**
 * @typedef {"PERIME" | "REMPLACE" | "VIGUEUR" | "VIGUEUR_ETEN" | "VIGUEUR_NON_ETEN"} ArticleState
 * - PERIME: ...
 * - REMPLACE: ...
 * - VIGUEUR: ...
 * - VIGUEUR_ETEN: ...
 * - VIGUEUR_NON_ETEN: ...
 */

module.exports = {};
