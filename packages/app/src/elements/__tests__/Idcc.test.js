import React from "react";

import Idcc from "../Idcc";

describe("elements/<Idcc />", () => {
  it(`should pass`, () => {
    const $idcc = testRender(<Idcc code="A Code" name="An Agreement" />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc).toMatchSnapshot();

    expect($idcc.innerText).toStrictEqual("A Code");
    expect($tooltip.innerText).toStrictEqual("An Agreement");
  });

  it(`should pass with {code} = null`, () => {
    const $idcc = testRender(<Idcc code={null} name="An Agreement" />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc.innerText).toStrictEqual("CDT");
    expect($tooltip.innerText).toStrictEqual("An Agreement");
  });

  it(`should pass with {name} = null`, () => {
    const $idcc = testRender(<Idcc code="A Code" name={null} />);
    const $tooltip = $idcc.findByType("div");

    expect($idcc.innerText).toStrictEqual("A Code");
    expect($tooltip.innerText).toStrictEqual("Code du travail");
  });
});
