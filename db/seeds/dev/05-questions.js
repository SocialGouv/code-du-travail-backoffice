exports.seed = async knex => {
  global.spinner.start(`Generating questions...`);

  const { data: questions } = await global.axios.get("/questions");

  await knex("api.questions").insert(questions);

  global.spinner.succeed(`Questions generated.`);
};
