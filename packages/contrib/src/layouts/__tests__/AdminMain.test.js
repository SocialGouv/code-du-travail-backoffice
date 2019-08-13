import React from "react";
import { render } from "@testing-library/react";

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

import AdminMain from "../AdminMain";

describe.skip("[Contrib] layouts/<AdminMain />", () => {
  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", "/admin");

  const props = {
    children: "Some Content Text",
    isLoading: false
  };

  const γ = render(<AdminMain {...props} />);
  const firstRender = γ.container;

  it("should match snapshot", () => {
    expect(firstRender).toMatchSnapshot();
  });

  it("should match snapshot diff with `hasBareContent` prop", () => {
    const newProps = {
      ...props,
      hasBareContent: true
    };

    const Γ = render(<AdminMain {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(Γ.asFragment());
  });

  it("should match snapshot diff with `isLoading` prop", () => {
    const newProps = {
      ...props,
      isLoading: true
    };

    const Γ = render(<AdminMain {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(Γ.asFragment());
  });
});
