import React from "react";
import { render } from "@testing-library/react";

import AnswerEditionContent from "..";

describe("[Contrib] blocks/<AnswerEditionContent />", () => {
  const props = {
    defaultValue: "Hello World!",
    onChange: jest.fn()
  };

  const λ = render(<AnswerEditionContent {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
    expect(λ.queryByText("A Tag")).not.toBeInTheDocument();
    expect(λ.queryByText("Another Tag")).not.toBeInTheDocument();
  });
});
