import React from "react";
import { create } from "react-test-renderer";

import Select from "../Select";

describe("elements/<Select />", () => {
  it(`should pass`, () => {
    const $select = create(<Select instanceId="an-instance-id" />);

    expect($select).toHaveTestRenderedStyleRule("margin-left", "0");
    expect($select).toHaveTestRenderedStyleRule("margin-right", "0");
  });

  it(`should pass with {withMarginLeft}`, () => {
    const $select = create(<Select instanceId="an-instance-id" withMarginLeft />);

    expect($select).toHaveTestRenderedStyleRule("margin-left", "1rem");
    expect($select).toHaveTestRenderedStyleRule("margin-right", "0");
  });

  it(`should pass with {withMarginRight}`, () => {
    const $select = create(<Select instanceId="an-instance-id" withMarginRight />);

    expect($select).toHaveTestRenderedStyleRule("margin-left", "0");
    expect($select).toHaveTestRenderedStyleRule("margin-right", "1rem");
  });
});
