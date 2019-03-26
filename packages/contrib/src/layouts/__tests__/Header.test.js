import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import Header from "../Header";

describe("[Contrib] layouts/<Header />", () => {
  const me = {
    payload: {
      name: "A Name",
      location: "A Location"
    }
  };
  const jwt = "aFakeJWT";

  let λ;

  it("[Anonymous User] should match snapshot", () => {
    λ = render(<Header />);

    expect(λ.container).toMatchSnapshot();
    expect(λ.queryByText("A Name")).not.toBeInTheDocument();
    expect(λ.queryByText("A Location")).not.toBeInTheDocument();
  });

  it("should attempt to redirect to the non-administrator dashboard", () => {
    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, "A Non Admin Page", "/a-non-admin-path");

    fireEvent.click(λ.getByAltText(/Code du travail numérique/));

    expect(Router.push).toHaveBeenCalledWith("/");
  });

  it("should attempt to redirect to the administrator dashboard", () => {
    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, "An Admin Page", "/admin/an-admin-path");

    fireEvent.click(λ.getByAltText(/Code du travail numérique/));

    expect(Router.push).toHaveBeenCalledWith("/admin");
  });

  it("[Authenticated User] should match snapshot", () => {
    sessionStorage.setItem("me", JSON.stringify(me));
    sessionStorage.setItem("jwt", jwt);

    λ = render(<Header />);

    expect(λ.container).toMatchSnapshot();

    expect(λ.queryByText("A Name")).toBeInTheDocument();
    expect(λ.queryByText("A Location")).toBeInTheDocument();
  });

  it("should match snapshot for an authenticated user", () => {
    fireEvent.click(λ.getByAltText(/Bouton de déconnexion/));

    expect(sessionStorage.getItem("me")).toBe(null);
    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(Router.push).toHaveBeenCalledWith("/login");
  });
});
