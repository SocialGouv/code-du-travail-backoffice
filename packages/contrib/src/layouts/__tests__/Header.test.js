import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import Header from "../Header";

const JWT = "aFakeJWT";
const ME = { payload: { name: "A Name" } };

describe("[Contrib] layouts/<Header />", () => {
  const props = {
    router: {
      pathname: "/"
    }
  };

  const γ = render(<Header {...props} />);
  const firstRender = γ.container;

  it("[Anonymous] should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
  });

  it("[Contributor] should match snapshot diff", () => {
    sessionStorage.setItem("me", JSON.stringify(ME));
    sessionStorage.setItem("jwt", JWT);

    const newProps = {
      ...props,
      hasContribMenu: true
    };

    const Γ = render(<Header {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(Γ.asFragment());

    fireEvent.click(Γ.getAllByAltText(/Code du travail numérique/)[1]);

    expect(Router.push).toHaveBeenCalledWith("/");
  });

  it("[Administrator] should match snapshot", () => {
    sessionStorage.setItem("me", JSON.stringify(ME));
    sessionStorage.setItem("jwt", JWT);

    const newProps = {
      ...props,
      hasContribMenu: true,
      isAdmin: true
    };

    const Γ = render(<Header {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(Γ.asFragment());

    fireEvent.click(Γ.getAllByAltText(/Code du travail numérique/)[2]);

    expect(Router.push).toHaveBeenCalledWith("/admin");
  });
});
