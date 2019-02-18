import React from "react";
import { render } from "react-testing-library";
import Editor from "./editor";

describe("Components > Editor", () => {
  test("should render", () => {
    const { container } = render(<Editor />);

    expect(container).toMatchSnapshot();
  });

  test("should call onChange", () => {
    let result;
    const λ = jest.fn(mdContent => (result = mdContent));
    const { container } = render(<Editor onChange={λ} />);
    console.info(baseElement);
    expect(result).toBe("");
  });
});
