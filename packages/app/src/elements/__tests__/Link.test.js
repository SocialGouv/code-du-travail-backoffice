import React from "react";

import Link from "../Link";

describe("[Contrib] elements/<Link />", () => {
  const TEXT = "A Link";

  it(`should pass`, () => {
    const $link = testRender(<Link>{TEXT}</Link>);

    expect($link).toMatchSnapshot();
  });
});
