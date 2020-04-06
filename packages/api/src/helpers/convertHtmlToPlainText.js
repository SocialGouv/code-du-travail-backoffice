// @ts-check

const htmlToText = require("html-to-text");

// https://github.com/werk85/node-html-to-text#options
const HTML_TO_TEXT_OPTIONS = {
  ignoreHref: true,
  ignoreImage: true,
  wordwrap: 60,
};

/**
 * @param {string} source
 *
 * @returns {string}
 */
function convertHtmlToPlainText(source) {
  return htmlToText
    .fromString(source, HTML_TO_TEXT_OPTIONS)
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

module.exports = convertHtmlToPlainText;
