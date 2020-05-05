import PropTypes from "prop-types";

import * as C from "../constants";
import { validateMandatoryNullableOneOf } from "./validators";

export default {
  answer_id: PropTypes.string.isRequired,
  category: validateMandatoryNullableOneOf(C.LEGAL_REFERENCE_CATEGORIES),
  created_at: PropTypes.string,
  dila_cid: PropTypes.string,
  dila_container_id: PropTypes.string,
  dila_id: PropTypes.string,
  id: PropTypes.string.isRequired,
  is_skipped: PropTypes.bool,
  updated_at: PropTypes.string,
  url: PropTypes.string,
  value: PropTypes.string.isRequired,
};
