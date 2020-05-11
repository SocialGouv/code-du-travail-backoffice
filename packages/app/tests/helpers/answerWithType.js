// @ts-check

import "colors";

/**
 * @param {string} received
 * @param {string} expected
 * @param {{ [key: string]: * }=} props
 *
 * @returns {jest.CustomMatcherResult}
 */
export default function answerWithType(received, expected, props) {
  const $expected = expected.green;
  const $received = received.red;

  const message = `Expected type: ${$expected}\nReceived type: ${$received}`;

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
