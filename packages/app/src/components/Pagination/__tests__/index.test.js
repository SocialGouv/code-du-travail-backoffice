import React from "react";
import { create } from "react-test-renderer";

import Pagination from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";

describe("components/<Pagination />", () => {
  describe("should render and behave as expected", () => {
    const PROPS = {
      onChange: jest.fn(),
    };

    it(`with {pagesIndex}=0, {pagesLength}=0`, async () => {
      const props = {
        ...PROPS,
        pagesIndex: 0,
        pagesLength: 0,
      };

      const $pagination = create(<Pagination {...props} />);

      expect($pagination).not.toHaveTestRenderedChild("button-1");

      runTestRenderedProperty($pagination, "onClick", "button-previous");
      runTestRenderedProperty($pagination, "onClick", "button-next");
      expect(props.onChange).not.toHaveBeenCalled();
    });

    it(`with {pagesIndex}=0, {pagesLength}=1`, async () => {
      const props = {
        ...PROPS,
        pagesIndex: 0,
        pagesLength: 1,
      };

      const $pagination = create(<Pagination {...props} />);

      expect($pagination).toHaveTestRenderedChild("button-1");

      runTestRenderedProperty($pagination, "onClick", "button-previous");
      runTestRenderedProperty($pagination, "onClick", "button-1");
      runTestRenderedProperty($pagination, "onClick", "button-next");
      expect(props.onChange).not.toHaveBeenCalled();
    });

    describe("with {pagesLength}=2", () => {
      it(`and {pagesIndex}=0`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 0,
          pagesLength: 2,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("button-2");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-2");
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith(1);
      });

      it(`and {pagesIndex}=1`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 1,
          pagesLength: 2,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("button-2");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-2");
        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith(0);
      });
    });

    describe("with {pagesLength}=9", () => {
      it(`and {pagesIndex}=0`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 0,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("button-2");
        expect($pagination).toHaveTestRenderedChild("button-3");
        expect($pagination).not.toHaveTestRenderedChild("separator-left");
        expect($pagination).toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-2");
        runTestRenderedProperty($pagination, "onClick", "button-3");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(3);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 1);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 2);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 8);
      });

      it(`and {pagesIndex}=1`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 1,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("button-2");
        expect($pagination).toHaveTestRenderedChild("button-3");
        expect($pagination).not.toHaveTestRenderedChild("separator-left");
        expect($pagination).toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-2");
        runTestRenderedProperty($pagination, "onClick", "button-3");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(3);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 2);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 8);
      });

      it(`and {pagesIndex}=2`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 2,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("button-2");
        expect($pagination).toHaveTestRenderedChild("button-3");
        expect($pagination).toHaveTestRenderedChild("button-4");
        expect($pagination).not.toHaveTestRenderedChild("separator-left");
        expect($pagination).toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-2");
        runTestRenderedProperty($pagination, "onClick", "button-3");
        runTestRenderedProperty($pagination, "onClick", "button-4");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(4);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 1);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 3);
        expect(props.onChange).toHaveBeenNthCalledWith(4, 8);
      });

      it(`and {pagesIndex}=3`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 3,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("separator-left");
        expect($pagination).toHaveTestRenderedChild("button-3");
        expect($pagination).toHaveTestRenderedChild("button-4");
        expect($pagination).toHaveTestRenderedChild("button-5");
        expect($pagination).toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-3");
        runTestRenderedProperty($pagination, "onClick", "button-4");
        runTestRenderedProperty($pagination, "onClick", "button-5");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(4);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 2);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 4);
        expect(props.onChange).toHaveBeenNthCalledWith(4, 8);
      });

      it(`and {pagesIndex}=5`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 5,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("separator-left");
        expect($pagination).toHaveTestRenderedChild("button-5");
        expect($pagination).toHaveTestRenderedChild("button-6");
        expect($pagination).toHaveTestRenderedChild("button-7");
        expect($pagination).toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-5");
        runTestRenderedProperty($pagination, "onClick", "button-6");
        runTestRenderedProperty($pagination, "onClick", "button-7");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(4);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 4);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 6);
        expect(props.onChange).toHaveBeenNthCalledWith(4, 8);

        props.onChange.mockClear();
        runTestRenderedProperty($pagination, "onClick", "button-previous");
        runTestRenderedProperty($pagination, "onClick", "button-next");
        expect(props.onChange).toHaveBeenCalledTimes(2);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 4);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 6);
      });

      it(`and {pagesIndex}=6`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 6,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("separator-left");
        expect($pagination).not.toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-6");
        expect($pagination).toHaveTestRenderedChild("button-7");
        expect($pagination).toHaveTestRenderedChild("button-8");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-6");
        runTestRenderedProperty($pagination, "onClick", "button-7");
        runTestRenderedProperty($pagination, "onClick", "button-8");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(4);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 5);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 7);
        expect(props.onChange).toHaveBeenNthCalledWith(4, 8);
      });

      it(`and {pagesIndex}=7`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 7,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("separator-left");
        expect($pagination).not.toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-7");
        expect($pagination).toHaveTestRenderedChild("button-8");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-7");
        runTestRenderedProperty($pagination, "onClick", "button-8");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(3);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 6);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 8);
      });

      it(`and {pagesIndex}=8`, async () => {
        const props = {
          ...PROPS,
          pagesIndex: 8,
          pagesLength: 9,
        };

        const $pagination = create(<Pagination {...props} />);

        expect($pagination).toHaveTestRenderedChild("button-1");
        expect($pagination).toHaveTestRenderedChild("separator-left");
        expect($pagination).not.toHaveTestRenderedChild("separator-right");
        expect($pagination).toHaveTestRenderedChild("button-7");
        expect($pagination).toHaveTestRenderedChild("button-8");
        expect($pagination).toHaveTestRenderedChild("button-9");

        runTestRenderedProperty($pagination, "onClick", "button-1");
        runTestRenderedProperty($pagination, "onClick", "button-7");
        runTestRenderedProperty($pagination, "onClick", "button-8");
        runTestRenderedProperty($pagination, "onClick", "button-9");
        expect(props.onChange).toHaveBeenCalledTimes(3);
        expect(props.onChange).toHaveBeenNthCalledWith(1, 0);
        expect(props.onChange).toHaveBeenNthCalledWith(2, 6);
        expect(props.onChange).toHaveBeenNthCalledWith(3, 7);
      });
    });
  });
});
