import React from "react";
import { create } from "react-test-renderer";

import { Modal } from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";

describe("components/<Modal />", () => {
  const PROPS = {
    dispatch: jest.fn(),
    message: `A message`,
  };

  it(`should render the message`, async () => {
    const props = {
      ...PROPS,
    };

    const $modal = create(<Modal {...props} />);

    expect($modal).toHaveTestRenderedTextContent(props.message, "message");
  });

  it(`should dispatch MODAL_CLOSE when clicking on cancellation button`, async () => {
    const props = {
      ...PROPS,
    };

    const $modal = create(<Modal {...props} />);

    runTestRenderedProperty($modal, "onClick", "button-cancel");

    expect(props.dispatch).toHaveBeenNthCalledWith(1, { type: "MODAL_CLOSE" });
  });

  it(`should dispatch MODAL_CLOSE when clicking on confirmation button`, async () => {
    const props = {
      ...PROPS,
    };

    const $modal = create(<Modal {...props} />);

    runTestRenderedProperty($modal, "onClick", "button-confirm");

    expect(props.dispatch).toHaveBeenNthCalledWith(1, { type: "MODAL_SUBMIT" });
  });
});
