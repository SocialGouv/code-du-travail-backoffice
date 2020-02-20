import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    inputType: "number",
    isReadOnly: true,
    label: "Position",
    name: "position",
    type: "input",
  },
  {
    label: "Titre",
    name: "title",
    type: "input",
  },
  {
    label: "Sous-titre",
    name: "subtitle",
    type: "input",
  },
  {
    helpText: "Une par ligne.",
    label: "Questions-types",
    name: "variations",
    type: "text",
  },
  {
    label: "Introduction",
    name: "introduction",
    type: "markdown",
  },
];

const componentDidMount = async api => {
  const { data: parents } = await api.orderBy("title").get("/themes");

  const defaultData = {
    position: parents.length,
  };

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

  return { defaultData, fields };
};

const AdminThemesNewPage = withAdminNew(
  {
    apiPath: "/themes",
    i18nSubject: "thème",
    indexPath: "/themes",
  },
  componentDidMount,
);

export default AdminThemesNewPage;
