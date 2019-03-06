exports.seed = async knex => {
  global.spinner.start(`Generating locations...`)

  const locations = [
    { name: `UR de Nouvelle-Aquitaine` },
    { name: `UR d'Île-de-France` },
  ]

  await knex('api.locations').insert(locations)

  global.spinner.succeed(`Locations generated.`)
}
