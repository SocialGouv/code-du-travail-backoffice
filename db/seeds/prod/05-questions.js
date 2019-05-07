exports.seed = async knex => {
  global.spinner.start(`Generating questions...`)

  const questions = [
    { index: 1, value: `Si un poste se libère ou est créé dans mon entreprise, mon employeur devra-t-il m’en informer voire me le proposer en priorité?` },
    { index: 2, value: `Ma convention collective prévoit-elle des mesures spécifiques sur l’égalité professionnelle femmes-hommes ?` },
    { index: 3, value: `Quelle est la durée de ma période d’essai ?` },
    { index: 4, value: `Ma période d’essai peut-elle être renouvelée ?` },
    { index: 5, value: `Quelle est la durée maximale de ma période d’essai ?` },
    { index: 6, value: `Je tombe malade pendant ma période d’essai : mon arrêt maladie reporte-t-il la fin de ma période d’essai ?` },
    { index: 7, value: `J’ai commencé à travailler sans signer de contrat de travail, est-ce normal ?` },
    { index: 8, value: `Quelles informations doivent figurer dans mon contrat de travail ou ma lettre d’engagement ?` },
    { index: 9, value: `Mon patron peut-il m’embaucher dans le cadre du CDI de chantier ou d’opération?` },
    { index: 10, value: `Quelles sont les modalités et contreparties prévues dans ma branche concernant la clause de non concurrence ?` },
    { index: 11, value: `Combien de fois mon contrat peut-il être renouvelé ?` },
	  { index: 12, value: `Quelle est la durée maximale de mon CDD ?` },
    { index: 13, value: `Mon employeur doit-il respecter un certain délai entre 2 CDD (délai de carence) ? Si oui, comment dois-je le calculer ?` },
    { index: 14, value: `Dans le cadre d’un CDD, quel est le montant de l’indemnité de fin de contrat, comment se calcule-t-elle ?` },
    { index: 15, value: `Mon patron peut-il m’embaucher en CDD d’usage ?` },
    { index: 16, value: `Combien de fois mon contrat de travail temporaire peut-il être renouvelé et quelle est la durée maximale de mon contrat de travail temporaire?` },
    { index: 17, value: `Mon employeur doit-il respecter un certain délai entre 2 contrat de travail temporaire (délai de carence) ? Si oui, comment dois-je le calculer ?` },
    { index: 18, value: `Dans le cadre d’un contrat de travail temporaire, quel est le montant de l’indemnité de fin de contrat, comment se calcule-t-elle ?` },
    { index: 19, value: `Est-ce que je peux cumuler plusieurs emplois ?` },
    { index: 20, value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ouvriers?` },
    { index: 21, value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ETAM ?` },
    { index: 22, value: `Quelle est la Durée de préavis à respecter en cas de démission pour les ingénieurs et cadres ?` },
    { index: 23, value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ouvriers ?` },
    { index: 24, value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ETAM ?` },
    { index: 25, value: `Quelle est la Durée de préavis à respecter en cas de licenciement pour les ingénieurs et cadres ?` },
    { index: 26, value: `Quelle est la Durée de préavis en cas de départ à la retraite pour les ouvriers ?` },
    { index: 27, value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ETAM ?` },
    { index: 28, value: `Quelle est la Durée de préavis à respecter en cas de départ à la retraite pour les ingénieurs et cadres ?` },
    { index: 29, value: `Quelle est la Durée de préavis en cas de mise à la retraite pour les ouvriers ?` },
    { index: 30, value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ETAM ?` },
    { index: 31, value: `Quelle est la Durée de préavis à respecter en cas de mise à la retraite pour les ingénieurs et cadres ?` },
    { index: 32, value: `Mon préavis de licenciement ou de démission doit-il être exécuté en totalité ?` },
    { index: 33, value: `Mon préavis doit-il être exécuté si j’ai été licencié et que j’ai retrouvé un emploi ?` },
    { index: 34, value: `J’ai démissionné et je viens de retrouver un emploi. Je suis encore en préavis, est ce que j’ai le droit de démarrer chez mon nouvel employeur sans finir mon préavis ?` },
    { index: 35, value: `Est-ce que je peux rechercher un emploi au cours de mon préavis ?` },
    { index: 36, value: `Si le préavis n’est pas respecté par le salarié ou l’employeur, ai-je le droit à une réparation et à quelle hauteur ?` },
    { index: 37, value: `Je tombe malade pendant mon préavis : mon arrêt maladie reporte-t-il le préavis ?` },
    { index: 38, value: `Comment connaître mon ancienneté dans l’entreprise et comment se calcule-t-elle ?` },
    { index: 39, value: `Ai-je droit à une prime d’ancienneté ? comment l’obtenir ?` },
    { index: 40, value: `Qu’advient-il de mon contrat de travail en cas de perte de marché par mon employeur au profit d’un nouvel employeur ?` },
    { index: 41, value: `Mon employeur décède, qu’advient-il de mon contrat de travail ?` },
    { index: 42, value: `Quelles sont les modalités de calcul de mon indemnité de départ en retraite ?` },
    { index: 43, value: `Quelles sont les conditions d’indemnisation pendant le congé de maternité dans ma branche ?` },
    { index: 44, value: `Dans ma branche, la durée de mon congé de maternité est-elle différente de celle prévue dans le code du travail ?` },
    { index: 45, value: `En cas d’arrêt maladie, mon employeur doit-il assurer le maintien de mon salaire (hors Alsace Moselle) ?` },
    { index: 46, value: `J'ai été malade durant mes congés payés, cela a t-il un effet sur mes congés ?` },
    { index: 47, value: `Ai-je droit à une garantie d’emploi en cas de maladie ?` },
    { index: 48, value: `Dans ma branche, quelles sont les conditions d’attribution et le montants : De la prime d’insalubrité et de la prime pour travaux dangereux?` },
    { index: 49, value: `Mon comptable m’indique qu’il n’est pas nécessaire de conclure un accord en matière de pénibilité dans l’entreprise : nous avons pourtant des travailleurs poly-exposés, que faire ?` },
    { index: 50, value: `A quels congés pour événement familiaux ai-je droit ?` },
    { index: 51, value: `Existe-t-il des primes spécifiques dans ma branche ?` },
    { index: 52, value: `Que dit ma convention collective sur les jours fériés ? Dois-je travailler ou non ?` },
    { index: 53, value: `Quelles sont les contreparties prévues dans ma branche en cas de travail du dimanche ?` },
  ]

  await knex('api.questions').insert(questions)

  global.spinner.succeed(`Questions generated.`)
}
