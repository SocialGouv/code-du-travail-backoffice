const TAGS_CATEGORIES = [
  {
    id: "00000000-0000-4000-0000-000000000001",
    value: "Cible"
  },
  {
    id: "00000000-0000-4000-0000-000000000002",
    value: "Particularisme"
  },
  {
    id: "00000000-0000-4000-0000-000000000003",
    value: "Thème"
  },
  {
    id: "00000000-0000-4000-0000-000000000004",
    value: "Type d'horaire"
  },
  {
    id: "00000000-0000-4000-0000-000000000005",
    value: "Type de contrat"
  },
  {
    id: "00000000-0000-4000-0000-000000000006",
    value: "Temps de travail"
  }
];

const TAGS = [
  { value: `CDI`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  { value: `CDD`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  { value: `CTT`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  { value: `CESU`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  { value: `CEA`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  {
    value: `Contrat de professionnalisation`,
    tag_category_id: "00000000-0000-4000-0000-000000000005"
  },
  { value: `Contrat d'apprentissage`, tag_category_id: "00000000-0000-4000-0000-000000000005" },
  { value: `Contrat saisonnier`, tag_category_id: "00000000-0000-4000-0000-000000000005" },

  { value: `Contrat de travail`, tag_category_id: "00000000-0000-4000-0000-000000000003" },
  { value: `Durée du travail`, tag_category_id: "00000000-0000-4000-0000-000000000003" },
  { value: `Embauche`, tag_category_id: "00000000-0000-4000-0000-000000000003" },
  { value: `Rupture`, tag_category_id: "00000000-0000-4000-0000-000000000003" },
  { value: `Inaptitude`, tag_category_id: "00000000-0000-4000-0000-000000000003" },

  { value: `Employeur`, tag_category_id: "00000000-0000-4000-0000-000000000001" },
  { value: `Salarié`, tag_category_id: "00000000-0000-4000-0000-000000000001" },

  { value: `Mayotte`, tag_category_id: "00000000-0000-4000-0000-000000000002" },
  { value: `Alsace-Moselle`, tag_category_id: "00000000-0000-4000-0000-000000000002" },
  { value: `DOM`, tag_category_id: "00000000-0000-4000-0000-000000000002" },

  { value: `Temps plein`, tag_category_id: "00000000-0000-4000-0000-000000000006" },
  { value: `Temps partiel`, tag_category_id: "00000000-0000-4000-0000-000000000006" },

  { value: `Collectif`, tag_category_id: "00000000-0000-4000-0000-000000000004" },
  { value: `Individuel`, tag_category_id: "00000000-0000-4000-0000-000000000004" },
  { value: `Forfait`, tag_category_id: "00000000-0000-4000-0000-000000000004" }
];

exports.seed = async knex => {
  global.spinner.start(`Generating tags categories...`);
  await knex("api.tags_categories").insert(TAGS_CATEGORIES);
  global.spinner.succeed(`Tags categories generated.`);

  global.spinner.start(`Generating tags...`);
  await knex("api.tags").insert(TAGS);
  global.spinner.succeed(`Tags generated.`);
};
