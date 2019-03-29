import React from "react";
import { render } from "react-testing-library";
import Select from "../Select";

describe("[Contrib] elements/<Select />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Select />);

    expect(container).toMatchSnapshot();
  });
});
