import axios from "axios";
import { runSaga } from "redux-saga";

import { initialState } from "../../../reducers/comments";
import _delete from "../delete";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

describe(`sagas/comments/delete()`, () => {
  let DISPATCHED;

  beforeEach(() => {
    DISPATCHED = [];
  });

  it(`should behave as expected`, async () => {
    const data = [];

    mockedAxios.get.mockResolvedValueOnce({
      data,
      headers: {},
    });

    await runSaga(
      {
        dispatch: action => DISPATCHED.push(action),
        getState: () => initialState,
      },
      _delete,
      {
        meta: {
          answerId: "00000000-0000-4000-8000-000000000001",
          ids: ["00000000-0000-4000-8000-000000000002", "00000000-0000-4000-8000-000000000003"],
        },
      },
    ).toPromise();

    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "/answers_comments?id=in.(00000000-0000-4000-8000-000000000002,00000000-0000-4000-8000-000000000003)",
    );

    expect(DISPATCHED).toHaveLength(1);
    expect(DISPATCHED[0]).toEqual({
      meta: { answerId: "00000000-0000-4000-8000-000000000001" },
      type: "COMMENTS_LOAD",
    });
  });
});
