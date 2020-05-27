import axios from "axios";
import { runSaga } from "redux-saga";

import { initialState } from "../../../reducers/logs";
import load from "../load";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

describe(`sagas/logs/load()`, () => {
  const DATA = [];
  let DISPATCHED;

  beforeAll(() => {
    mockedAxios.get.mockResolvedValue({
      data: DATA,
      headers: {
        "content-range": "0-9/10",
      },
    });
  });

  beforeEach(() => {
    DISPATCHED = [];
  });

  describe(`with pageIndex=0`, () => {
    describe(`with query=""`, () => {
      it(`should behave as expected`, async () => {
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
          "/logs?select=*,user(*)&order=created_at.desc&limit=10&offset=0",
          {
            headers: { Prefer: "count=exact" },
          },
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: DATA, pageIndex: 0, pagesLength: 1 },
          type: "LOGS_LOAD_SUCCESS",
        });
      });
    });

    describe(`with query="A Query"`, () => {
      it(`should behave as expected`, async () => {
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
          "/logs?select=*,user(*)&url=ilike.*A Query*&order=created_at.desc&limit=10&offset=0",
          {
            headers: { Prefer: "count=exact" },
          },
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: DATA, pageIndex: 0, pagesLength: 1 },
          type: "LOGS_LOAD_SUCCESS",
        });
      });
    });
  });

  describe(`with pageIndex=-1`, () => {
    describe(`with query=""`, () => {
      it(`should behave as expected`, async () => {
        await runSaga(
          {
            dispatch: action => DISPATCHED.push(action),
            getState: () => initialState,
          },
          load,
          { meta: { pageIndex: -1, query: "" } },
        ).toPromise();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "/logs?select=*,user(*)&order=created_at.desc",
          {
            headers: { Prefer: "count=exact" },
          },
        );

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { list: DATA, pageIndex: -1, pagesLength: -1 },
          type: "LOGS_LOAD_SUCCESS",
        });
      });
    });
  });
});
