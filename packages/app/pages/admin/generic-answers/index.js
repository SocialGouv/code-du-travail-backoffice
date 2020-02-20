import { connect } from "react-redux";

import { AdminAnswersIndexPage } from "../answers/index";

class AdminGenericAnswersIndexPage extends AdminAnswersIndexPage {}

export default connect(({ agreements, answers, questions }) => ({
  agreements,
  answers,
  isGeneric: true,
  questions,
}))(AdminGenericAnswersIndexPage);
