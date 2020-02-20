import { connect } from "react-redux";

import { AdminAnwsersEditPage } from "../answers/edit";

class AdminGenericAnwsersEditPage extends AdminAnwsersEditPage {}

export default connect(({ answers, comments }) => ({
  answers,
  comments,
  isGeneric: true,
}))(AdminGenericAnwsersEditPage);
