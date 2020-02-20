import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: questions } = await api.eq("id", id).get("/questions");

  return {
    defaultData: questions[0],
    fields: FIELDS,
  };
};

const AdminDefinitionsEditPage = withAdminEdit(
  {
    apiPath: "/questions",
    i18nIsFeminine: true,
    i18nSubject: "question",
    indexPath: "/questions",
  },
  componentDidMount,
);

export default AdminDefinitionsEditPage;
