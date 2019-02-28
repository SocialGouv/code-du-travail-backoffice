import React from "react";
import { render } from "react-testing-library";
import Main from "../Main";

describe("[Contrib] layouts/<Main />", () => {
  it("should render", () => {
    const { container } = render(<Main />);

    expect(container).toMatchSnapshot();
  });
});
