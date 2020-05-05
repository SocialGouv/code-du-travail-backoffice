// @ts-check

import "colors";

expect.extend({
  /**
   * @param {TestRendering} received
   * @param {number} expected
   */
  toHaveTestRenderedChildrenTimes(rendering, expected) {
    if (rendering === null || typeof rendering !== "object" || rendering.children === undefined) {
      throw new Error(`Expected ${rendering} to be a valid TestRendering object`);
    }

    if (rendering.children === null) {
      rendering.children = [];
    }

    const received = rendering.children.length;

    if (received === expected) {
      return {
        message: () => "",
        pass: true,
      };
    }

    return {
      message: () =>
        ["Expected: ", `${expected}`.green, "\n", "Received: ", `${received}`.red].join(""),
      pass: false,
    };
  },
});
