import React from "react";
import { render } from "react-testing-library";

import AnswerEditionHead from "..";
import { TABS } from "../Tabs";

describe("[Contrib] blocks/<AnswerEditionHead />", () => {
  // Ignore styled-wrapped ReactTooltip className prop warning
  console.warn = jest.fn();

  const onTabChange = jest.fn();

  const props = {
    agreement: "An agreement title",
    currentTab: TABS.EDITOR,
    idcc: "0123",
    onTabChange,
    title: "A question title"
  };

  const { container } = render(<AnswerEditionHead {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(console.warn.mock.calls.length).toBe(1);
  });
});
