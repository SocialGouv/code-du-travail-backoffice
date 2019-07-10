exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`)

  const agreements = [
    { idcc: '0001', zones: ['OC975'], name: `Convention 1` },
    { idcc: '0002', zones: ['01'], name: `Convention 2` },
    { idcc: '0003', zones: ['001'], name: `Convention 3` },
    { idcc: '0004', zones: ['002', '971'], name: `Convention 4` },
    { idcc: '0005', zones: [], name: `Convention 5` },
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
