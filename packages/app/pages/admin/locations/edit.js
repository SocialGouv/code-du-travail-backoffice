import withAdminEdit from "../../../src/templates/withAdminEdit";
import { FIELDS } from "./new";

const componentDidMount = async (api, id) => {
  const { data: locations } = await api
    .eq("id", id)
    .select("*")
    .select("agreements(*)")
    .get("/locations");
  const { data: agreements } = await api.get("/agreements");

  const defaultData = {
    ...locations[0],
    agreements: locations[0].agreements.map(agreement => ({
      id: agreement.id,
      value: `${agreement.idcc} - ${agreement.name}`,
    })),
  };

  const fields = [
    ...FIELDS,
    {
      apiPath: "/locations_agreements",
      label: "Conventions",
      name: "agreements",
      tags: agreements.map(({ id, idcc, name }) => ({
        label: `${idcc} - ${name}`,
        value: id,
      })),
      type: "tags",
    },
  ];

  return { defaultData, fields };
};

const AdminLocationsEditPage = withAdminEdit(
  {
    apiPath: "/locations",
    i18nIsFeminine: true,
    i18nSubject: "unité",
    indexPath: "/locations",
    name: "locations",
  },
  componentDidMount,
);

export default AdminLocationsEditPage;
