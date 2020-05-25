import React from "react";
import { create } from "react-test-renderer";

jest.mock("../../Header");
jest.mock("../../../components/Modal", () => jest.fn(() => null));

import Main from "..";
import ModaWithWrapper from "../../../components/Modal";
import Header from "../../Header";

describe("layouts/<Main />", () => {
  const PROPS = {};

  it(`should render as expected`, () => {
    create(<Main {...PROPS} />);

    expect(Header).toHaveBeenCalledTimes(1);
    expect(ModaWithWrapper).toHaveBeenCalledTimes(1);
  });

  describe(`with {isLoading}`, () => {
    beforeAll(() => {
      PROPS.isLoading = true;
    });

    it(`should render as expected`, () => {
      create(<Main {...PROPS} />);

      expect(Header).toHaveBeenCalledTimes(1);
      expect(ModaWithWrapper).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      delete PROPS.isLoading;
    });
  });

  describe(`with {isHorizontal}`, () => {
    beforeAll(() => {
      PROPS.isHorizontal = true;
    });

    it(`should render as expected`, () => {
      create(<Main {...PROPS} />);

      expect(Header).toHaveBeenCalledTimes(1);
      expect(ModaWithWrapper).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      delete PROPS.isHorizontal;
    });
  });
});
