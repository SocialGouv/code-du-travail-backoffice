exports.seed = async knex => {
  global.spinner.start(`Generating tags...`)

  const tags = [
    { value: `CDI`, category: 'contract_type' },
    { value: `CDD`, category: 'contract_type' },
    { value: `CTT`, category: 'contract_type' },
    { value: `CESU`, category: 'contract_type' },
    { value: `CEA`, category: 'contract_type' },
    { value: `Contrat de professionnalisation`, category: 'contract_type' },
    { value: `Contrat d'apprentissage`, category: 'contract_type' },
    { value: `Contrat saisonnier`, category: 'contract_type' },

    { value: `Contrat de travail`, category: 'theme' },
    { value: `Durée du travail`, category: 'theme' },
    { value: `Embauche`, category: 'theme' },
    { value: `Rupture`, category: 'theme' },
    { value: `Inaptitude`, category: 'theme' },

    { value: `Employeur`, category: 'target' },
    { value: `Salarié`, category: 'target' },

    { value: `Mayotte`, category: 'distinctive_identity' },
    { value: `Alsace-Moselle`, category: 'distinctive_identity' },
    { value: `DOM`, category: 'distinctive_identity' },

    { value: `Temps plein`, category: 'work_time' },
    { value: `Temps partiel`, category: 'work_time' },

    { value: `Collectif`, category: 'work_schedule_type' },
    { value: `Individuel`, category: 'work_schedule_type' },
    { value: `Forfait`, category: 'work_schedule_type' },
  ]

  await knex('api.tags').insert(tags)

  global.spinner.succeed(`Tags generated.`)
}
