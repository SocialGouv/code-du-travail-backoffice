import React from "react";
import { render } from "@testing-library/react";

import Radio from "../Radio";

const OPTIONS = [
  { label: "A Selected Label", value: "A Selected Value", isSelected: true },
  { label: "A Label", value: "A Value" },
  { label: "Another Label", value: "Another Value" }
];

describe("[Contrib] elements/<Radio />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Radio options={OPTIONS} />);

    expect(container).toMatchSnapshot();
  });
});
