exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`);

  const { data: agreements } = await global.postgresterClient.get("/agreements");

  await knex("api.agreements").insert(agreements);

  global.spinner.succeed(`Agreements generated.`);
};
