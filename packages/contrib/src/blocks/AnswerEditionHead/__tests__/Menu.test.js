import React from "react";
import { fireEvent, render } from "react-testing-library";

import Menu, { TABS } from "../Menu";

describe("[Contrib] blocks/AnswerEditionHead/<Menu />", () => {
  const onTabChange = jest.fn();

  const props = {
    currentTab: TABS.EDITOR,
    onTabChange
  };

  const { container, getByText } = render(<Menu {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onTabChange() with the expected param", () => {
    fireEvent.click(getByText(/Édition du contenu/));
    expect(onTabChange).toHaveBeenCalledWith(TABS.EDITOR);
  });

  it("should trigger onTabChange() with the expected param", () => {
    fireEvent.click(getByText(/Références juridiques/));
    expect(onTabChange).toHaveBeenCalledWith(TABS.REFERENCES);
  });
});
