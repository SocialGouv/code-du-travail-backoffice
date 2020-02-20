import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: users } = await api.eq("id", id).get("/administrator_users");
  const { data: agreements } = await api.get("/agreements");
  const { data: locations } = await api.get("/locations");

  const defaultData = {
    ...users[0],
    agreements: users[0].agreements.map(agreement => ({
      id: agreement.id,
      value: `${agreement.idcc} - ${agreement.name}`,
    })),
  };

  const fields = [
    ...FIELDS,
    {
      label: "Unité",
      name: "location_id",
      options: locations.map(({ id: value, name: label }) => ({
        label,
        value,
      })),
      type: "select",
    },
    {
      ariaName: "la convention",
      label: "Conventions",
      name: "agreements",
      tags: agreements.map(({ id, idcc, name }) => ({
        id,
        value: `${idcc} - ${name}`,
      })),
      type: "tags",
    },
  ];

  return {
    defaultData,
    fields,
  };
};

const AdminUsersEditPage = withAdminEdit(
  {
    apiPath: "/rpc/update_user",
    i18nSubject: "utilisateur",
    indexPath: "/users",
  },
  componentDidMount,
);

export default AdminUsersEditPage;
