import { runSaga } from "redux-saga";

import api from "../../../libs/api";
import { initialState } from "../../../reducers/legal-references";
import load from "../load";

jest.mock("../../../libs/api");

describe(`sagas/legal-references/load()`, () => {
  const DATA = [
    { id: "00000000-0000-4000-8000-000000000001", index: "1.2.3", title: "A Title" },
    { id: "00000000-0000-4000-8000-000000000002", index: null, title: "Another Title" },
  ];
  let DISPATCHED;

  beforeAll(() => {
    api.get.mockResolvedValue(DATA);
  });

  beforeEach(() => {
    DISPATCHED = [];
  });
  describe(`with query="A Query"`, () => {
    describe(`with category="agreement"`, () => {
      it(`should behave as expected`, async () => {
        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { category: "agreement", idcc: "1234", query: "A Query" } },
        ).toPromise();

        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith(
          "/legal-references?category=agreement&idcc=1234&query=A Query",
        );

        const expectedList = [
          { id: "00000000-0000-4000-8000-000000000001", name: "[Article 1.2.3] A Title" },
          { id: "00000000-0000-4000-8000-000000000002", name: "Another Title" },
        ];

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { category: "agreement", list: expectedList },
          type: "LEGAL_REFERENCES_LOAD_SUCCESS",
        });
      });
    });

    describe(`with category="labor_code"`, () => {
      it(`should behave as expected`, async () => {
        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { category: "labor_code", idcc: "1234", query: "A Query" } },
        ).toPromise();

        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith(
          "/legal-references?category=labor_code&idcc=1234&query=A Query",
        );

        const expectedList = [
          { id: "00000000-0000-4000-8000-000000000001", name: "1.2.3" },
          { id: "00000000-0000-4000-8000-000000000002", name: null },
        ];

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { category: "labor_code", list: expectedList },
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

        expect(api.get).not.toHaveBeenCalled();

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { category: "agreement", list: [] },
          type: "LEGAL_REFERENCES_LOAD_SUCCESS",
        });
      });
    });
  });
});
