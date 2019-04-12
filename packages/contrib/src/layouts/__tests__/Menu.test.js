import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import Menu from "../Menu";

describe("[Contrib] layouts/<Menu />", () => {
  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", "/");

  const { asFragment, container, getByText } = render(<Menu />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Liste des réponses/));

    expect(Router.push).toBeCalledWith("/");
  });

  it("should open the expected document", () => {
    fireEvent.click(getByText(/Charte rédactionnelle/));

    expect(Router.push).toBeCalledWith("/");
  });

  it("should match snapshot diff when the path has changed", () => {
    window.history.pushState({}, "", "/chart");

    const { asFragment } = render(<Menu />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
