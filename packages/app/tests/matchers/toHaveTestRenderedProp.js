expect.extend({
  /**
   * @param {import("react-test-renderer").ReactTestRendererJSON} received
   * @param {string} propName
   * @param {string} propValue
   */
  toHaveTestRenderedProp(received, propName, propValue) {
    if (received === null || typeof received !== "object" || received.props === undefined) {
      throw new Error(`Expected ${received} to be a valid ReactTestRendererJSON object`);
    }

    if (received.props === null || typeof received.props !== "object") {
      throw new Error(`Expected ${received} to have valid props object`);
    }

    return received.props[propName] === propValue
      ? {
          message: `Expected ${propName} prop to equal "${propValue}"`,
          pass: true,
        }
      : {
          message: `Expected ${propName} prop to equal "${propValue}"`,
          pass: false,
        };
  },
});
