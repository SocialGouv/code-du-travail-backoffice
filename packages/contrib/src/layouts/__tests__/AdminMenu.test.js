import React from "react";
import { fireEvent, render } from "react-testing-library";

import Router from "next/router";
jest.mock("next/router");

import AdminMenu from "../AdminMenu";

describe("[Contrib] layouts/<AdminMenu />", () => {
  const { container, getByText } = render(<AdminMenu />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Tableau de bord/));
    expect(Router.push).toBeCalledWith("/admin");
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Conventions/));
    expect(Router.push).toBeCalledWith("/admin/agreements");
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Étiquettes/));
    expect(Router.push).toBeCalledWith("/admin/tags");
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Questions/));
    expect(Router.push).toBeCalledWith("/admin/questions");
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Unités/));
    expect(Router.push).toBeCalledWith("/admin/locations");
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText(/Utilisateurs/));
    expect(Router.push).toBeCalledWith("/admin/users");
  });
});
