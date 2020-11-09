import passwordGenerator from "password-generator";

// const NUMERALS = "1234567890";
const NUMERALS_DISTINGUISHABLE = "3456789";
// const LOWER_ALPHA = "abcdefghijklmnopqrstuvwxyz";
// const UPPER_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_ALPHA_DISTINGUISHABLE = "abcdefghijkmnopqrstxyz";
const UPPER_ALPHA_DISTINGUISHABLE = "ABCDEFGHJKLMNPQRSTXY";
const SYMBOLS = "!'#$%&\"()*+,-./:;<=>?@[\\]^_`{|}~";

/**
 * Generate a <length> characters long password using Crypto.getRandomValues().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 * @see https://github.com/bermi/password-generator#password-generator
 */
export default function generatePassword(length) {
  const pattern = [
    NUMERALS_DISTINGUISHABLE,
    LOWER_ALPHA_DISTINGUISHABLE,
    UPPER_ALPHA_DISTINGUISHABLE,
    SYMBOLS,
  ]
    .join("")
    .replace(/\W/, "\\$1");

  return passwordGenerator(length, false, new RegExp(`[${pattern}]`));
}
