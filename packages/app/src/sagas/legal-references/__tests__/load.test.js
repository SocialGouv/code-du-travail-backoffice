import { runSaga } from "redux-saga";

import dilaApi from "../../../libs/dilaApi";
import { initialState } from "../../../reducers/legal-references";
import load from "../load";

jest.mock("../../../libs/dilaApi");

describe(`sagas/legal-references/load()`, () => {
  /** @type {DilaApi.Article[]}  */
  const AGREEMENT_DATA = [
    {
      cid: "KALIARTI123456789012",
      containerId: "KALICONT123456789012",
      content: "A content.",
      id: "KALIARTI123456789012",
      index: "An index",
      path: "A path",
    },
    {
      cid: "KALIARTI123456789013",
      containerId: "KALICONT123456789013",
      content: "Another content.",
      id: "KALIARTI123456789013",
      index: "",
      path: "Another path",
    },
  ];
  const CODE_DATA = [
    {
      cid: "LEGIARTI123456789012",
      containerId: "LEGITEXT123456789012",
      content: "A content.",
      id: "LEGIARTI123456789012",
      index: "An index",
      path: "A path",
    },
  ];
  let DISPATCHED;

  beforeEach(() => {
    DISPATCHED = [];
  });

  describe(`with query="A Query"`, () => {
    describe(`should behave as expected`, () => {
      it(`with category="agreement"`, async () => {
        dilaApi.get.mockResolvedValueOnce(AGREEMENT_DATA);

        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { category: "agreement", idcc: "1234", query: "A Query" } },
        ).toPromise();

        expect(dilaApi.get).toHaveBeenCalledTimes(1);
        expect(dilaApi.get).toHaveBeenCalledWith(
          "/agreement/articles?agreementIdOrIdcc=1234&query=A Query",
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toMatchObject({
          payload: { category: "agreement", list: expect.any(Array) },
          type: "LEGAL_REFERENCES_LOAD_SUCCESS",
        });
      });

      it(`with category="labor_code"`, async () => {
        dilaApi.get.mockResolvedValueOnce(CODE_DATA);

        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { category: "labor_code", query: "A Query" } },
        ).toPromise();

        expect(dilaApi.get).toHaveBeenCalledTimes(1);
        expect(dilaApi.get).toHaveBeenCalledWith(
          "/code/articles?codeId=LEGITEXT000006072050&query=A Query",
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toMatchObject({
          payload: { category: "labor_code", list: expect.any(Array) },
          type: "LEGAL_REFERENCES_LOAD_SUCCESS",
        });
      });
    });
  });

  describe(`with query=""`, () => {
    describe(`with category="agreement"`, () => {
      it(`should behave as expected`, async () => {
        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { category: "agreement", idcc: "1234", query: "" } },
        ).toPromise();

        expect(dilaApi.get).not.toHaveBeenCalled();

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { category: "agreement", list: [] },
          type: "LEGAL_REFERENCES_LOAD_SUCCESS",
        });
      });
    });
  });
});
