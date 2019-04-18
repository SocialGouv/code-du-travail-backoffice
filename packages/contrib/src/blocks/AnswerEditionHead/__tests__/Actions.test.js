import React from "react";
import { fireEvent, render } from "react-testing-library";

import Actions from "../Actions";

describe("[Contrib] blocks/AnswerEditionHead/<Actions />", () => {
  const props = {
    onCancel: jest.fn()
  };

  const { container, getByText } = render(<Actions {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onCancel()", () => {
    fireEvent.click(getByText(/Annuler ma réponse/));

    expect(props.onCancel).toHaveBeenCalled();
  });
});
