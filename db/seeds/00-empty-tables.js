const ora = require('ora')
global.spinner = ora()

exports.seed = async knex => {
  global.spinner.start(`Emptying tables...`)

  await knex('api.answers_tags').del()
  await knex('api.questions_tags').del()
  await knex('api.tags').del()
  await knex('api.answers').del()
  await knex('api.questions').del()
  await knex('users_agreements').del()
  await knex('auth.users').del()
  await knex('api.locations_agreements').del()
  await knex('api.locations').del()
  await knex('api.agreements').del()

  global.spinner.succeed(`Tables emptied.`)
}
