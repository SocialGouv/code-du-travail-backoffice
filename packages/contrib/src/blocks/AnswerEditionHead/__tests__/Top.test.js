import React from "react";
import { render } from "react-testing-library";

import Top from "..";

describe("[Contrib] blocks/AnswerEditionHead/<Top />", () => {
  // Ignore styled-wrapped ReactTooltip className prop warning
  console.warn = jest.fn();

  const props = {
    agreement: "An agreement title",
    idcc: "0123"
  };

  const { container } = render(<Top {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(console.warn.mock.calls.length).toBe(1);
  });
});
