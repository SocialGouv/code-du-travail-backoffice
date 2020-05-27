import axios from "axios";
import { runSaga } from "redux-saga";

import getCurrentUser from "../../../libs/getCurrentUser";
import { initialState } from "../../../reducers/comments";
import createOne from "../createOne";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

jest.mock("../../../libs/getCurrentUser");

describe(`sagas/comments/createOne()`, () => {
  let DISPATCHED;

  beforeAll(() => {
    mockedAxios.post.mockResolvedValue();
    getCurrentUser.mockReturnValue({ id: "00000000-0000-4000-8000-000000000001" });
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
      createOne,
      {
        meta: {
          answerId: "00000000-0000-4000-8000-000000000002",
          isPrivate: true,
          value: `A value`,
        },
      },
    ).toPromise();

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith("/answers_comments", {
      answer_id: "00000000-0000-4000-8000-000000000002",
      is_private: true,
      user_id: "00000000-0000-4000-8000-000000000001",
      value: `A value`,
    });

    expect(DISPATCHED).toHaveLength(2);
    expect(DISPATCHED[0]).toEqual({
      type: "COMMENT_CREATE_ONE_SUCCESS",
    });
    expect(DISPATCHED[1]).toEqual({
      meta: { answerId: "00000000-0000-4000-8000-000000000002" },
      type: "COMMENTS_LOAD",
    });
  });
});
