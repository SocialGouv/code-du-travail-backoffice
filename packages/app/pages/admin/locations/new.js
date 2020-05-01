import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input",
  },
];

const componentDidMount = async api => {
  const { data: agreements } = await api.get("/agreements");

  const fields = [
    ...FIELDS,
    {
      apiPath: "/locations_agreements",
      ariaName: "la convention",
      label: "Conventions",
      name: "agreements",
      tags: agreements.map(({ id, idcc, name }) => ({
        label: `${idcc} - ${name}`,
        value: id,
      })),
      type: "tags",
    },
  ];

  return { fields };
};

const AdminLocationsNewPage = withAdminNew(
  {
    apiPath: "/locations",
    i18nIsFeminine: true,
    i18nSubject: "unité",
    indexPath: "/locations",
    name: "locations",
  },
  componentDidMount,
);

export default AdminLocationsNewPage;
