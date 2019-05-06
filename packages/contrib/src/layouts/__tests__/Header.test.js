import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import Header from "../Header";

const JWT = "aFakeJWT";
const ME = { payload: { name: "A Name" } };

describe.skip("[Contrib] layouts/<Header />", () => {
  const α = render(<Header />);
  const firstRender = α.container;

  it("[Anonymous] should match snapshot", () => {
    expect(α.container).toMatchSnapshot();
  });

  it("[Contributor] should match snapshot diff", () => {
    sessionStorage.setItem("me", JSON.stringify(ME));
    sessionStorage.setItem("jwt", JWT);

    const { asFragment } = render(<Header isAdmin={false} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  it("[Contributor] should attempt to redirect to /", () => {
    fireEvent.click(α.getByText("Code du travail numérique"));

    expect(Router.push).toHaveBeenCalledWith("/");
  });

  it("[Administrator] should match snapshot", () => {
    const { asFragment } = render(<Header isAdmin={false} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  it("[Administrator] should attempt to redirect to /admin", () => {
    fireEvent.click(α.getByText("Code du travail numérique"));

    expect(Router.push).toHaveBeenCalledWith("/admin");
  });
});
