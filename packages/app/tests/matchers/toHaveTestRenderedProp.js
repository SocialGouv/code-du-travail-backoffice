// @ts-check

expect.extend({
  /**
   * @param {TestRendering} rendering
   * @param {string} name
   * @param {string} expected
   */
  toHaveTestRenderedProp(rendering, name, expected) {
    if (
      rendering === null ||
      typeof rendering !== "object" ||
      rendering.props === undefined ||
      rendering.props === null ||
      typeof rendering.props !== "object"
    ) {
      throw new Error(`Expected ${rendering} to be a valid TestRendering object`);
    }

    if (rendering.props === null || typeof rendering.props !== "object") {
      throw new Error(`Expected ${rendering} to have valid props object`);
    }

    const received = rendering.props[name];

    if (received === expected) {
      return {
        message: () => "",
        pass: true,
      };
    }

    return {
      message: () =>
        [
          "Expected: ",
          typeof expected === "string" ? `"${expected}"`.green : String(expected).green,
          "\n",
          "Received: ",
          typeof received === "string" ? `"${received}"`.red : String(received).red,
        ].join(""),
      pass: false,
    };
  },
});
