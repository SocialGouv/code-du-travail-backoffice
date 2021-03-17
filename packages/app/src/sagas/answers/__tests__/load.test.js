import axios from "axios";
import { runSaga } from "redux-saga";

import getCurrentUser from "../../../libs/getCurrentUser";
import { initialState } from "../../../reducers/answers";
import { getAnswersFilters } from "../../../selectors";
import load from "../load";

jest.mock("axios");
const mockedAxios = /** @type {jest.Mocked<import("axios").AxiosInstance>} */ (axios);
mockedAxios.create.mockReturnValue(mockedAxios);

jest.mock("../../../libs/getCurrentUser");
jest.mock("../../../selectors");

describe.skip(`sagas/answers/load()`, () => {
  const DATA = {
    answers: [
      { agreement_name: "An Agreement", id: "00000000-0000-4000-8000-000000000001" },
      { agreement_name: null, id: "00000000-0000-4000-8000-000000000002" },
    ],
    answersReferences: [],
  };
  let DISPATCHED;
  let FILTERS;

  beforeEach(() => {
    DISPATCHED = [];

    getAnswersFilters.mockReturnValueOnce(FILTERS);
  });

  describe(`when the user is a contributor`, () => {
    beforeAll(() => {
      FILTERS = initialState.filters;

      getCurrentUser.mockReturnValue({
        agreements: [
          "00000000-0000-4000-8000-000000000003",
          "00000000-0000-4000-8000-000000000004",
        ],
        id: "00000000-0000-4000-8000-000000000005",
        role: "contributor",
      });
    });

    describe(`when the filter {state}=["todo", "draft]`, () => {
      it(`should behave as expected`, async () => {
        mockedAxios.get.mockResolvedValueOnce({
          data: DATA.answers,
          headers: {
            "content-range": "0-9/15",
          },
        });
        mockedAxios.get.mockResolvedValueOnce({
          data: DATA.answersReferences,
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
          { meta: { pagesIndex: 0 } },
        ).toPromise();

        expect(getAnswersFilters).toHaveBeenCalledTimes(1);

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(
          1,
          `/full_answers?select=*&state=in.(todo,draft,pending_review,under_review,validated)&agreement_id=in.("00000000-0000-4000-8000-000000000003","00000000-0000-4000-8000-000000000004")&order=question_index.asc,agreement_idcc.asc&limit=10&offset=0`,
          {
            headers: { Prefer: "count=exact" },
          },
        );
        expect(mockedAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers_references?select=*&answer_id=in.(00000000-0000-4000-8000-000000000001,00000000-0000-4000-8000-000000000002)&order=category.asc,value.asc`,
          {},
        );

        const expectedList = [
          {
            agreement_name: "An Agreement",
            id: "00000000-0000-4000-8000-000000000001",
            references: [],
          },
          { agreement_name: null, id: "00000000-0000-4000-8000-000000000002", references: [] },
        ];

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { length: 15, list: expectedList, pagesIndex: 0, pagesLength: 2 },
          type: "ANSWERS_LOAD_SUCCESS",
        });
      });
    });

    describe(`when the filter {state}=["draft]`, () => {
      FILTERS = {
        ...initialState.filters,
        states: ["draft"],
      };

      it(`should behave as expected`, async () => {
        mockedAxios.get.mockResolvedValueOnce({
          data: DATA.answers,
          headers: {
            "content-range": "0-9/15",
          },
        });
        mockedAxios.get.mockResolvedValueOnce({
          data: DATA.answersReferences,
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
          { meta: { pagesIndex: 0 } },
        ).toPromise();

        expect(getAnswersFilters).toHaveBeenCalledTimes(1);

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(
          1,
          `/full_answers?select=*&state=in.(todo,draft,pending_review,under_review,validated)&agreement_id=in.("00000000-0000-4000-8000-000000000003","00000000-0000-4000-8000-000000000004")&order=question_index.asc,agreement_idcc.asc&limit=10&offset=0`,
          {
            headers: { Prefer: "count=exact" },
          },
        );
        expect(mockedAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers_references?select=*&answer_id=in.(00000000-0000-4000-8000-000000000001,00000000-0000-4000-8000-000000000002)&order=category.asc,value.asc`,
          {},
        );

        const expectedList = [
          {
            agreement_name: "An Agreement",
            id: "00000000-0000-4000-8000-000000000001",
            references: [],
          },
          { agreement_name: null, id: "00000000-0000-4000-8000-000000000002", references: [] },
        ];

        expect(DISPATCHED).toHaveLength(1);
        expect(DISPATCHED[0]).toEqual({
          payload: { length: 15, list: expectedList, pagesIndex: 0, pagesLength: 2 },
          type: "ANSWERS_LOAD_SUCCESS",
        });
      });
    });
  });
});
