// @ts-check

const htmlToText = require("html-to-text");

/**
 * @param {string} source
 *
 * @returns {string}
 */
function convertHtmlToPlainText(source) {
  return htmlToText
    .fromString(source.replace(/\n+?\[[^\]]+\]\n+?/g, ""), { wordwrap: 60 })
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

module.exports = convertHtmlToPlainText;
