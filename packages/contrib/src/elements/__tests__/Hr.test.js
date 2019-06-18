import React from "react";
import { render } from "@testing-library/react";

import Hr from "../Hr";

describe("[Contrib] elements/<Hr />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Hr />);

    expect(container).toMatchSnapshot();
  });
});
