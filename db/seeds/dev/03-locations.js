exports.seed = async knex => {
  global.spinner.start(`Generating locations...`)

  const locations = [
    { name: `UR d'Auvergne-Rhône-Alpes` },
    { name: `UR d'Occitanie` },
    { name: `UR d'Île-de-France` },
    { name: `UR de Bourgogne-Franche-Comté` },
    { name: `UR de Bretagne` },
    { name: `UR de Corse` },
    { name: `UR de Normandie` },
    { name: `UR de Nouvelle-Aquitaine` },
    { name: `UR de Provence-Alpes-Côte d'Azur` },
    { name: `UR des Hauts-de-France` },
    { name: `UR des Pays de la Loire` },
    { name: `UR du Centre-Val de Loire` },
    { name: `UR du Grand Est` },
  ]

  await knex('api.locations').insert(locations)

  global.spinner.succeed(`Locations generated.`)
}
