import axios from "axios";
import { runSaga } from "redux-saga";

import { initialState } from "../../../reducers/questions";
import load from "../load";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

describe(`sagas/questions/load()`, () => {
  let DISPATCHED;

  beforeEach(() => {
    DISPATCHED = [];
  });

  describe(`with pageIndex=0`, () => {
    describe(`with query=""`, () => {
      it(`should behave as expected`, async () => {
        const data = [];

        mockedAxios.get.mockResolvedValueOnce({
          data,
          headers: {
            "content-range": "0-9/15",
          },
        });

        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { pageIndex: 0, query: "" } },
        ).toPromise();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "/questions?select=*&order=index.asc&limit=10&offset=0",
          {
            headers: { Prefer: "count=exact" },
          },
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: data, pageIndex: 0, pagesLength: 2 },
          type: "QUESTIONS_LOAD_SUCCESS",
        });
      });
    });

    describe(`with query="A Query"`, () => {
      it(`should behave as expected`, async () => {
        const data = [];

        mockedAxios.get.mockResolvedValueOnce({
          data,
          headers: {
            "content-range": "0-9/15",
          },
        });

        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { pageIndex: 0, query: "A Query" } },
        ).toPromise();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "/questions?select=*&value=ilike.*A Query*&order=index.asc&limit=10&offset=0",
          {
            headers: { Prefer: "count=exact" },
          },
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: data, pageIndex: 0, pagesLength: 2 },
          type: "QUESTIONS_LOAD_SUCCESS",
        });
      });
    });
  });

  describe(`with pageIndex=-1`, () => {
    describe(`with query=""`, () => {
      it(`should behave as expected`, async () => {
        const data = [];

        mockedAxios.get.mockResolvedValueOnce({
          data,
          headers: {
            "content-range": "0-14/15",
          },
        });

        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { pageIndex: -1, query: "" } },
        ).toPromise();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith("/questions?select=*&order=index.asc", {
          headers: { Prefer: "count=exact" },
        });

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: data, pageIndex: -1, pagesLength: -1 },
          type: "QUESTIONS_LOAD_SUCCESS",
        });
      });
    });
  });
});
