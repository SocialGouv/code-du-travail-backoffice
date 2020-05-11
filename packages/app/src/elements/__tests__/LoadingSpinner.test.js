import React from "react";
import { create } from "react-test-renderer";

import LoadingSpinner from "../LoadingSpinner";

describe("elements/<LoadingSpinner />", () => {
  it(`should pass`, () => {
    const $loadingSpinner = create(<LoadingSpinner size="8rem" />);

    expect($loadingSpinner).toHaveTestRenderedProperty(
      "color",
      "var(--color-text-blue)",
      "spinner",
    );
    expect($loadingSpinner).toHaveTestRenderedStyleRule(
      "border",
      "4px solid var(--color-text-blue)",
      {},
      "spinner",
    );

    expect($loadingSpinner).toHaveTestRenderedProperty(
      "color",
      "var(--color-text-blue)",
      "spinner-next",
    );
  });

  it(`should pass with {color} = "red"`, () => {
    const $loadingSpinner = create(<LoadingSpinner color="red" />);

    expect($loadingSpinner).toHaveTestRenderedProperty("color", "red", "spinner");
    expect($loadingSpinner).toHaveTestRenderedStyleRule("border", "4px solid red", {}, "spinner");

    expect($loadingSpinner).toHaveTestRenderedProperty("color", "red", "spinner-next");
  });
});
