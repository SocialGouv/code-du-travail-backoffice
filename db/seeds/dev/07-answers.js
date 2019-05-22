exports.seed = async knex => {
  global.spinner.start(`Generating answers...`)

  const questions = await knex('api.questions')
  const agreements = await knex('api.agreements')

  for (let question of questions) {
    global.spinner.start(`Generating answers: ${question.value}`)

    const answers = agreements.map((agreement) => ({
      value: '',
      question_id: question.id,
      agreement_id: agreement.id
    }))

    await knex('api.answers').insert(answers)
  }

  global.spinner.succeed(`Answers generated.`)
}
