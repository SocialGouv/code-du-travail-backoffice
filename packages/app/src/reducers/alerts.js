import { actionTypes } from "../actions/index";

export const initialState = {
  data: null,
  diff: null,
  error: null,
  isLoading: true,
  selectedKey: null,
  tree: [],
};

const AlertsReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    /* ONE ALERT ―――――――――――――――――――――――― */

    case actionTypes.ALERT_SELECT_ONE:
      return state;

    case actionTypes.ALERT_SELECT_ONE_FAILURE:
      return {
        ...state,
        error: payload.message,
      };

    case actionTypes.ALERT_SELECT_ONE_SUCCESS:
      return {
        ...state,
        diff: payload.diff,
        error: null,
        selectedKey: payload.selectedKey,
      };

    /* MULTIPLE ALERTS ―――――――――――――――――― */

    case actionTypes.ALERTS_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.ALERTS_LOAD_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.ALERTS_LOAD_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        tree: payload.tree,
      };

    default:
      return state;
  }
};

export default AlertsReducer;
