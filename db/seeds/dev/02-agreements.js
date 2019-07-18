exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`)

  const agreements = [
    { idcc: '0001', zones: ['OC975'], name: `Convention collective ultramarine de Saint-Pierre-et-Miquelon` },
    { idcc: '0012', zones: ['04'], name: `Convention collective régionale de La Réunion` },
    { idcc: '0123', zones: ['001'], name: `Convention collective départementale de l'Ain` },
    { idcc: '1234', zones: ['002', '003'], name: `Convention collective multi-territoriale de l'Aisne et de l'Allier` },
    { idcc: '5678', zones: [], name: `Convention collective nationale` },
  ]

  await knex("api.agreements")
    .insert(agreements.map(({ idcc, name }) => ({ idcc, name })))

  for (let agreement of agreements) {
    if (agreement.zones === undefined || agreement.zones.length === 0) continue;

    const agreementRes = await knex('api.agreements')
      .where({ idcc: agreement.idcc })
    const zoneRes = await knex('api.zones')
      .whereIn('code', agreement.zones)

    for (let zone of zoneRes) {
      await knex('api.agreements_zones').insert({
        agreement_id: agreementRes[0].id,
        zone_id: zone.id
      })
    }
  }

  global.spinner.succeed(`Agreements generated.`)
}
