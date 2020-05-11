// @ts-check

import answerWithOk from "../helpers/answerWithOk";
import answerWithValue from "../helpers/answerWithValue";
import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {RegExp | string} expected
   * @param {string=} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedTextContent(reactTestRenderer, expected, testId) {
    if (typeof expected !== "string" && !(expected instanceof RegExp)) {
      throw new Error(`Error: <expected> must be a string or a RegExp.`);
    }

    if (testId !== undefined && typeof testId !== "string") {
      throw new Error(`Error: <testid> must be a string.`);
    }

    const jsonTree = reactTestRenderer.toJSON();

    if (jsonTree === null) {
      throw new Error(`Error: <reactTestRenderer>.toJSON() returned null.`);
    }

    const jsonNode = testId !== undefined ? findByTestId(jsonTree, testId) : jsonTree;

    const reactTestInstance =
      testId !== undefined
        ? reactTestRenderer.root.findByProps({ "data-testid": testId })
        : reactTestRenderer.root.children[0];

    if (typeof reactTestInstance === "string") {
      throw new Error(`Error: The found instance is a string.`);
    }

    if (jsonNode === null) {
      throw new Error(`Error: Couldn't find {data-testid}="${testId}".`);
    }

    if (jsonNode.children === null || jsonNode.children.length === 0) {
      throw new Error(`Error: {data-testid}="${testId}" doesn't have any child.`);
    }

    const received = jsonNode.children.filter(child => typeof child === "string").join("");

    if (typeof expected === "string" && received !== expected) {
      return answerWithValue(received, expected);
    }

    if (expected instanceof RegExp && !expected.test(received)) {
      return answerWithValue(received, expected);
    }

    return answerWithOk();
  },
});
