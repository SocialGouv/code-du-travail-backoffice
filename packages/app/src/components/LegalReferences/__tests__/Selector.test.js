import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { create } from "react-test-renderer";

import Selector from "../Selector";

jest.mock("react-tag-autocomplete");

describe("components/LegalReferences/LegalReferences/<Selector />", () => {
  const PROPS = {
    category: null,
    data: [],
    onAdd: jest.fn(),
    onIdccChange: jest.fn(),
    onInput: jest.fn(),
  };
  const $REACT_TAG_AUTOCOMPLETE = {};

  beforeAll(() => {
    console.error = jest.fn();
  });

  describe("should render as expected", () => {
    describe("with an agreement category", () => {
      it("with empty data", () => {
        const props = {
          ...PROPS,
          category: "agreement",
          data: [],
        };

        const $selector = create(<Selector {...props} />);

        expect($selector).not.toHaveTestRenderedChild("input-idcc");
        expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
        expect(ReactTagAutocomplete).toHaveBeenCalledWith(
          {
            addOnBlur: false,
            allowBackspace: true,
            allowNew: false,
            autoresize: true,
            classNames: expect.any(Object),
            "data-testid": "input-autocomplete",
            delimiters: [],
            id: expect.any(String),
            inputAttributes: {},
            maxSuggestionsLength: 10,
            minQueryLength: 1,
            noSuggestionsText: null,
            onAddition: expect.any(Function),
            onDelete: expect.any(Function),
            onInput: expect.any(Function),
            onValidate: expect.any(Function),
            placeholderText: "12, 36.3, 05.07.6…",
            removeButtonText: expect.any(String),
            suggestionComponent: null,
            suggestions: [],
            suggestionsFilter: expect.any(Function),
            tagComponent: null,
            tags: [],
          },
          {},
        );
      });

      it("with empty data and an IDCC", () => {
        const props = {
          ...PROPS,
          category: "agreement",
          data: [],
          idcc: "1234",
        };

        const $selector = create(<Selector {...props} />);

        expect($selector).toHaveTestRenderedChild("input-idcc");
      });
    });

    describe("with a labor code category", () => {
      it("with empty data", () => {
        const props = {
          ...PROPS,
          category: "labor_code",
          data: [],
        };

        const $selector = create(<Selector {...props} />);

        expect($selector).not.toHaveTestRenderedChild("input-idcc");
        expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
        expect(ReactTagAutocomplete).toHaveBeenCalledWith(
          {
            addOnBlur: false,
            allowBackspace: true,
            allowNew: false,
            autoresize: true,
            classNames: expect.any(Object),
            "data-testid": "input-autocomplete",
            delimiters: [],
            id: expect.any(String),
            inputAttributes: {},
            maxSuggestionsLength: 10,
            minQueryLength: 1,
            noSuggestionsText: null,
            onAddition: expect.any(Function),
            onDelete: expect.any(Function),
            onInput: expect.any(Function),
            onValidate: expect.any(Function),
            placeholderText: "D1234, L1234, R1234…",
            removeButtonText: expect.any(String),
            suggestionComponent: null,
            suggestions: [],
            suggestionsFilter: expect.any(Function),
            suggestionsTransform: null,
            tagComponent: null,
            tags: [],
          },
          {},
        );
      });
    });
  });

  describe("should behave as expected", () => {
    it("with an agreement category", async () => {
      const props = {
        ...PROPS,
        category: "agreement",
      };

      ReactTagAutocomplete.mockImplementationOnce(props => {
        $REACT_TAG_AUTOCOMPLETE.props = props;
      });
      create(<Selector {...props} />);

      expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
      expect($REACT_TAG_AUTOCOMPLETE.props.onDelete()).toBeUndefined();
      expect($REACT_TAG_AUTOCOMPLETE.props.onValidate()).toStrictEqual(true);
      expect($REACT_TAG_AUTOCOMPLETE.props.suggestionsFilter()).toStrictEqual(true);

      $REACT_TAG_AUTOCOMPLETE.props.onAddition();

      expect(props.onAdd).toHaveBeenCalledTimes(1);
    });

    it("with a labor code category", async () => {
      const props = {
        ...PROPS,
        category: "labor_code",
      };

      ReactTagAutocomplete.mockImplementationOnce(props => {
        $REACT_TAG_AUTOCOMPLETE.props = props;
      });
      create(<Selector {...props} />);

      expect(ReactTagAutocomplete).toHaveBeenCalledTimes(1);
      expect($REACT_TAG_AUTOCOMPLETE.props.onDelete()).toBeUndefined();
      expect($REACT_TAG_AUTOCOMPLETE.props.onValidate()).toStrictEqual(true);
      expect($REACT_TAG_AUTOCOMPLETE.props.suggestionsFilter()).toStrictEqual(true);

      $REACT_TAG_AUTOCOMPLETE.props.onAddition();

      expect(props.onAdd).toHaveBeenCalledTimes(1);
    });
  });
});
