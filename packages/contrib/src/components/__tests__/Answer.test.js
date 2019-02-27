import React from "react";
import { fireEvent, render } from "react-testing-library";
import Answer from "../Answer";

describe("<Answer />", () => {
  const onClick = jest.fn();
  const props = {
    data: {
      id: "12345678-9abc-4def-0123-456789abcdef",
      labor_agreement: {
        idcc: "1234",
        name: "A Labor Agreement Name"
      },
      question: {
        value: "Who knows?"
      }
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
