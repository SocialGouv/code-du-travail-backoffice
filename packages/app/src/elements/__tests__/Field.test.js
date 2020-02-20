import React from "react";

import Field from "../Field";

describe("elements/<Field />", () => {
  it(`should pass`, () => {
    const $field = testRender(<Field />);

    expect($field).toMatchSnapshot();
  });

  it(`should pass with {error}`, () => {
    const $field = testRender(<Field error="An Error" />);
    const $error = $field.findByType("div");

    expect($field).toMatchSnapshot();
    expect($error).not.toBeUndefined();
  });
});
