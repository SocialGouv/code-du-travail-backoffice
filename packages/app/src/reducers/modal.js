import { actionTypes } from "../actions/index";

const initialState = {
  isVisible: false,
  message: ""
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.MODAL_OPEN:
      return {
        ...state,
        isVisible: true,
        message: payload.message
      };

    case actionTypes.MODAL_CLOSE:
    case actionTypes.MODAL_SUBMIT:
      return {
        ...initialState
      };

    default:
      return state;
  }
};
