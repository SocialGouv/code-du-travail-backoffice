import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    label: "Question usager",
    name: "question",
    type: "input",
  },
  {
    helpText: "Une par ligne.",
    label: "Questions similaires",
    name: "variations",
    type: "text",
  },
  {
    label: "Réponse générique",
    name: "generic_answer",
    type: "markdown",
  },
];

const componentDidMount = async api => {
  const { data: themes } = await api.orderBy("title").get("/themes");

  const fields = [
    ...FIELDS,
    {
      label: "Thème",
      name: "theme_id",
      options: themes.map(({ id: value, title: label }) => ({
        label,
        value,
      })),
      type: "select",
    },
  ];

  return { fields };
};

const AdminDefinitionsNewPage = withAdminNew(
  {
    apiPath: "/requests",
    i18nIsFeminine: true,
    i18nSubject: "requête",
    indexPath: "/requests",
  },
  componentDidMount,
);

export default AdminDefinitionsNewPage;
