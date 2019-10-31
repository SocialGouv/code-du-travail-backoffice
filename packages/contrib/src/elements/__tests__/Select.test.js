import React from "react";

import Select from "../Select";

describe("[Contrib] elements/<Select />", () => {
  it(`should pass`, () => {
    const $select = testRender(<Select />);

    expect($select).toMatchSnapshot();
    expect($select).toHaveStyleRule("opacity", "1");
  });

  it(`should pass with {disabled}`, () => {
    const $select = testRender(<Select disabled />);

    expect($select).toHaveStyleRule("opacity", "0.25");
  });
});
