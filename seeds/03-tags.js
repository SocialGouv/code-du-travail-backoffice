exports.seed = async knex => {
  const [administratorId] = await knex('basic_auth.users')
    .where({ email: 'administrator@example.com' })
    .select('id')
    .map(entry => entry.id)

  await knex('api.tags')
    .insert([
      {
        value: `CDI`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `CDD`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `CTT`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `CESU`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `CEA`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `Contrat de professionnalisation`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `Contrat d'apprentissage`,
        category: 'contract_type',
        user_id: administratorId
      },
      {
        value: `Contrat saisonnier`,
        category: 'contract_type',
        user_id: administratorId
      },

      {
        value: `Contrat de travail`,
        category: 'theme',
        user_id: administratorId
      },
      {
        value: `Durée du travail`,
        category: 'theme',
        user_id: administratorId
      },
      {
        value: `Embauche`,
        category: 'theme',
        user_id: administratorId
      },
      {
        value: `Rupture`,
        category: 'theme',
        user_id: administratorId
      },
      {
        value: `Inaptitude`,
        category: 'theme',
        user_id: administratorId
      },

      {
        value: `Employeur`,
        category: 'target',
        user_id: administratorId
      },
      {
        value: `Salarié`,
        category: 'target',
        user_id: administratorId
      },

      {
        value: `Mayotte`,
        category: 'distinctive_identity',
        user_id: administratorId
      },
      {
        value: `Alsace-Moselle`,
        category: 'distinctive_identity',
        user_id: administratorId
      },
      {
        value: `DOM`,
        category: 'distinctive_identity',
        user_id: administratorId
      },

      {
        value: `Temps plein`,
        category: 'work_time',
        user_id: administratorId
      },
      {
        value: `Temps partiel`,
        category: 'work_time',
        user_id: administratorId
      },

      {
        value: `Collectif`,
        category: 'work_schedule_type',
        user_id: administratorId
      },
      {
        value: `Individuel`,
        category: 'work_schedule_type',
        user_id: administratorId
      },
      {
        value: `Forfait`,
        category: 'work_schedule_type',
        user_id: administratorId
      },
    ])
}
