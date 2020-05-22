import React from "react";
import { create } from "react-test-renderer";

import SavingSpinner from "../SavingSpinner";

describe("elements/<SavingSpinner />", () => {
  it(`should pass`, () => {
    const $savingSpinner = create(<SavingSpinner />);

    expect($savingSpinner).toHaveTestRenderedStyleRule("height", "64px");
    expect($savingSpinner).toHaveTestRenderedStyleRule("width", "64px");

    expect($savingSpinner).toHaveTestRenderedStyleRule("border", "6px solid white", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule(
      "border-color",
      "white transparent transparent transparent",
      {},
      "spinner",
    );
    expect($savingSpinner).toHaveTestRenderedStyleRule("height", "51px", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule("margin", "6px", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule("width", "51px", {}, "spinner");
  });

  it(`should pass with {color} = "red"`, () => {
    const $savingSpinner = create(<SavingSpinner color="red" />);

    expect($savingSpinner).toHaveTestRenderedStyleRule("border", "6px solid red", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule(
      "border-color",
      "red transparent transparent transparent",
      {},
      "spinner",
    );
  });

  it(`should pass with {size} = 32`, () => {
    const $savingSpinner = create(<SavingSpinner size={32} />);

    expect($savingSpinner).toHaveTestRenderedStyleRule("height", "32px");
    expect($savingSpinner).toHaveTestRenderedStyleRule("width", "32px");

    expect($savingSpinner).toHaveTestRenderedStyleRule("height", "26px", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule("margin", "3px", {}, "spinner");
    expect($savingSpinner).toHaveTestRenderedStyleRule("width", "26px", {}, "spinner");
  });
});
