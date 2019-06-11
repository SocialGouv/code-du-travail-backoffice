import React from "react";
import { render } from "@testing-library/react";

import Textarea from "../Textarea";

describe("[Contrib] elements/<Textarea />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Textarea />);

    expect(container).toMatchSnapshot();
  });
});
