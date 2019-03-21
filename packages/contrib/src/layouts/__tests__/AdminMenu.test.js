import React from "react";
import { render } from "react-testing-library";
import AdminMenu from "../AdminMenu";

describe("[Contrib] layouts/<AdminMenu />", () => {
  it("should render", () => {
    const { container } = render(<AdminMenu />);

    expect(container).toMatchSnapshot();
  });
});
