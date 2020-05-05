// @ts-check

import "colors";

expect.extend({
  /**
   * @param {TestRendering} received
   * @param {string} expected
   */
  toHaveTestRenderedText(rendering, expected) {
    if (rendering === null || typeof rendering !== "object" || rendering.innerText === undefined) {
      throw new Error(`Expected ${rendering} to be a valid TestRendering object`);
    }

    const received = rendering.innerText;

    if (received === expected) {
      return {
        message: () => "",
        pass: true,
      };
    }

    return {
      message: () =>
        ["Expected: ", `"${expected}"`.green, "\n", "Received: ", `"${received}"`.red].join(""),
      pass: false,
    };
  },
});
