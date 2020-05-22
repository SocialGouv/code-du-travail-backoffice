// @ts-check

import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {string} expected
   * @param {string=} testId Targetted children `data-testid`.
   */
  toHaveTestRenderedClassName(reactTestRenderer, expected, testId) {
    if (typeof expected !== "string") {
      throw new Error(`Error: <expected> must be a string.`);
    }

    if (testId !== undefined && typeof testId !== "string") {
      throw new Error(`Error: <testid> must be a string.`);
    }

    const jsonTree = reactTestRenderer.toJSON();

    if (jsonTree === null) {
      throw new Error(`Error: <reactTestRenderer>.toJSON() returned null.`);
    }

    const jsonNode = testId !== undefined ? findByTestId(jsonTree, testId) : jsonTree;

    if (jsonNode === null) {
      throw new Error(`Error: Couldn't find {data-testid}="${testId}".`);
    }

    const { props } = jsonNode;

    if (props.className === undefined) {
      throw new Error(`Error: {className} is undefined.`);
    }

    const received = props.className;

    if (received.split(/ +/).includes(expected)) {
      return {
        message: () => "",
        pass: true,
      };
    }

    return {
      message: () => `Expected "${received}" {className} to include "${expected}"`,
      pass: false,
    };
  },
});
