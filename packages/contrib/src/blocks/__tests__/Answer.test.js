import React from "react";
import { fireEvent, render } from "react-testing-library";
import Answer from "../Answer";

describe("[Contrib] blocks/<Answer />", () => {
  const onClick = jest.fn();
  const props = {
    data: {
      id: "12345678-9abc-4def-0123-456789abcdef",
      idcc: "1234",
      agreement: "A Labor Agreement Name",
      question: "Who knows?"
    },
    label: "A label",
    onClick
  };
  const { container, getByText } = render(<Answer id="1" {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  describe("when clicked twice", () => {
    const $ = getByText(/Who knows/);
    fireEvent.click($);
    fireEvent.click($);

    it("should have called onClick() twice", () => {
      expect(onClick.mock.calls.length).toBe(2);
    });
  });
});
