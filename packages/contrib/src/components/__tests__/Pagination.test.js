import React from "react";
import { fireEvent, render } from "react-testing-library";

import Pagination from "../Pagination";

describe("[Contrib] components/<Pagination />", () => {
  const props = {
    initialPage: 2,
    onPageChange: jest.fn(),
    pageCount: 12
  };

  const { container, getByText } = render(<Pagination {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should call onPageChange() with the expected param", async () => {
    fireEvent.click(getByText("2"));

    expect(props.onPageChange).toHaveBeenCalledWith({ selected: 1 });
  });
});
