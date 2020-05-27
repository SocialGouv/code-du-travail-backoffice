import axios from "axios";
import { toast } from "react-toastify";
import { runSaga } from "redux-saga";

import { initialState } from "../../../reducers/logs";
import deleteOlderThanOneWeek from "../deleteOlderThanOneWeek";

jest.mock("axios");
jest.mock("react-toastify");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
const mockedToast = /** @type {jest.Mocked<typeof import("react-toastify").toast>} */ (toast);
mockedAxios.create.mockReturnValue(mockedAxios);

// class MockDate {
//   constructor() {
//     return new Date(0);
//   }

//   static now() {
//     return 0;
//   }
// }

describe(`sagas/logs/deleteOlderThanOneWeek()`, () => {
  let DISPATCHED;

  beforeEach(() => {
    DISPATCHED = [];

    // global.Date = MockDate;
  });

  describe(`when there are logs older than one week`, () => {
    const data = [{ id: "00000000-0000-4000-8000-000000000001" }];

    it(`should behave as expected`, async () => {
      mockedAxios.get.mockResolvedValueOnce({ data });

      await runSaga(
        {
          dispatch: action => DISPATCHED.push(action),
          getState: () => initialState,
        },
        deleteOlderThanOneWeek,
      ).toPromise();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\/logs\?select=\*&created_at=lte\.\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ),
        {},
      );

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith("/rpc/purge_logs", undefined);

      expect(mockedToast.success).toHaveBeenCalledTimes(1);

      expect(DISPATCHED).toHaveLength(1);
      expect(DISPATCHED[0]).toEqual({
        meta: { pageIndex: -1, query: "" },
        type: "LOGS_LOAD",
      });
    });
  });

  describe(`when there is no log older than one week`, () => {
    const data = [];

    it(`should behave as expected`, async () => {
      mockedAxios.get.mockResolvedValueOnce({ data });

      await runSaga(
        {
          dispatch: action => DISPATCHED.push(action),
          getState: () => initialState,
        },
        deleteOlderThanOneWeek,
      ).toPromise();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\/logs\?select=\*&created_at=lte\.\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ),
        {},
      );

      expect(mockedToast.warn).toHaveBeenCalledTimes(1);

      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(mockedToast.success).not.toHaveBeenCalled();
      expect(DISPATCHED).toHaveLength(0);
    });
  });
});
