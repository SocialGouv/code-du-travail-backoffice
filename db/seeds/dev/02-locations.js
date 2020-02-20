exports.seed = async knex => {
  global.spinner.start(`Generating locations...`);

  const { data: locations } = await global.axios.get("/locations");

  await knex("api.locations").insert(locations);

  const { data: locationsAgreements } = await global.axios.get("/locations_agreements");

  await knex("api.locations_agreements").insert(locationsAgreements);

  global.spinner.succeed(`Locations generated.`);
};
