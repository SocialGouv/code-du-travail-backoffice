import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input",
  },
  {
    helpText: "Une par ligne.",
    label: "Abbréviations",
    name: "abbreviations",
    type: "text",
  },
  {
    helpText: "Une par ligne.",
    label: "Variantes",
    name: "variations",
    type: "text",
  },
  {
    label: "Définition",
    name: "value",
    type: "markdown",
  },
];

const AdminDefinitionsNewPage = withAdminNew({
  apiPath: "/definitions",
  fields: FIELDS,
  i18nIsFeminine: true,
  i18nSubject: "définition",
  indexPath: "/definitions",
});

export default AdminDefinitionsNewPage;
