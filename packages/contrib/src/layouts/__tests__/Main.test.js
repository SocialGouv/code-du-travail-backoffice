import React from "react";
import { render } from "@testing-library/react";

jest.mock("next/router", () => ({
  withRouter: component => {
    component.defaultProps = {
      ...component.defaultProps,
      router: {
        pathname: "/"
      }
    };

    return component;
  }
}));

jest.mock("react-redux", () => ({
  connect: () => component => {
    component.defaultProps = {
      ...component.defaultProps,
      modal: {
        isVisible: false,
        message: ""
      }
    };

    return component;
  }
}));

import Main from "../Main";

describe("[Contrib] layouts/<Main /> (contributor)", () => {
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

describe("[Contrib] layouts/<Main /> (administrator)", () => {
  it("should match snapshot", () => {
    jest.mock("next/router", () => ({
      withRouter: component => {
        component.defaultProps = {
          ...component.defaultProps,
          router: {
            pathname: "/admin"
          }
        };

        return component;
      }
    }));

    const γ = render(<Main isAdmin />);

    expect(γ.container).toMatchSnapshot();
  });
});
