import PropTypes from "prop-types";

import * as C from "../constants";
import { validateMandatoryNullableOneOf, validateMandatoryNullableString } from "./validators";

export default {
  agreement_id: validateMandatoryNullableString,
  agreement_idcc: validateMandatoryNullableString,
  agreement_name: validateMandatoryNullableString,
  created_at: PropTypes.string.isRequired,
  generic_reference: validateMandatoryNullableOneOf(C.ANSWER_GENERIC_REFERENCES),
  id: PropTypes.string.isRequired,
  parent_id: validateMandatoryNullableString,
  prevalue: PropTypes.string.isRequired,
  question_id: PropTypes.string.isRequired,
  question_index: PropTypes.number.isRequired,
  question_value: PropTypes.string.isRequired,
  state: PropTypes.oneOf(C.ANSWER_STATES),
  updated_at: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
