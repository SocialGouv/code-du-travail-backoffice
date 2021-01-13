// @ts-check

import * as jestEmotion from "@emotion/jest";

import findByTestId from "../helpers/findByTestId";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {string} propertyName Property name.
   * @param {string | number} expected Expected property value.
   * @param {import("@emotion/jest").StyleRuleOptions=} options Expected property value.
   * @param {string=} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedStyleRule(reactTestRenderer, propertyName, expected, options, testId) {
    if (typeof propertyName !== "string") {
      throw new Error(`Error: <propertyName> must be a string.`);
    }

    if (typeof expected !== "number" && typeof expected !== "string") {
      throw new Error(`Error: <expected> must be a number or a string.`);
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

    return jestEmotion.matchers.toHaveStyleRule(jsonNode, propertyName, expected, options);
  },
});
