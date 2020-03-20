import React from "react";

import Idcc from "../Idcc";

// TODO Unskip this tests once "react-tooltip" is fixed.
// https://github.com/wwayne/react-tooltip/issues/562
describe.skip("elements/<Idcc />", () => {
  const COMMON_PROPS = {
    name: "A Labor Agreement",
  };

  it(`should pass`, () => {
    const $idcc = testRender(<Idcc {...COMMON_PROPS} />);

    expect($idcc).toMatchSnapshot();
    expect($idcc.props).toHaveProperty("data-tip", "Code du travail");
    expect($idcc.children[0]).toStrictEqual("CDT");
  });

  it(`should pass with {code} = 1234`, () => {
    const CODE = 1234;
    const $idcc = testRender(<Idcc code={CODE} {...COMMON_PROPS} />);

    expect($idcc.props).toHaveProperty("data-tip", COMMON_PROPS.name);
    expect($idcc.children[0]).toStrictEqual(`IDCC: ${CODE}`);
  });
});
