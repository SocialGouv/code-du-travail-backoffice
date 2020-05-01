import React from "react";

import Idcc from "../Idcc";

describe("elements/<Idcc />", () => {
  it(`should pass`, () => {
    const $idcc = testRender(<Idcc code="A Code" name="An Agreement" />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc).toMatchSnapshot();

    expect($idcc.text).toStrictEqual("A Code");
    expect($tooltip.text).toStrictEqual("An Agreement");
  });

  it(`should pass with {code} = null`, () => {
    const $idcc = testRender(<Idcc code={null} name="An Agreement" />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc.text).toStrictEqual("CDT");
    expect($tooltip.text).toStrictEqual("An Agreement");
  });

  it(`should pass with {name} = null`, () => {
    const $idcc = testRender(<Idcc code="A Code" name={null} />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc.text).toStrictEqual("A Code");
    expect($tooltip.text).toStrictEqual("Code du travail");
  });
});
