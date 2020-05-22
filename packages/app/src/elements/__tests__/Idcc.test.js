import React from "react";
import { create } from "react-test-renderer";

import Idcc from "../Idcc";

describe("elements/<Idcc />", () => {
  const PROPS = {
    code: `A code`,
    name: `An agreement`,
  };

  it(`should pass`, () => {
    const props = {
      ...PROPS,
    };

    const $idcc = create(<Idcc {...props} />);

    expect($idcc).toHaveTestRenderedTextContent(props.code);
    expect($idcc).toHaveTestRenderedTextContent(props.name, "tooltip");
  });

  it(`should pass with {code} = null`, () => {
    const props = {
      ...PROPS,
      code: null,
    };

    const $idcc = create(<Idcc {...props} />);

    expect($idcc).toHaveTestRenderedTextContent(`CDT`);
    expect($idcc).toHaveTestRenderedTextContent(props.name, "tooltip");
  });

  it(`should pass with {name} = null`, () => {
    const props = {
      ...PROPS,
      name: null,
    };

    const $idcc = create(<Idcc {...props} />);

    expect($idcc).toHaveTestRenderedTextContent(props.code);
    expect($idcc).toHaveTestRenderedTextContent(`Code du travail`, "tooltip");
  });
});
