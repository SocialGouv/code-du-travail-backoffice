import React from "react";
import { render } from "@testing-library/react";

import AnswerEditionHead from "..";
import { TABS } from "../Tabs";

describe("[Contrib] blocks/<AnswerEditionHead />", () => {
  const onTabChange = jest.fn();

  const props = {
    agreement: {
      idcc: "0123",
      name: "An Agreement Name"
    },
    currentTab: TABS.EDITOR,
    onTabChange,
    question: {
      index: 123,
      value: "A Question Value"
    }
  };

  const { container } = render(<AnswerEditionHead {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });
});
