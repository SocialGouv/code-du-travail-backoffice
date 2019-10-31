exports.seed = async knex => {
  global.spinner.start(`Generating areas...`);

  const { data: areas } = await global.axios.get("/areas");

  await knex("api.areas").insert(areas);

  global.spinner.succeed(`Areas generated.`);
};
