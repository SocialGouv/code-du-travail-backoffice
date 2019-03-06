exports.seed = async knex => {
  global.spinner.start(`Generating questions...`)

  const questions = [
    { value: `En cas de vacances ou de création de poste, mon employeur doit il me les proposer en priorité ?` },
    { value: `Dans ma branche, suis-je obligé d’embaucher du personnel féminin ?` },
    { value: `Dans ma branche, qu’est-il prévu en matière d’équilibre vie professionnelle, vie privée ?` },
    { value: `Quelle est la durée de ma période d’essai ?` },
    { value: `Ma période d’essai peut-elle être renouvelée ?` },
    { value: `Quelle est la durée maximale de ma période d’essai, renouvèlement compris ?` },
    { value: `J’ai commencé à travailler sans signer de contrat de travail, comment être sûr de mon embauche dans l’entreprise ?` },
    { value: `Quelles informations doivent figurer dans mon contrat de travail ou ma lettre d’engagement dans ma branche ?` },
    { value: `Mon patron peut-il m’embaucher dans le cadre du CDI de chantier ou d’opération ? ` },
    { value: `Combien de fois mon contrat peut-il être renouvelé ?` },
    { value: `Quelle est la durée maximale de mon CDD ? ` },
    { value: `Quelle est la durée de carence prévue pour un CDD ?` },
    { value: `Quelles sont les modalités de calcul du délai de carence avec le CDD ?` },
    { value: `Le contrat à durée déterminée (CDD) : L’indemnité de fin de contrat peut-elle être limitée ?` },
    { value: `Quelles sont les modalités de calcul du délai de carence ?` },
    { value: `Quelles sont les garanties prévues par la mutuelle de mon entreprise ?` },
    { value: `Quelles est ma garantie d’emploi en cas de maladie ?` },
    { value: `Quelles sont les prestations prisses en charge pas la complémentaire santé ?` },
    { value: `Est-ce que je peux cumuler plusieurs emplois ?` },
    { value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ouvriers ?` },
  ]

  await knex('api.questions').insert(questions)

  global.spinner.succeed(`Questions generated.`)
}
