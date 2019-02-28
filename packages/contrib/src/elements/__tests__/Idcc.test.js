import React from "react";
import { render } from "react-testing-library";
import Idcc from "../Idcc";

describe("[Contrib] elements/<Idcc />", () => {
  it("should match snapshot", () => {
    const data = { idcc: "1234", name: "A labor agreement title" };
    const { container } = render(<Idcc data={data} />);

    expect(container).toMatchSnapshot();
  });
});
