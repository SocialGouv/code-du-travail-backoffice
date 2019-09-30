exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`);

  const { data: agreements } = await global.axios.get("/agreements");

  await knex("api.agreements").insert(agreements.slice(0, 100));

  global.spinner.succeed(`Agreements generated.`);
};
