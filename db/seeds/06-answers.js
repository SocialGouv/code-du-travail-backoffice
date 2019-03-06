exports.seed = async knex => {
  global.spinner.start(`Generating answers...`)

  const questions = await knex('api.questions')
  const agreements = await knex('api.agreements')

  const answers = questions.reduce(
    (acc, { id: question_id }) => [
      ...acc,
      ...agreements.map(({ id: agreement_id }) => ({
        value: '',
        question_id,
        agreement_id
      }))
    ],
    []
  )

  await knex('api.answers').insert(answers)

  global.spinner.succeed(`Answers generated.`)
}
