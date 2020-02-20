import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: definitions } = await api.eq("id", id).get("/definitions");

  return {
    defaultData: definitions[0],
    fields: FIELDS,
  };
};

const AdminDefinitionsEditPage = withAdminEdit(
  {
    apiPath: "/definitions",
    i18nIsFeminine: true,
    i18nSubject: "définition",
    indexPath: "/definitions",
  },
  componentDidMount,
);

export default AdminDefinitionsEditPage;
