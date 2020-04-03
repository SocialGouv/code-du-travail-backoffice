import { expectSaga } from "redux-saga-test-plan";
import { call, put, take } from "redux-saga/effects";

import load from "../load";

// https://github.com/jfairbank/redux-saga-test-plan
test("just works!", () => {
  const api = {
    fetchUser: id => ({ id, name: "Tucker" }),
  };

  return (
    expectSaga(load, api)
      // Assert that the `put` will eventually happen.
      .put({
        payload: { id: 42, name: "Tucker" },
        type: "RECEIVE_USER",
      })

      // Dispatch any actions that the saga will `take`.
      .dispatch({ payload: 42, type: "REQUEST_USER" })

      // Start the test. Returns a Promise.
      .run()
  );
});
