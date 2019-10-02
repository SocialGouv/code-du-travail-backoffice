function getRandomArrayValue(input) {
  return input[Math.floor(Math.random() * input.length)];
}

const LOCATION_ZONE_CODE = {
  "UR de Bourgogne-Franche-Comté": "27",
  "UR d'Auvergne-Rhône-Alpes": "84",
  "UR d'Occitanie": "76",
  "UR de Provence-Alpes-Côte d'Azur": "93",
  "UR du Grand Est": "44",
  "UR des Pays de la Loire": "52",
  "UR de Bretagne": "53",
  "UR de Normandie": "28",
  "UR d'Île-de-France": "11",
  "UR du Centre-Val de Loire": "24",
  "UR de Corse": "94",
  "UR de Nouvelle-Aquitaine": "75",
  "UR des Hauts-de-France": "32"
};

exports.seed = async knex => {
  global.spinner.start(`Generating locations...`);

  const zones = await knex("api.zones");
  const { data: _locations } = await global.axios.get("/locations");
  const locations = _locations
    .filter(({ name }) => name.startsWith("UR"))
    .map(location => ({
      ...location,
      zone_id: zones.filter(
        ({ code }) => code === LOCATION_ZONE_CODE[location.name]
      )[0].id
    }));

  await knex("api.locations").insert(locations);

  const agreements = await knex("api.agreements");

  await knex
    .insert(
      agreements.map(({ id: agreement_id }) => ({
        location_id: getRandomArrayValue(locations).id,
        agreement_id
      }))
    )
    .into("api.locations_agreements");

  global.spinner.succeed(`Locations generated.`);
};
