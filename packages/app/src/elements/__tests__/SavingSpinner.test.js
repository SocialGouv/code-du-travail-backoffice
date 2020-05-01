import React from "react";

import SavingSpinner from "../SavingSpinner";

describe("elements/<SavingSpinner />", () => {
  it(`should pass`, () => {
    const $savingSpinner = testRender(<SavingSpinner />);
    const $spinner = $savingSpinner.children[3];

    expect($savingSpinner).toMatchSnapshot();
    expect($savingSpinner).toHaveStyleRule("height", "64px");
    expect($savingSpinner).toHaveStyleRule("width", "64px");

    expect($spinner).toHaveStyleRule("border", "6px solid white");
    expect($spinner).toHaveStyleRule("border-color", "white transparent transparent transparent");
    expect($spinner).toHaveStyleRule("height", "51px");
    expect($spinner).toHaveStyleRule("margin", "6px");
    expect($spinner).toHaveStyleRule("width", "51px");
  });

  it(`should pass with {color} = "red"`, () => {
    const $savingSpinner = testRender(<SavingSpinner color="red" />);
    const $spinner = $savingSpinner.children[3];

    expect($spinner).toHaveStyleRule("border", "6px solid red");
    expect($spinner).toHaveStyleRule("border-color", "red transparent transparent transparent");
  });

  it(`should pass with {size} = "32"`, () => {
    const $savingSpinner = testRender(<SavingSpinner size="32" />);
    const $spinner = $savingSpinner.children[3];

    expect($savingSpinner).toHaveStyleRule("height", "32px");
    expect($savingSpinner).toHaveStyleRule("width", "32px");

    expect($spinner).toHaveStyleRule("height", "26px");
    expect($spinner).toHaveStyleRule("margin", "3px");
    expect($spinner).toHaveStyleRule("width", "26px");
  });
});
