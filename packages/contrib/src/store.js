import { applyMiddleware, createStore, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import * as reducers from "./reducers";
import rootSaga from "./sagas";

const bindMiddleware = middleware => {
  if (!["production", "test"].includes(process.env.NODE_ENV)) {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }

  return applyMiddleware(...middleware);
};

export default initialState => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers(reducers),
    initialState,
    bindMiddleware([sagaMiddleware])
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};
