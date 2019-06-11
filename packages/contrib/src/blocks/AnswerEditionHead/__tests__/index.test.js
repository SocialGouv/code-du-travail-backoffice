import React from "react";
import { render } from "@testing-library/react";

import AnswerEditionHead from "..";
import { TABS } from "../Tabs";

describe("[Contrib] blocks/<AnswerEditionHead />", () => {
  const onTabChange = jest.fn();

  const props = {
    agreement: "An agreement title",
    currentTab: TABS.EDITOR,
    idcc: "0123",
    index: 12,
    onTabChange,
    title: "A question title"
  };

  const { container } = render(<AnswerEditionHead {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });
});
