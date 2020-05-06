exports.seed = async knex => {
  global.spinner.start(`Generating locations...`);

  const { data: locations } = await global.postgresterClient.get("/locations");

  await knex("api.locations").insert(locations);

  const { data: locationsAgreements } = await global.postgresterClient.get("/locations_agreements");

  await knex("api.locations_agreements").insert(locationsAgreements);

  global.spinner.succeed(`Locations generated.`);
};
