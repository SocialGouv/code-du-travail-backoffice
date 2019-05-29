import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

global.open = jest.fn();

import Menu from "../Menu";

describe("[Contrib] layouts/<Menu /> (Contributor)", () => {
  const props = {
    me: { payload: { name: "John Doe" } },
    router: { pathname: "/" }
  };

  const JWT = "A Fake Token";
  const ME = JSON.stringify(props.me);

  const γ = render(<Menu {...props} />);
  const firstRender = γ.asFragment();

  it("should match snapshot", () => {
    sessionStorage.setItem("jwt", JWT);
    sessionStorage.setItem("me", ME);

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(γ.container).toMatchSnapshot();
  });

  it("should redirect to the answers index path", () => {
    fireEvent.click(γ.getByText("Liste des réponses"));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(Router.push).toHaveBeenCalledWith("/");
  });

  it("should open the contribution guide URL", () => {
    fireEvent.click(γ.getByText("Guide : Outil de contribution"));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.open).toHaveBeenCalledWith(
      "https://jean-rene-duscher.gitbook.io/code-du-travail-numerique/",
      "_blank"
    );
  });

  it("should redirect to the chart path", () => {
    fireEvent.click(γ.getByText("Charte rédactionnelle"));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(Router.push).toHaveBeenCalledWith("/chart");
  });

  it("should empty session and redirect to login path", () => {
    fireEvent.click(γ.getAllByText("Se déconnecter")[0]);

    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(sessionStorage.getItem("me")).toBe(null);
    expect(Router.push).toHaveBeenCalledWith("/login");
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

describe("[Contrib] layouts/<Menu /> (Admin)", () => {
  const props = {
    isAdmin: true,
    me: { payload: { name: "John Doe" } },
    router: { pathname: "/" }
  };

  const JWT = "A Fake Token";
  const ME = JSON.stringify(props.me);

  const γ = render(<Menu {...props} />);

  it("should match snapshot", () => {
    sessionStorage.setItem("jwt", JWT);
    sessionStorage.setItem("me", ME);

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(γ.container).toMatchSnapshot();
  });

  it("should empty session and redirect to login path", () => {
    fireEvent.click(γ.getAllByText("Se déconnecter")[1]);

    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(sessionStorage.getItem("me")).toBe(null);
    expect(Router.push).toHaveBeenCalledWith("/login");
  });
});
