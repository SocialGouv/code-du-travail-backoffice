import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import Menu from "../Menu";

describe("[Contrib] layouts/<Menu />", () => {
  const props = {
    me: { payload: { name: "John Doe" } },
    router: { pathname: "/" }
  };

  const { asFragment, container, getByText } = render(<Menu {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Liste des réponses/));

    expect(Router.push).toBeCalledWith("/");
  });

  it.skip("should open the expected document", () => {
    fireEvent.click(getByText(/Charte rédactionnelle/));

    expect(Router.push).toBeCalledWith("/");
  });

  it("should match snapshot diff when the path has changed", () => {
    const newProps = {
      ...props,
      router: { pathname: "/chart" }
    };

    const { asFragment } = render(<Menu {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
