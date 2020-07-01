import React from "react";
import { create } from "react-test-renderer";

import LegalReferences from "..";
import Selector from "../Selector";
import Tag from "../Tag";

jest.mock("../Selector");
jest.mock("../Tag");

describe("components/<LegalReferences />", () => {
  const PROPS = {
    category: null,
    data: [],
    onAdd: jest.fn(),
    onChange: jest.fn(),
    onInput: jest.fn(),
    onRemove: jest.fn(),
    references: [],
  };

  describe("should render as expected", () => {
    it("with {isLoading}", () => {
      const props = {
        ...PROPS,
        isLoading: true,
      };

      const $legalReferences = create(<LegalReferences {...props} />);

      expect(Selector).not.toHaveBeenCalled();
      expect($legalReferences).toHaveTestRenderedTextContent("…");
      expect(Tag).not.toHaveBeenCalled();
    });

    describe("with an agreement category", () => {
      it("with empty references", () => {
        const props = {
          ...PROPS,
          category: "agreement",
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).toHaveBeenCalledTimes(1);
        expect($legalReferences).toHaveTestRenderedChildLength(0, "list");
        expect(Tag).not.toHaveBeenCalled();
      });

      it("with empty references and {isReadOnly}", () => {
        const props = {
          ...PROPS,
          category: "agreement",
          isReadOnly: true,
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).not.toHaveBeenCalled();
        expect($legalReferences).toHaveTestRenderedChild("info");
        expect(Tag).not.toHaveBeenCalled();
      });

      it("with some references", () => {
        const props = {
          ...PROPS,
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
            {
              answer_id: "00000000-0000-4000-8000-000000000003",
              category: "agreement",
              dila_cid: "KALIARTI000000000003",
              dila_container_id: "KALICONT000000000002",
              dila_id: "KALIARTI000000000004",
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
            isReadOnly: false,
            onChange: props.onChange,
            onRemove: props.onRemove,
          },
          {
            ...props.references[1],
            isReadOnly: false,
            onChange: props.onChange,
            onRemove: props.onRemove,
          },
        ];
        expect(Tag).toHaveBeenCalledTimes(2);
        expect(Tag).toHaveBeenNthCalledWith(1, expecteds[0], {});
        expect(Tag).toHaveBeenNthCalledWith(2, expecteds[1], {});
      });
    });

    describe("with a labor code category", () => {
      it("with empty references", () => {
        const props = {
          ...PROPS,
          category: "labor_code",
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).toHaveBeenCalledTimes(1);
        expect($legalReferences).toHaveTestRenderedChildLength(0, "list");
        expect(Tag).not.toHaveBeenCalled();
      });

      it("with empty references and {isReadOnly}", () => {
        const props = {
          ...PROPS,
          category: "labor_code",
          isReadOnly: true,
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).not.toHaveBeenCalled();
        expect($legalReferences).toHaveTestRenderedChild("info");
        expect(Tag).not.toHaveBeenCalled();
      });
    });

    describe("with a miscellaneous category", () => {
      it("with empty references", () => {
        const props = {
          ...PROPS,
          category: null,
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).not.toHaveBeenCalled();
        expect($legalReferences).toHaveTestRenderedChildLength(0, "list");
        expect(Tag).not.toHaveBeenCalled();
      });

      it("with empty references and {isReadOnly}", () => {
        const props = {
          ...PROPS,
          category: null,
          isReadOnly: true,
          references: [],
        };

        const $legalReferences = create(<LegalReferences {...props} />);

        expect(Selector).not.toHaveBeenCalled();
        expect($legalReferences).toHaveTestRenderedChild("info");
        expect(Tag).not.toHaveBeenCalled();
      });

      it("with some references", () => {
        const props = {
          ...PROPS,
          category: null,
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
            isReadOnly: false,
            onChange: props.onChange,
            onRemove: props.onRemove,
          },
          {
            ...props.references[1],
            isReadOnly: false,
            onChange: props.onChange,
            onRemove: props.onRemove,
          },
        ];
        expect(Tag).toHaveBeenCalledTimes(2);
        expect(Tag).toHaveBeenNthCalledWith(1, expecteds[0], {});
        expect(Tag).toHaveBeenNthCalledWith(2, expecteds[1], {});
      });
    });
  });
});
