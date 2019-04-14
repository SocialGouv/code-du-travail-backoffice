import React from "react";
import { fireEvent, render } from "react-testing-library";

import Tabs, { TABS } from "../Tabs";

describe("[Contrib] blocks/AnswerEditionHead/<Tabs />", () => {
  const props = {
    currentTab: TABS.EDITOR,
    onChange: jest.fn()
  };

  const { container, getByText } = render(<Tabs {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onChange() with the expected param", () => {
    fireEvent.click(getByText(/Édition du contenu/));

    expect(props.onChange).toHaveBeenCalledWith(TABS.EDITOR);
  });

  it("should trigger onChange() with the expected param", () => {
    fireEvent.click(getByText(/Références juridiques/));

    expect(props.onChange).toHaveBeenCalledWith(TABS.REFERENCES);
  });
});
