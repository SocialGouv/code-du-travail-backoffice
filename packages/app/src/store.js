import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

import * as reducers from "./reducers";
import rootSaga from "./sagas";

const { NODE_ENV } = process.env;

const bindMiddleware = middleware => {
  if (NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");

    return composeWithDevTools(applyMiddleware(...middleware));
  }

  return applyMiddleware(...middleware);
};

const initialStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(combineReducers(reducers), bindMiddleware([sagaMiddleware]));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(initialStore);
