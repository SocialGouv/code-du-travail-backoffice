expect.extend({
  /**
   * @param {*} received
   * @param {string} className
   */
  toHaveTestRenderedClass(received, className) {
    if (received === null || typeof received !== "object" || received.props === undefined) {
      throw new Error(`Expected ${received} to be a valid ReactTestRendererJSON object`);
    }

    if (typeof received.props.className !== "string") {
      throw new Error(`Expected ${received} to be have a {string} className property`);
    }

    return received.props.className.split(" ").includes(className)
      ? {
          message: `Expected ${received} className property not to include ${className}`,
          pass: true,
        }
      : {
          message: `Expected ${received} className property to include ${className}`,
          pass: false,
        };
  },
});
