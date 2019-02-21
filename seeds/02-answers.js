exports.seed = async knex => {
  const [administratorId, contributorId] = await knex('basic_auth.users')
    .returning('id')
    .insert([
      {
        email: 'administrator@example.com',
        password: 'Azerty123',
        role: 'administrator'
      },
      {
        email: 'contributor@example.com',
        password: 'Azerty123',
        role: 'contributor'
      }
    ])

  const [questionId] = await knex('api.questions')
    .returning('id')
    .insert([
      {
        value: `En cas de vacances ou de création de poste, mon employeur doit il me les proposer en priorité ?`,
        user_id: administratorId
      }
    ])

  const laborAgreementIds = await knex('api.labor_agreements')
    .select('id')
    .map(entry => entry.id)

  const answers = laborAgreementIds.map(laborAgreementId => ({
    value: '',
    question_id: questionId,
    user_id: contributorId,
    labor_agreement_id: laborAgreementId
  }))

  await knex('api.answers').insert(answers)
}
