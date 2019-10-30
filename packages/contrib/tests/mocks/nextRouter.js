import "next/router";

global.nextRouter = {
  prefetch: jest.fn(),
  push: jest.fn(),
  withRouter: component => {
    component.defaultProps = {
      ...component.defaultProps,
      router: {
        pathname: "/admin"
      }
    };

    return component;
  }
};

jest.mock("next/router", () => global.nextRouter);
