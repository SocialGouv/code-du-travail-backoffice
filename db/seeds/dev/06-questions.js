exports.seed = async knex => {
  global.spinner.start(`Generating questions...`)

  const questions = [
    { index: 1, value: `Quelle est ma première question ?` },
    { index: 2, value: `Quelle est ma deuxième question ?` },
    { index: 3, value: `Quelle est ma troisième question ?` },
    { index: 4, value: `Quelle est ma quatrième question ?` },
    { index: 5, value: `Quelle est ma cinquième question ?` },
    { index: 6, value: `Quelle est ma sixième question ?` },
    { index: 7, value: `Quelle est ma septième question ?` },
    { index: 8, value: `Quelle est ma huitième question ?` },
    { index: 9, value: `Quelle est ma neuvième question ?` },
    { index: 10, value: `Quelle est ma dixième question ?` },
  ]

  await knex('api.questions').insert(questions)

  global.spinner.succeed(`Questions generated.`)
}
