const TAGS_CATEGORIES = [
  {
    id: "00000000-0000-4000-0000-000000000401",
    value: "Cible"
  },
  {
    id: "00000000-0000-4000-0000-000000000402",
    value: "Particularisme"
  },
  {
    id: "00000000-0000-4000-0000-000000000403",
    value: "Thème"
  },
  {
    id: "00000000-0000-4000-0000-000000000404",
    value: "Type d'horaire"
  },
  {
    id: "00000000-0000-4000-0000-000000000405",
    value: "Type de contrat"
  },
  {
    id: "00000000-0000-4000-0000-000000000406",
    value: "Temps de travail"
  }
];

const TAGS = [
  { value: `CDI`, tag_category_id: "00000000-0000-4000-0000-000000000405" },
  { value: `CDD`, tag_category_id: "00000000-0000-4000-0000-000000000405" },
  { value: `CTT`, tag_category_id: "00000000-0000-4000-0000-000000000405" },
  { value: `CESU`, tag_category_id: "00000000-0000-4000-0000-000000000405" },
  { value: `CEA`, tag_category_id: "00000000-0000-4000-0000-000000000405" },
  {
    value: `Contrat de professionnalisation`,
    tag_category_id: "00000000-0000-4000-0000-000000000405"
  },
  {
    value: `Contrat d'apprentissage`,
    tag_category_id: "00000000-0000-4000-0000-000000000405"
  },
  {
    value: `Contrat saisonnier`,
    tag_category_id: "00000000-0000-4000-0000-000000000405"
  },

  {
    value: `Contrat de travail`,
    tag_category_id: "00000000-0000-4000-0000-000000000403"
  },
  {
    value: `Durée du travail`,
    tag_category_id: "00000000-0000-4000-0000-000000000403"
  },
  {
    value: `Embauche`,
    tag_category_id: "00000000-0000-4000-0000-000000000403"
  },
  { value: `Rupture`, tag_category_id: "00000000-0000-4000-0000-000000000403" },
  {
    value: `Inaptitude`,
    tag_category_id: "00000000-0000-4000-0000-000000000403"
  },

  {
    value: `Employeur`,
    tag_category_id: "00000000-0000-4000-0000-000000000401"
  },
  { value: `Salarié`, tag_category_id: "00000000-0000-4000-0000-000000000401" },

  { value: `Mayotte`, tag_category_id: "00000000-0000-4000-0000-000000000402" },
  {
    value: `Alsace-Moselle`,
    tag_category_id: "00000000-0000-4000-0000-000000000402"
  },
  { value: `DOM`, tag_category_id: "00000000-0000-4000-0000-000000000402" },

  {
    value: `Temps plein`,
    tag_category_id: "00000000-0000-4000-0000-000000000406"
  },
  {
    value: `Temps partiel`,
    tag_category_id: "00000000-0000-4000-0000-000000000406"
  },

  {
    value: `Collectif`,
    tag_category_id: "00000000-0000-4000-0000-000000000404"
  },
  {
    value: `Individuel`,
    tag_category_id: "00000000-0000-4000-0000-000000000404"
  },
  { value: `Forfait`, tag_category_id: "00000000-0000-4000-0000-000000000404" }
];

exports.seed = async knex => {
  global.spinner.start(`Generating tags categories...`);
  await knex("api.tags_categories").insert(TAGS_CATEGORIES);
  global.spinner.succeed(`Tags categories generated.`);

  global.spinner.start(`Generating tags...`);
  await knex("api.tags").insert(TAGS);
  global.spinner.succeed(`Tags generated.`);
};
