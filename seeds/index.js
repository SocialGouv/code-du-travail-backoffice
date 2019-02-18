const uuid = require('uuid')

exports.seed = async knex => {
  await knex('api.answers').del()
  await knex('api.questions').del()
  await knex('basic_auth.users').del()

  const administratorId = uuid.v4()
  const contributorId = uuid.v4()
  await knex('basic_auth.users').insert([
    {
      id: administratorId,
      email: 'administrator@example.com',
      password: 'Azerty123',
      role: 'administrator'
    },
    {
      id: contributorId,
      email: 'contributor@example.com',
      password: 'Azerty123',
      role: 'contributor'
    },
  ])

  const questionId = uuid.v4()
  await knex('api.questions').insert([
    {
      id: questionId,
      value: 'A first question?',
      user_id: administratorId,
    },
  ])

  const answerId = uuid.v4()
  await knex('api.answers').insert([
    {
      id: answerId,
      value: 'A first answer.',
      question_id: questionId,
      user_id: contributorId,
    },
  ])
}
