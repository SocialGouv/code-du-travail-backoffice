// @ts-check

/**
 * @param {string} input
 *
 * @returns {boolean}
 */
function isJsonValid(input) {
  try {
    JSON.parse(input);

    return true;
  } catch (e) {
    return false;
  }
}

module.exports = isJsonValid;
