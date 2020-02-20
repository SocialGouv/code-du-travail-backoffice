import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: requests } = await api.eq("id", id).get("/requests");
  const { data: themes } = await api.orderBy("title").get("/themes");

  const fields = [
    {
      label: "Thème",
      name: "theme_id",
      options: themes.map(({ id: value, title: label }) => ({
        label,
        value,
      })),
      type: "select",
    },
    ...FIELDS,
  ];

  return {
    defaultData: requests[0],
    fields,
  };
};

const AdminThemesEditPage = withAdminEdit(
  {
    apiPath: "/requests",
    i18nIsFeminine: true,
    i18nSubject: "requête",
    indexPath: "/requests",
  },
  componentDidMount,
);

export default AdminThemesEditPage;
