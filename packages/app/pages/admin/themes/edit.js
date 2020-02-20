import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: parents } = await api.not
    .eq("id", id)
    .orderBy("title")
    .get("/themes");
  const { data: themes } = await api.eq("id", id).get(`/themes`);

  const fields = [
    {
      label: "Thème parent",
      name: "parent_id",
      options: parents.map(({ id: value, title: label }) => ({
        label,
        value,
      })),
      type: "select",
    },
    ...FIELDS,
  ];

  return {
    defaultData: themes[0],
    fields,
  };
};

const AdminThemesEditPage = withAdminEdit(
  {
    apiPath: "/themes",
    i18nSubject: "thème",
    indexPath: "/themes",
  },
  componentDidMount,
);

export default AdminThemesEditPage;
