// @ts-check

import answerWithOk from "../helpers/answerWithOk";
import answerWithType from "../helpers/answerWithType";
import answerWithValue from "../helpers/answerWithValue";

expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
   * @param {string} propertyName Property name.
   * @param {?} expected Expected property value.
   * @param {string=} testId Targetted children `data-testid`.
   *
   * @returns {jest.CustomMatcherResult}
   */
  toHaveTestRenderedProperty(reactTestRenderer, propertyName, expected, testId) {
    if (typeof propertyName !== "string") {
      throw new Error(`Error: <propertyName> must be a string.`);
    }

    if (testId !== undefined && typeof testId !== "string") {
      throw new Error(`Error: <testid> must be a string.`);
    }

    const reactTestInstance =
      testId !== undefined
        ? reactTestRenderer.root.findByProps({ "data-testid": testId })
        : reactTestRenderer.root.children[0];

    if (typeof reactTestInstance === "string") {
      throw new Error(`Error: Found instance is a string, not a component.`);
    }

    const { props } = reactTestInstance;

    const received = props[propertyName];

    if (expected !== undefined && received === undefined) {
      return answerWithValue(undefined, expected, props);
    }

    if (expected !== null && received === null) {
      return answerWithValue(null, expected, props);
    }

    if (typeof received !== typeof expected) {
      return answerWithType(typeof received, typeof expected, props);
    }

    if (received !== expected) {
      return answerWithValue(received, expected, props);
    }

    return answerWithOk();
  },
});
