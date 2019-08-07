import { connect } from "react-redux";

import { AdminAnswersIndexPage } from "../answers/index";

class AdminGenericAnswersIndexPage extends AdminAnswersIndexPage {}

export default connect(({ answers }) => ({
  answers,
  isGeneric: true
}))(AdminGenericAnswersIndexPage);
