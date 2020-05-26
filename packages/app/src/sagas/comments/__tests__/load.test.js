import axios from "axios";
import { runSaga } from "redux-saga";

import { initialState } from "../../../reducers/comments";
import load from "../load";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

describe(`sagas/comments/load()`, () => {
  const DATA = [];
  let DISPATCHED;

  beforeAll(() => {
    mockedAxios.get.mockResolvedValue({
      data: DATA,
      headers: {},
    });
  });

  beforeEach(() => {
    DISPATCHED = [];
  });

  it(`should behave as expected`, async () => {
    await runSaga(
      {
        dispatch: action => DISPATCHED.push(action),
        getState: () => initialState,
      },
      load,
      { meta: { answerId: "00000000-0000-4000-8000-000000000001" } },
    ).toPromise();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/answers_comments?select=*&answer_id=eq.00000000-0000-4000-8000-000000000001&order=created_at.asc",
      {},
    );

    expect(DISPATCHED).toHaveLength(1);
    expect(DISPATCHED[0]).toEqual({
      payload: { list: DATA },
      type: "COMMENTS_LOAD_SUCCESS",
    });
  });
});
