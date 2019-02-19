exports.seed = async knex => {
  await knex('api.answers').del()
  await knex('api.questions').del()
  await knex('basic_auth.users').del()

  const [administratorId, contributorId] = await knex("basic_auth.users")
    .returning("id")
    .insert([
      {
        email: "administrator@example.com",
        password: "Azerty123",
        role: "administrator"
      },
      {
        email: "contributor@example.com",
        password: "Azerty123",
        role: "contributor"
      }
    ]);

  const [questionId] = await knex('api.questions')
    .returning('id')
    .insert([
      {
        value: 'A first question?',
        user_id: administratorId,
      },
    ])

  await knex('api.answers').insert([
    {
      value: 'A first answer.',
      question_id: questionId,
      user_id: contributorId,
    },
  ])
}
