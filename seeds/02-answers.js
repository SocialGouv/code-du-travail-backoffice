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

  const questionIds = await knex('api.questions')
    .returning('id')
    .insert([
      {
        value: `En cas de vacances ou de création de poste, mon employeur doit il me les proposer en priorité ?`,
        user_id: administratorId
      },
      {
        value: `Dans ma branche, suis-je obligé d’embaucher du personnel féminin ?`,
        user_id: administratorId
      },
      {
        value: `Dans ma branche, qu’est-il prévu en matière d’équilibre vie professionnelle, vie privée ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la durée de ma période d’essai ?`,
        user_id: administratorId
      },
      {
        value: `Ma période d’essai peut-elle être renouvelée ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la durée maximale de ma période d’essai, renouvèlement compris ?`,
        user_id: administratorId
      },
      {
        value: `J’ai commencé à travailler sans signer de contrat de travail, comment être sûr de mon embauche dans l’entreprise ?`,
        user_id: administratorId
      },
      {
        value: `Quelles informations doivent figurer dans mon contrat de travail ou ma lettre d’engagement dans ma branche ?`,
        user_id: administratorId
      },
      {
        value: `Mon patron peut-il m’embaucher dans le cadre du CDI de chantier ou d’opération ? `,
        user_id: administratorId
      },
      {
        value: `Combien de fois mon contrat peut-il être renouvelé ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la durée maximale de mon CDD ? `,
        user_id: administratorId
      },
      {
        value: `Quelle est la durée de carence prévue pour un CDD ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les modalités de calcul du délai de carence avec le CDD ?`,
        user_id: administratorId
      },
      {
        value: `Le contrat à durée déterminée (CDD) : L’indemnité de fin de contrat peut-elle être limitée ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les modalités de calcul du délai de carence ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les garanties prévues par la mutuelle de mon entreprise ?`,
        user_id: administratorId
      },
      {
        value: `Quelles est ma garantie d’emploi en cas de maladie ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les prestations prisses en charge pas la complémentaire santé ?`,
        user_id: administratorId
      },
      {
        value: `Est-ce que je peux cumuler plusieurs emplois ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ouvriers ?`,
        user_id: administratorId
      },
      /*{
        value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ETAM ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ingénieur et cadre ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ouvriers ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ETAM?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ingénieur et cadre ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis en cas de départ à la retraite pour les ouvriers?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ETAM ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ingénieur et cadre ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis en cas de mise à la retraite pour les ouvriers ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ETAM ?`,
        user_id: administratorId
      },
      {
        value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ingénieur et cadre ?`,
        user_id: administratorId
      },
      {
        value: `Mon préavis de licenciement ou de démission doit-il être exécuté en totalité ?`,
        user_id: administratorId
      },
      {
        value: `Mon préavis doit-il être exécuté si j’ai été licencié et que j’ai retrouvé un emploi ?`,
        user_id: administratorId
      },
      {
        value: `J’ai démissionné et viens de retrouver un emploi. Si je suis encore en préavis, est ce que j’ai le droit de démarrer chez mon nouvel employeur ?`,
        user_id: administratorId
      },
      {
        value: `Est-ce que je peux rechercher un emploi au cours de mon préavis ?`,
        user_id: administratorId
      },
      {
        value: `Si le préavis n’est pas respecté par le salarié ou l’employeur, ai-je le droit à une réparation et à quelle hauteur (montant de l’indemnité compensatrice de préavis )`,
        user_id: administratorId
      },
      {
        value: `Mon arrêt maladie reporte-t-il le préavis ? `,
        user_id: administratorId
      },
      {
        value: `Comment connaitre mon ancienneté dans l’entreprise ? comment se calcule-t-elle ?`,
        user_id: administratorId
      },
      {
        value: `Ai-je droit à une prime d’ancienneté ? comment l’obtenir ?`,
        user_id: administratorId
      },
      {
        value: `Poursuite du contrat de travail ?`,
        user_id: administratorId
      },
      {
        value: `Qu’advient-il de mon contrat de travail en cas de perte de marché par mon employeur au profit d’un nouvel employeur ?`,
        user_id: administratorId
      },
      {
        value: `Mon employeur décède, qu’advient-il de mon contrat de travail ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les modalités de calcul de mon indemnité départ en retraite ?`,
        user_id: administratorId
      },
      {
        value: `Quel est le montant de mon indemnité de départ en retraite ? `,
        user_id: administratorId
      },
      {
        value: `Quel est le montant de mon indemnité de mise en retraite ? `,
        user_id: administratorId
      },
      {
        value: `Quelle est l’ancienneté minimale à laquelle je peux prétendre à une indemnité de licenciement ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les compétences professionnelles nécessaire dans ma branche pour être maitre d’apprentissage ?`,
        user_id: administratorId
      },
      {
        value: `Quel qualification faut-il pour être Maitre d’apprentissage ?`,
        user_id: administratorId
      },
      {
        value: `Prime de tutorat : quelles sont les conditions d’attributions ?`,
        user_id: administratorId
      },
      {
        value: `Quel est le montant de la prime de tutorat ?`,
        user_id: administratorId
      },
      {
        value: `Quelles sont les conditions d’indemnisation pendant le congé de maternité dans ma branche ? `,
        user_id: administratorId
      },
      {
        value: `Dans ma branche, la durée de mon congé de maternité est-elle différente que dans le code du travail ?`,
        user_id: administratorId
      },
      {
        value: `En cas d’arrêt maladie, mon employeur doit il assurer le maintien de mon salaire ?`,
        user_id: administratorId
      },
      {
        value: `J’ai été malade durant mes congés payés, cela a-t-il un effet sur mes congés ?`,
        user_id: administratorId
      },
      {
        value: `Mon comptable m’indique qu’il n’est pas nécessaire de conclure un accord en matière de pénibilité dans l’entreprise: nous avons pourtant des travailleurs polyexposés, que faire ?`,
        user_id: administratorId
      },
      {
        value: `Une collègue m’indique que j’ai le droit de poser une journée pour mon déménagement, hors congés payés et RTT, est-ce vrai ?`,
        user_id: administratorId
      },
      {
        value: `J’ai rendez-vous pour mon PACS dans la mairie de mon futur conjoint à l’autre bout de la France, faut-il que je pose des jours au titre des congés payés ?`,
        user_id: administratorId
      },*/
    ])

  const laborAgreementIds = await knex('api.labor_agreements')
    .select('id')
    .map(entry => entry.id)

  const answers = questionIds.reduce(
    (acc, questionId) => [
      ...acc,
      ...laborAgreementIds.map(laborAgreementId => ({
        value: '',
        question_id: questionId,
        user_id: contributorId,
        labor_agreement_id: laborAgreementId
      }))
    ],
    []
  )

  await knex('api.answers').insert(answers)
}
