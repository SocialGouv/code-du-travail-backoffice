import generatePassword from "../../../src/libs/generatePassword";
import withAdminNew from "../../../src/templates/withAdminNew";

const PASSWORD_LENGTH = 16;

export const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input",
  },
  {
    label: "Rôle",
    name: "role",
    options: [
      { label: "Administrateur", value: "administrator" },
      { label: "Administrateur régional", value: "regional_administrator" },
      { label: "Contributeur", value: "contributor" },
    ],
    type: "select",
  },
  {
    inputType: "email",
    label: "E-mail",
    name: "email",
    type: "input",
  },
  {
    button: {
      handler: () => generatePassword(PASSWORD_LENGTH),
      icon: "sync",
      title: "Bouton générant un mot de passe aléatoire",
    },
    label: "Mot-de-passe",
    name: "password",
    type: "input",
  },
];

const componentDidMount = async api => {
  const { data: agreements } = await api.get("/agreements");
  const { data: locations } = await api.get("/locations");

  const defaultData = {
    password: generatePassword(PASSWORD_LENGTH),
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
        label: `${idcc} - ${name}`,
        value: id,
      })),
      type: "tags",
    },
  ];

  return { defaultData, fields };
};

const AdminUsersNewPage = withAdminNew(
  {
    apiPath: "/rpc/create_user",
    i18nSubject: "utilisateur",
    indexPath: "/users",
  },
  componentDidMount,
);

export default AdminUsersNewPage;
