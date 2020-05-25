// @ts-check

import answerWithOk from "../helpers/answerWithOk";
import answerWithValue from "../helpers/answerWithValue";
import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {number} expected
   * @param {string=} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedChildLength(reactTestRenderer, expected, testId) {
    if (typeof expected !== "number") {
      throw new Error(`Error: <expected> must be a number.`);
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

    const received = jsonNode.children !== null ? jsonNode.children.length : 0;

    if (received !== expected) {
      return answerWithValue(received, expected);
    }

    return answerWithOk();
  },
});
