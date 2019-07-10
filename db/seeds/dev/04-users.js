exports.seed = async knex => {
  global.spinner.start(`Generating users...`)

  const locationIds = await knex('api.locations')
    .select('id')
    .map(({ id }) => id)

  const users = [
    {
      email: 'administrator@example.com',
      password: 'Azerty123',
      name: 'Dory The Administrator',
      role: 'administrator',
      location_id: locationIds[0]
    },
    {
      email: 'contributor@example.com',
      password: 'Azerty123',
      name: 'Nemo The Contributor',
      role: 'contributor',
      location_id: locationIds[1]
    },
  ]

  await knex('auth.users').insert(users)

  // Now, let's allow our dummy contributor to only update answers related to
  // the first 5 agreements:

  const [{ id: user_id }] = await knex('auth.users')
    .where({ role: 'contributor' })

  const agreements = await knex('api.agreements')
    .limit(3)

  const usersAgreements = agreements
    .map(({ id: agreement_id }) => ({ user_id, agreement_id }))

  await knex('users_agreements').insert(usersAgreements)

  global.spinner.succeed(`Users generated.`)
}
