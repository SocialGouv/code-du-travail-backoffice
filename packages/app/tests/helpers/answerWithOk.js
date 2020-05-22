// @ts-check

/**
 * @param {string=} message
 *
 * @returns {jest.CustomMatcherResult}
 */
export default function answerWithOk(message = "") {
  return {
    message: () => message,
    pass: true,
  };
}
