import React from "react";

import Select from "../Select";

describe("elements/<Select />", () => {
  it(`should pass`, () => {
    const βselect = testRender(<Select />);

    expect(βselect).toMatchSnapshot();
  });

  it(`should pass with {withMarginLeft}`, () => {
    const βselect = testRender(<Select withMarginLeft />);

    expect(βselect).toHaveStyleRule("margin-left", "1rem");
    expect(βselect).toHaveStyleRule("margin-right", "0");
  });

  it(`should pass with {withMarginRight}`, () => {
    const βselect = testRender(<Select withMarginRight />);

    expect(βselect).toHaveStyleRule("margin-left", "0");
    expect(βselect).toHaveStyleRule("margin-right", "1rem");
  });
});
