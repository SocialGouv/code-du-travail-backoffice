// @ts-check

import answerWithKo from "../helpers/answerWithKo";
import answerWithOk from "../helpers/answerWithOk";
import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {string} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedChild(reactTestRenderer, testId) {
    if (typeof testId !== "string") {
      throw new Error(`Error: <testid> must be a string.`);
    }

    const jsonTree = reactTestRenderer.toJSON();

    if (jsonTree === null) {
      throw new Error(`Error: <reactTestRenderer>.toJSON() returned null.`);
    }

    const jsonNode = testId !== undefined ? findByTestId(jsonTree, testId) : jsonTree;

    if (jsonNode === null) {
      return answerWithKo(`Couldn't find any child with {data-testid}="${testId}".`);
    }

    return answerWithOk(`Found a child with {data-testid}="${testId}".`);
  },
});
