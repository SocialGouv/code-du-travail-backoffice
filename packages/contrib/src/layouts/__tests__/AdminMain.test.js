import React from "react";
import { render } from "react-testing-library";
import AdminMain from "../AdminMain";

describe("[Contrib] layouts/<AdminMain />", () => {
  it("should render", () => {
    const { container } = render(<AdminMain />);

    expect(container).toMatchSnapshot();
  });
});
