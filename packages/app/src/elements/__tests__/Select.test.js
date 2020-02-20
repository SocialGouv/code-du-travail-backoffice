import React from "react";

import Select from "../Select";

describe("elements/<Select />", () => {
  it(`should pass`, () => {
    const $select = testRender(<Select />);

    expect($select).toMatchSnapshot();
  });
});
