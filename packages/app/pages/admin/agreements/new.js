import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input",
  },
  {
    label: "IDCC",
    name: "idcc",
    type: "input",
  },
];

const componentDidMount = async api => {
  const { data: agreements } = await api.get("/agreements");

  const fields = [
    ...FIELDS,
    {
      label: "Convention parente",
      name: "parent_id",
      options: agreements.map(({ id, idcc, name }) => ({
        label: `${idcc} - ${name}`,
        value: id,
      })),
      type: "select",
    },
  ];

  return { fields };
};

const AdminAgreementsNewPage = withAdminNew(
  {
    apiPath: "/agreements",
    i18nIsFeminine: true,
    i18nSubject: "convention",
    indexPath: "/agreements",
  },
  componentDidMount,
);

export default AdminAgreementsNewPage;
