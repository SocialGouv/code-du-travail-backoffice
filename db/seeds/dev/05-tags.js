const TAGS_CATEGORIES = [
  {
    id: "00000000-0000-4000-8000-000000000501",
    value: "Cible"
  },
  {
    id: "00000000-0000-4000-8000-000000000502",
    value: "Particularisme"
  },
  {
    id: "00000000-0000-4000-8000-000000000503",
    value: "Thème"
  },
  {
    id: "00000000-0000-4000-8000-000000000504",
    value: "Type d'horaire"
  },
  {
    id: "00000000-0000-4000-8000-000000000505",
    value: "Type de contrat"
  },
  {
    id: "00000000-0000-4000-8000-000000000506",
    value: "Temps de travail"
  }
];

const TAGS = [
  { value: `CDI`, tag_category_id: "00000000-0000-4000-8000-000000000505" },
  { value: `CDD`, tag_category_id: "00000000-0000-4000-8000-000000000505" },
  { value: `CTT`, tag_category_id: "00000000-0000-4000-8000-000000000505" },
  { value: `CESU`, tag_category_id: "00000000-0000-4000-8000-000000000505" },
  { value: `CEA`, tag_category_id: "00000000-0000-4000-8000-000000000505" },
  {
    value: `Contrat de professionnalisation`,
    tag_category_id: "00000000-0000-4000-8000-000000000505"
  },
  {
    value: `Contrat d'apprentissage`,
    tag_category_id: "00000000-0000-4000-8000-000000000505"
  },
  {
    value: `Contrat saisonnier`,
    tag_category_id: "00000000-0000-4000-8000-000000000505"
  },

  {
    value: `Contrat de travail`,
    tag_category_id: "00000000-0000-4000-8000-000000000503"
  },
  {
    value: `Durée du travail`,
    tag_category_id: "00000000-0000-4000-8000-000000000503"
  },
  {
    value: `Embauche`,
    tag_category_id: "00000000-0000-4000-8000-000000000503"
  },
  { value: `Rupture`, tag_category_id: "00000000-0000-4000-8000-000000000503" },
  {
    value: `Inaptitude`,
    tag_category_id: "00000000-0000-4000-8000-000000000503"
  },

  {
    value: `Employeur`,
    tag_category_id: "00000000-0000-4000-8000-000000000501"
  },
  { value: `Salarié`, tag_category_id: "00000000-0000-4000-8000-000000000501" },

  { value: `Mayotte`, tag_category_id: "00000000-0000-4000-8000-000000000502" },
  {
    value: `Alsace-Moselle`,
    tag_category_id: "00000000-0000-4000-8000-000000000502"
  },
  { value: `DOM`, tag_category_id: "00000000-0000-4000-8000-000000000502" },

  {
    value: `Temps plein`,
    tag_category_id: "00000000-0000-4000-8000-000000000506"
  },
  {
    value: `Temps partiel`,
    tag_category_id: "00000000-0000-4000-8000-000000000506"
  },

  {
    value: `Collectif`,
    tag_category_id: "00000000-0000-4000-8000-000000000504"
  },
  {
    value: `Individuel`,
    tag_category_id: "00000000-0000-4000-8000-000000000504"
  },
  { value: `Forfait`, tag_category_id: "00000000-0000-4000-8000-000000000504" }
];

exports.seed = async knex => {
  global.spinner.start(`Generating tags categories...`);
  await knex("api.tags_categories").insert(TAGS_CATEGORIES);
  global.spinner.succeed(`Tags categories generated.`);

  global.spinner.start(`Generating tags...`);
  await knex("api.tags").insert(TAGS);
  global.spinner.succeed(`Tags generated.`);
};
