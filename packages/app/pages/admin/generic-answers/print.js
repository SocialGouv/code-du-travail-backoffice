import { connect } from "react-redux";

import { AdminAnswersPrintPage } from "../answers/print";

class AdminGenericAnswersPrintPage extends AdminAnswersPrintPage {}

export default connect(({ answers }) => ({
  answers,
  isGeneric: true,
}))(AdminGenericAnswersPrintPage);
