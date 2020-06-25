import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { create } from "react-test-renderer";

import LegalReferences from "..";
import Tag from "../Tag";

jest.mock("react-tag-autocomplete");
jest.mock("../Tag");

describe("components/LegalReferences/<LegalReferences />", () => {
  const PROPS = {
    category: null,
    data: [],
    isLoading: false,
    isReadOnly: false,
    noContent: false,
    onAdd: jest.fn(),
    onChange: jest.fn(),
    onInput: jest.fn(),
    onRemove: jest.fn(),
  };
  const $REACT_TAG_AUTOCOMPLETE = {};
  const $TAG = {};

  beforeAll(() => {
    console.warn = jest.fn();
  });

  it("should render as expected with {isLoading}", async () => {
    const props = {
      ...PROPS,
      isLoading: true,
    };

    const $legalReferences = create(<LegalReferences {...props} />);

    expect($legalReferences).toHaveTestRenderedTextContent("…");
    expect(Tag).not.toHaveBeenCalled();
  });

  it("should render as expected with no miscellaneous legal reference", async () => {
    const props = {
      ...PROPS,
    };

    const $legalReferences = create(<LegalReferences {...props} />);

    expect($legalReferences).toHaveTestRenderedChildLength(0, "list");
    expect(Tag).not.toHaveBeenCalled();
  });

  it("should render as expected with no miscellaneous legal reference and {isReadOnly}", async () => {
    const props = {
      ...PROPS,
      isReadOnly: true,
    };

    const $legalReferences = create(<LegalReferences {...props} />);

    expect($legalReferences).toHaveTestRenderedTextContent(`Aucune référence.`, "info");
    expect(Tag).not.toHaveBeenCalled();
  });

  it("should render as expected with some miscellaneous legal references", async () => {
    const props = {
      ...PROPS,
      references: [
        {
          answer_id: "00000000-0000-4000-8000-000000000001",
          category: null,
          dila_cid: null,
          dila_container_id: null,
          dila_id: null,
          id: "00000000-0000-4000-8000-000000000002",
          url: null,
          value: "A value",
        },
        {
          answer_id: "00000000-0000-4000-8000-000000000003",
          category: null,
          dila_cid: null,
          dila_container_id: null,
          dila_id: null,
          id: "00000000-0000-4000-8000-000000000004",
          url: null,
          value: "Another value",
        },
      ],
    };

    create(<LegalReferences {...props} />);

    const expecteds = [
      {
        ...props.references[0],
        isReadOnly: props.isReadOnly,
        onChange: props.onChange,
        onRemove: props.onRemove,
      },
      {
        ...props.references[1],
        isReadOnly: props.isReadOnly,
        onChange: props.onChange,
        onRemove: props.onRemove,
      },
    ];
    expect(Tag).toHaveBeenCalledTimes(2);
    expect(Tag).toHaveBeenNthCalledWith(1, expecteds[0], {});
    expect(Tag).toHaveBeenNthCalledWith(2, expecteds[1], {});
  });

  it("should render as expected with agreement legal reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
    };

    create(<LegalReferences {...props} />);

    // Warning: componentWillReceiveProps has been renamed […]
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
    expect(ReactTagAutocomplete).toHaveBeenCalledWith(
      {
        addOnBlur: false,
        allowBackspace: true,
        allowNew: false,
        autofocus: false,
        autoresize: true,
        clearInputOnDelete: true,
        "data-testid": "input-autocomplete",
        delimiterChars: [],
        delimiters: [],
        handleAddition: expect.any(Function),
        handleDelete: expect.any(Function),
        handleInputChange: expect.any(Function),
        handleValidate: expect.any(Function),
        inputAttributes: {},
        maxSuggestionsLength: 10,
        minQueryLength: 1,
        noSuggestionsText: null,
        placeholder: "12, 36.3, 05.07.6…",
        suggestions: [],
        suggestionsFilter: expect.any(Function),
        tagComponent: null,
        tags: [],
      },
      {},
    );
  });

  it("should behave as expected with agreement legal reference", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
    };

    ReactTagAutocomplete.mockImplementationOnce(props => {
      $REACT_TAG_AUTOCOMPLETE.props = props;
    });
    create(<LegalReferences {...props} />);

    expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
    expect($REACT_TAG_AUTOCOMPLETE.props.handleDelete()).toBeUndefined();
    expect($REACT_TAG_AUTOCOMPLETE.props.handleValidate()).toStrictEqual(true);
    expect($REACT_TAG_AUTOCOMPLETE.props.suggestionsFilter()).toStrictEqual(true);

    $REACT_TAG_AUTOCOMPLETE.props.handleAddition();

    expect(props.onAdd).toHaveBeenCalledTimes(1);
  });

  it("should not include auto-complete input with agreement legal reference and {isReadOnly}", async () => {
    const props = {
      ...PROPS,
      category: "agreement",
      isReadOnly: true,
    };

    create(<LegalReferences {...props} />);

    expect(ReactTagAutocomplete).not.toHaveBeenCalled();
  });

  it("should behave as expected with default callback props", async () => {
    const props = {
      category: "agreement",
      references: [
        {
          answer_id: "00000000-0000-4000-8000-000000000001",
          category: "agreement",
          dila_cid: "KALIARTI000000000001",
          dila_container_id: "KALICONT000000000001",
          dila_id: "KALIARTI000000000002",
          id: "00000000-0000-4000-8000-000000000002",
          url: null,
          value: "A value",
        },
      ],
    };

    ReactTagAutocomplete.mockImplementationOnce(props => {
      $REACT_TAG_AUTOCOMPLETE.props = props;
    });
    Tag.mockImplementationOnce(props => {
      $TAG.props = props;
    });
    create(<LegalReferences {...props} />);

    expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
    expect(Tag).toHaveBeenCalledTimes(1);
    expect($REACT_TAG_AUTOCOMPLETE.props.handleAddition()).toBeUndefined();
    expect($REACT_TAG_AUTOCOMPLETE.props.handleInputChange()).toBeUndefined();
    expect($TAG.props.onChange()).toBeUndefined();
    expect($TAG.props.onRemove()).toBeUndefined();
  });
});
