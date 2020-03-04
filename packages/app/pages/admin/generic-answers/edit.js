import { connect } from "react-redux";

import { AdminAnwsersEditPage } from "../answers/edit";

class AdminGenericAnwsersEditPage extends AdminAnwsersEditPage {}

export default connect(({ answers, comments, legalReferences }) => ({
  answers,
  comments,
  isGeneric: true,
  legalReferences,
}))(AdminGenericAnwsersEditPage);
