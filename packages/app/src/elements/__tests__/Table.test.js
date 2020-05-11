import React from "react";
import { create } from "react-test-renderer";

import Table from "../Table";

describe("elements/<Table />", () => {
  const PROPS = {
    columns: [{ Header: "Value", accessor: "value" }],
    data: [{ value: "A first value" }, { value: "A second value" }],
  };

  it(`should pass`, () => {
    const props = {
      ...PROPS,
    };

    const $table = create(<Table {...props} />);
    const body = $table.toJSON().children[0];
    const firstHeadCell = body.children[0].children[0].children[0].children[0];
    const firstFirstRowCell = body.children[1].children[0].children[0].children[0];
    const firstSecondRowCell = body.children[1].children[1].children[0].children[0];

    expect(firstHeadCell.children[0]).toBe(props.columns[0].Header);
    expect(firstFirstRowCell.children[0]).toBe(props.data[0].value);
    expect(firstSecondRowCell.children[0]).toBe(props.data[1].value);
  });
});
