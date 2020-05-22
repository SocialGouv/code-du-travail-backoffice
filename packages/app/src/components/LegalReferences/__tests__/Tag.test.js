import { omit } from "ramda";
import React from "react";
import { create } from "react-test-renderer";
import waait from "waait";

import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";

jest.mock("../getLabelAndContent");
jest.mock("../TagEditor");

import getLabelAndContent from "../getLabelAndContent";
import Tag from "../Tag";
import TagEditorWithClickOutside from "../TagEditor";

describe("components/LegalReferences/<Tag />", () => {
  const PROPS = {
    answer_id: "00000000-0000-4000-8000-000000000001",
    category: null,
    dila_cid: null,
    dila_container_id: null,
    dila_id: null,
    id: "00000000-0000-4000-8000-000000000002",
    isReadOnly: false,
    onChange: jest.fn(),
    onRemove: jest.fn(),
    url: null,
    value: "A value",
  };

  beforeAll(() => {
    TagEditorWithClickOutside.mockImplementation(() => null);

    window.open = jest.fn();
  });

  it("should render & behave as expected with a miscellaneous legal reference", async () => {
    const props = {
      ...PROPS,
      url: "https://example.org",
    };

    // Mounting:
    getLabelAndContent.mockResolvedValueOnce(["A value", null]);
    const $tag = create(<Tag {...props} />);

    expect($tag).toHaveTestRenderedTextContent("…");
    expect($tag).toHaveTestRenderedStyleRule("background-color", "var(--color-alice-blue)");
    expect($tag).toHaveTestRenderedStyleRule("cursor", "help");
    expect($tag).toHaveTestRenderedStyleRule("background-color", "var(--color-periwinkle)", {
      target: ":hover",
    });
    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedTextContent("A value", "label");

    // Open link:
    runTestRenderedProperty($tag, "onClick", "button-open");

    expect(global.window.open).toHaveBeenNthCalledWith(1, "https://example.org", "_blank");

    // Remove:
    runTestRenderedProperty($tag, "onClick", "button-remove");

    expect(props.onRemove).toHaveBeenNthCalledWith(1, props.id);

    // Edit:
    runTestRenderedProperty($tag, "onClick", "button-edit");

    expect(TagEditorWithClickOutside).toHaveBeenCalledTimes(1);
    expect($tag).toHaveTestRenderedStyleRule("background-color", "transparent");
    expect($tag).toHaveTestRenderedStyleRule("cursor", "auto");
    expect($tag).toHaveTestRenderedStyleRule("background-color", "white", {
      target: ":hover",
    });

    // Submit edition:
    runTestRenderedProperty($tag, "onSubmit", "tag-editor", [
      "An edited value",
      "https://another.example.org",
    ]);

    const expected = {
      ...omit(["isReadOnly", "onChange", "onRemove"], props),
      url: "https://another.example.org",
      value: "An edited value",
    };
    expect(props.onChange).toHaveBeenNthCalledWith(1, expected);

    // Cancel edition:
    runTestRenderedProperty($tag, "onCancel", "tag-editor");

    expect($tag).toHaveTestRenderedTextContent("A value", "label");
  });

  it("should render & behave as expected with a linked agreement reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      dila_cid: "KALIARTI000000000001",
      dila_container_id: "KALICONT000000000001",
      dila_id: "KALIARTI000000000002",
    };

    // Mounting:
    getLabelAndContent.mockResolvedValueOnce(["Another value", "Some content"]);
    const $tag = create(<Tag {...props} />);

    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedProperty("data-tip", "Some content");
    expect($tag).toHaveTestRenderedTextContent("Another value", "label");

    // Open link:
    runTestRenderedProperty($tag, "onClick", "button-open");

    expect(global.window.open).toHaveBeenNthCalledWith(
      1,
      "https://beta.legifrance.gouv.fr/conv_coll/id/KALIARTI000000000002/?idConteneur=KALICONT000000000001",
      "_blank",
    );

    // Remove:
    runTestRenderedProperty($tag, "onClick", "button-remove");

    expect(props.onRemove).toHaveBeenNthCalledWith(1, props.id);

    // Edit:
    runTestRenderedProperty($tag, "onClick", "button-edit");

    expect(TagEditorWithClickOutside).toHaveBeenCalledTimes(1);

    // Submit edition:
    runTestRenderedProperty($tag, "onSubmit", "tag-editor", ["An edited value", null]);

    const expected = {
      ...omit(["isReadOnly", "onChange", "onRemove"], props),
      value: "An edited value",
    };
    expect(props.onChange).toHaveBeenNthCalledWith(1, expected);

    // Cancel edition:
    runTestRenderedProperty($tag, "onCancel", "tag-editor");

    expect($tag).toHaveTestRenderedTextContent("Another value", "label");
  });

  it("should open the expected link without a container ID", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      dila_cid: "KALIARTI000000000001",
      dila_id: "KALIARTI000000000002",
    };

    getLabelAndContent.mockResolvedValueOnce(["Another value", "Some content"]);
    const $tag = create(<Tag {...props} />);
    await waait();

    runTestRenderedProperty($tag, "onClick", "button-open");

    expect(global.window.open).toHaveBeenNthCalledWith(
      1,
      "https://beta.legifrance.gouv.fr/conv_coll/id/KALIARTI000000000002",
      "_blank",
    );
  });

  it("should not be editable or removable with {isReadOnly}", async () => {
    const props = {
      ...PROPS,
      isReadOnly: true,
    };

    getLabelAndContent.mockResolvedValueOnce(["A value", null]);
    const $tag = create(<Tag {...props} />);
    await waait();

    expect($tag).not.toHaveTestRenderedChild("button-edit");
    expect($tag).not.toHaveTestRenderedChild("button-remove");
  });

  it("should render as expected with an obsolete linked agreement reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      dila_cid: "KALIARTI000000000001",
      dila_container_id: "KALICONT000000000001",
      dila_id: "KALIARTI000000000002",
    };

    // Mounting:
    const error = new Error();
    error.code = 404;
    getLabelAndContent.mockRejectedValueOnce(error);
    const $tag = create(<Tag {...props} />);

    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedTextContent(props.value, "label");
    expect($tag).not.toHaveTestRenderedChild("button-edit");
  });

  it("should render as expected with an obsolete legacy linked agreement reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      dila_cid: "KALIARTI000000000001",
      dila_container_id: "KALICONT000000000001",
      dila_id: "KALIARTI000000000002",
      value: "",
    };

    // Mounting:
    const error = new Error();
    error.code = 404;
    getLabelAndContent.mockRejectedValueOnce(error);
    const $tag = create(<Tag {...props} />);

    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedTextContent(props.dila_id, "label");
    expect($tag).not.toHaveTestRenderedChild("button-edit");
  });

  it("should render as expected with a legacy agreement reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
    };

    // Mounting:
    getLabelAndContent.mockResolvedValueOnce(["Another value", "Some content"]);
    const $tag = create(<Tag {...props} />);

    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedStyleRule("background-color", "var(--color-text-red)");
    expect($tag).toHaveTestRenderedStyleRule("background-color", "var(--color-text-red)", {
      target: ":hover",
    });
  });

  it("should render as expected with an unknown api error", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      dila_cid: "KALIARTI000000000001",
      dila_container_id: "KALICONT000000000001",
      dila_id: "KALIARTI000000000002",
    };

    // Mounting:
    const error = new Error();
    error.code = 400;
    getLabelAndContent.mockRejectedValueOnce(error);
    const $tag = create(<Tag {...props} />);

    expect(getLabelAndContent).toHaveBeenCalledTimes(1);

    // Mounted:
    await waait();

    expect($tag).toHaveTestRenderedTextContent("…");
  });
});
