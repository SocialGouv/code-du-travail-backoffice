// @ts-check

/**
 * @param {string=} message
 *
 * @returns {jest.CustomMatcherResult}
 */
export default function answerWithKo(message = "") {
  return {
    message: () => message,
    pass: false,
  };
}
