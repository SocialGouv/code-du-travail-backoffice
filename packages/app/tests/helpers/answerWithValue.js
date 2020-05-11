// @ts-check

import "colors";

/**
 * @param {*} received
 * @param {*} expected
 * @param {{ [key: string]: * }=} props
 *
 * @returns {jest.CustomMatcherResult}
 */
export default function answerWithValue(received, expected, props) {
  const $expected = (typeof expected === "string" ? `"${expected}"` : `${expected}`).green;
  const $received = (typeof received === "string" ? `"${received}"` : `${received}`).red;

  const message = `Expected: ${$expected}\nReceived: ${$received}`;

  if (props === undefined) {
    return {
      message: () => message,
      pass: false,
    };
  }

  const messageWithProps = `${message}\n\nProperties: ${JSON.stringify(props, null, 2)}`;

  return {
    message: () => messageWithProps,
    pass: false,
  };
}
