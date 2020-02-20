import { fireEvent, render } from "@testing-library/react";
import React from "react";

import AnswerEditionHeadBlockActions from "../Actions";

describe.skip("blocks/AnswerEditionHead/<Actions />", () => {
  const props = {
    onCancel: jest.fn(),
    onSubmit: jest.fn()
  };

  const { container, getByText } = render(<AnswerEditionHeadBlockActions {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onCancel()", () => {
    fireEvent.click(getByText("Demander la validation"));

    expect(props.onSubmit).toHaveBeenCalled();
  });
});
