import { render } from "@testing-library/react";
import React from "react";

jest.mock("next/router", () => ({
  withRouter: component => {
    component.defaultProps = {
      ...component.defaultProps,
      router: {
        pathname: "/",
      },
    };

    return component;
  },
}));

jest.mock("react-redux", () => ({
  connect: () => component => {
    component.defaultProps = {
      ...component.defaultProps,
      modal: {
        isVisible: false,
        message: "",
      },
    };

    return component;
  },
}));

import Main from "../Main";

describe.skip("layouts/<Main /> (contributor)", () => {
  const γ = render(<Main />);
  const firstRender = γ.asFragment();

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
  });

  it("should match snapshot with `isHorizontal` prop", () => {
    const { asFragment } = render(<Main isHorizontal />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  it("should match snapshot with `isLoading` prop", () => {
    const { asFragment } = render(<Main isLoading />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
