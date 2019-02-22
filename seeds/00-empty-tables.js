exports.seed = async knex => {
  await knex('answers_tags').del()
  await knex('questions_tags').del()
  await knex('api.answers').del()
  await knex('api.questions').del()
  await knex('api.tags').del()
  await knex('api.labor_agreements').del()
  await knex('basic_auth.users').del()
}
