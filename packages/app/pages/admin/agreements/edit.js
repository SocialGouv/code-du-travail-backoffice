import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: agreements } = await api.eq("id", id).get("/agreements");
  const { data: allAgreements } = await api.get("/agreements");

  const fields = [
    ...FIELDS,
    {
      label: "Convention parente",
      name: "parent_id",
      options: allAgreements.map(({ id, idcc, name }) => ({
        label: `${idcc} - ${name}`,
        value: id,
      })),
      type: "select",
    },
  ];

  return {
    defaultData: agreements[0],
    fields,
  };
};

const AdminAgreementsEditPage = withAdminEdit(
  {
    apiPath: "/agreements",
    i18nIsFeminine: true,
    i18nSubject: "convention",
    indexPath: "/agreements",
  },
  componentDidMount,
);

export default AdminAgreementsEditPage;
