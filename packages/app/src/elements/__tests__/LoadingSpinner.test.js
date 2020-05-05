import React from "react";

import LoadingSpinner from "../LoadingSpinner";

describe("elements/<LoadingSpinner />", () => {
  it(`should pass`, () => {
    const $loadingSpinner = testRender(<LoadingSpinner size="8rem" />);
    const $spinner = $loadingSpinner.children[0];
    const $spinnerNext = $loadingSpinner.children[1];

    expect($loadingSpinner).toMatchSnapshot();

    expect($spinner).toHaveTestRenderedProp("color", "var(--color-text-blue)");
    expect($spinnerNext).toHaveTestRenderedProp("color", "var(--color-text-blue)");

    expect($spinner).toHaveStyleRule("border", "4px solid var(--color-text-blue)");
  });

  it(`should pass with {color} = "red"`, () => {
    const $loadingSpinner = testRender(<LoadingSpinner color="red" />);
    const $spinner = $loadingSpinner.children[0];
    const $spinnerNext = $loadingSpinner.children[1];

    expect($spinner).toHaveTestRenderedProp("color", "red");
    expect($spinnerNext).toHaveTestRenderedProp("color", "red");

    expect($spinner).toHaveStyleRule("border", "4px solid red");
  });
});
