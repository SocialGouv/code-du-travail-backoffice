import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { create } from "react-test-renderer";

// import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";
import TagEditorWithClickOutside, { TagEditor } from "../TagEditor";

describe("components/LegalReferences/<TagEditor />", () => {
  const PROPS = {
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    url: null,
    value: `A value`,
  };

  it("should render & behave as expected", () => {
    const props = {
      ...PROPS,
    };

    const $tagEditor = create(<TagEditorWithClickOutside {...props} />, {
      createNodeMock: element => {
        if (element.type === "input") {
          return {
            focus: jest.fn(),
          };
        }
      },
    });

    expect($tagEditor).toHaveTestRenderedProperty("defaultValue", props.value, "input-value");
    expect($tagEditor).not.toHaveTestRenderedChild("input-url");

    $tagEditor.unmount();
  });

  it("should render & behave as expected with an {url}", () => {
    const props = {
      ...PROPS,
      url: `https://example.org`,
    };

    const $tagEditor = create(<TagEditorWithClickOutside {...props} />, {
      createNodeMock: element => {
        if (element.type === "input") {
          return {
            focus: jest.fn(),
          };
        }
      },
    });

    expect($tagEditor).toHaveTestRenderedProperty("defaultValue", props.value, "input-value");
    expect($tagEditor).toHaveTestRenderedProperty("defaultValue", props.url, "input-url");

    $tagEditor.unmount();
  });

  it("should not call {onSubmit}", () => {
    const props = {
      ...PROPS,
    };

    render(<TagEditorWithClickOutside {...props} />);
    const $form = screen.getByTestId("form");
    const $inputValue = screen.getByTestId("input-value");

    fireEvent.change($inputValue, {
      target: { value: `Another value` },
    });
    fireEvent.submit($form);

    expect(props.onSubmit).toHaveBeenNthCalledWith(1, `Another value`, null);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should not call {onSubmit} with an {url}", () => {
    const props = {
      ...PROPS,
      url: `https://example.org`,
    };

    render(<TagEditorWithClickOutside {...props} />);
    const $form = screen.getByTestId("form");
    const $inputValue = screen.getByTestId("input-value");
    const $inputUrl = screen.getByTestId("input-url");

    fireEvent.change($inputValue, {
      target: { value: `Another value` },
    });
    fireEvent.change($inputUrl, {
      target: { value: `https://another.example.org` },
    });
    fireEvent.submit($form);

    expect(props.onSubmit).toHaveBeenNthCalledWith(
      1,
      `Another value`,
      `https://another.example.org`,
    );
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call {onCancel} when pressing [Escape]", () => {
    const props = {
      ...PROPS,
    };

    render(<TagEditorWithClickOutside {...props} />);

    expect(props.onCancel).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(props.onCancel).toHaveBeenNthCalledWith(1);
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it("should call {onCancel} when clicking outside", () => {
    const props = {
      ...PROPS,
    };

    const $tagEditor = create(<TagEditor {...props} />, {
      createNodeMock: element => {
        if (element.type === "input") {
          return {
            focus: jest.fn(),
          };
        }
      },
    });

    $tagEditor.getInstance().handleClickOutside();

    expect(props.onCancel).toHaveBeenNthCalledWith(1);
    expect(props.onCancel).toHaveBeenCalledTimes(1);

    $tagEditor.unmount();
  });

  it("should not call {onCancel} when pressing [Tab]", () => {
    const props = {
      ...PROPS,
    };

    render(<TagEditorWithClickOutside {...props} />);

    fireEvent.keyDown(document, {
      key: "Tab",
    });

    expect(props.onCancel).not.toHaveBeenCalled();
  });

  it("should not call {onCancel} when repeating [Escape]", () => {
    const props = {
      ...PROPS,
    };

    render(<TagEditorWithClickOutside {...props} />);

    fireEvent.keyDown(document, {
      key: "Escape",
      repeat: true,
    });

    expect(props.onCancel).not.toHaveBeenCalled();
  });
});
