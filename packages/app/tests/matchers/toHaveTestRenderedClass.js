// @ts-check

expect.extend({
  /**
   * @param {TestRendering} received
   * @param {string} expected
   */
  toHaveTestRenderedClass(rendering, expected) {
    if (rendering === null || typeof rendering !== "object" || rendering.props === undefined) {
      throw new Error(`Expected ${rendering} to be a valid TestRendering object`);
    }

    if (typeof rendering.props.className !== "string") {
      throw new Error(`Expected ${rendering} to be have a {string} className property`);
    }

    const received = rendering.props.className;

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
