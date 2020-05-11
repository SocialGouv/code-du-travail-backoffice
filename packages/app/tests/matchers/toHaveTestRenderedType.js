// @ts-check

import answerWithOk from "../helpers/answerWithOk";
import answerWithType from "../helpers/answerWithType";
import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {string} expected Expected element type.
   * @param {string=} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedType(reactTestRenderer, expected, testId) {
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

    const received = jsonNode.type;

    if (received !== expected) {
      return answerWithType(received, expected);
    }

    return answerWithOk();
  },
});
