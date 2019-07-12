exports.seed = async knex => {
  global.spinner.start(`Generating questions...`)

  const questions = [
    { index: 1, value: `Question 1 ?` },
    { index: 2, value: `Question 2 ?` },
    { index: 3, value: `Question 3 ?` },
    { index: 4, value: `Question 4 ?` },
    { index: 5, value: `Question 5 ?` },
  ]

  await knex('api.questions').insert(questions)

  global.spinner.succeed(`Questions generated.`)
}
