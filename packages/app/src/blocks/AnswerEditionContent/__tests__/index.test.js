import { render } from "@testing-library/react";
import React from "react";

import AnswerEditionContentBlock from "..";

// Polyfill "document.getSelection()""
// https://gist.github.com/yckart/6435861
Object.defineProperty(document, "getSelection", {
  value: () => {
    return document.selection && document.selection.createRange().text;
  },
});

describe("blocks/<AnswerEditionContent />", () => {
  const props = {
    defaultValue: "Hello World!",
    onChange: jest.fn(),
  };

  const λ = render(<AnswerEditionContentBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
    expect(λ.queryByText("A Tag")).not.toBeInTheDocument();
    expect(λ.queryByText("Another Tag")).not.toBeInTheDocument();
  });
});
