// @ts-check

const uuidV4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

/**
 * @param {string} input
 *
 * @returns {boolean}
 */
function isUuidValid(input) {
  return typeof input === "string" && uuidV4Regex.test(input);
}

module.exports = isUuidValid;
