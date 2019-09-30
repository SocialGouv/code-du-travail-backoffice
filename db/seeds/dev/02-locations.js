function getRandomArrayValue(input) {
  return input[Math.floor(Math.random() * input.length)];
}

exports.seed = async knex => {
  global.spinner.start(`Generating locations...`);

  const { data: _locations } = await global.axios.get("/locations");
  const locations = _locations.filter(({ name }) => name.startsWith("UR"));

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
