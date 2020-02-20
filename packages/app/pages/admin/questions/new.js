import withAdminNew from "../../../src/templates/withAdminNew";

export const FIELDS = [
  {
    inputType: "number",
    label: "Index",
    name: "index",
    type: "input",
  },
  {
    label: "Intitulé",
    name: "value",
    type: "text",
  },
];

const AdminQuestionsNewPage = withAdminNew({
  apiPath: "/questions",
  fields: FIELDS,
  i18nIsFeminine: true,
  i18nSubject: "question",
  indexPath: "/questions",
});

export default AdminQuestionsNewPage;
