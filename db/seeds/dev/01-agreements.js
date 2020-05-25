exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`);

  const { data: allAgreements } = await global.postgresterClient.get("/agreements");
  const { data: locationsAgreements } = await global.postgresterClient.get("/locations_agreements");

  const activeAgreementIds = locationsAgreements.map(({ agreement_id }) => agreement_id);
  const agreements = allAgreements.filter(({ id }) => activeAgreementIds.includes(id));

  await knex("api.agreements").insert(agreements);

  global.spinner.succeed(`Agreements generated.`);
};
