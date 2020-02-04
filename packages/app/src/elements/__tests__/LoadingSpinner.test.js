import React from "react";

import LoadingSpinner from "../LoadingSpinner";

describe("[Contrib] elements/<LoadingSpinner />", () => {
  it(`should pass`, () => {
    const $loadingSpinner = testRender(<LoadingSpinner size="8rem" />);
    const $spinner = $loadingSpinner.children[0];
    const $spinnerNext = $loadingSpinner.children[1];

    expect($loadingSpinner).toMatchSnapshot();
    expect($spinner.props).toHaveProperty("color", "white");
    expect($spinner).toHaveStyleRule("border", "4px solid white");
    expect($spinnerNext.props).toHaveProperty("color", "white");
  });

  it(`should pass with {color} = "red"`, () => {
    const $loadingSpinner = testRender(<LoadingSpinner color="red" />);
    const $spinner = $loadingSpinner.children[0];
    const $spinnerNext = $loadingSpinner.children[1];

    expect($spinner.props).toHaveProperty("color", "red");
    expect($spinner).toHaveStyleRule("border", "4px solid red");
    expect($spinnerNext.props).toHaveProperty("color", "red");
  });
});
