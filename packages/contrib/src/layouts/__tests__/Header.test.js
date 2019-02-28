import React from "react";
import { render } from "react-testing-library";
import Header from "../Header";

describe("[Contrib] layouts/<Header />", () => {
  it("should render", () => {
    const { container } = render(<Header />);

    expect(container).toMatchSnapshot();
  });
});
