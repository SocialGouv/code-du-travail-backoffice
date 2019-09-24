exports.seed = async knex => {
  global.spinner.start(`Generating agreements...`);

  const agreements = [
    { idcc: "0001", zones: [], name: `Première convention collective` },
    { idcc: "0002", zones: [], name: `Deuxième convention collective` },
    { idcc: "0003", zones: [], name: `Troisième convention collective` },
    { idcc: "0004", zones: [], name: `Quatrième convention collective` },
    { idcc: "0005", zones: [], name: `Cinquième convention collective` },
    { idcc: "0006", zones: [], name: `Sixième convention collective` },
    { idcc: "0007", zones: [], name: `Septième convention collective` },
    { idcc: "0008", zones: [], name: `Huitième convention collective` },
    { idcc: "0009", zones: [], name: `Neuvième convention collective` },
    { idcc: "0010", zones: [], name: `Dixième convention collective` },
    { idcc: "0011", zones: [], name: `Onzième convention collective` },
    { idcc: "0012", zones: [], name: `Douzième convention collective` },
    { idcc: "0013", zones: [], name: `Treizième convention collective` },
    { idcc: "0014", zones: [], name: `Quatorzième convention collective` },
    { idcc: "0015", zones: [], name: `Quinzième convention collective` },
    { idcc: "0016", zones: [], name: `Seizième convention collective` },
    { idcc: "0017", zones: [], name: `Dix-septième convention collective` },
    { idcc: "0018", zones: [], name: `Dix-huitième convention collective` },
    { idcc: "0019", zones: [], name: `Dix-neuvième convention collective` },
    { idcc: "0020", zones: [], name: `Vingtième convention collective` }
  ];

  await knex("api.agreements").insert(
    agreements.map(({ idcc, name }) => ({ idcc, name }))
  );

  for (let agreement of agreements) {
    if (agreement.zones === undefined || agreement.zones.length === 0) continue;

    const agreementRes = await knex("api.agreements").where({
      idcc: agreement.idcc
    });
    const zoneRes = await knex("api.zones").whereIn("code", agreement.zones);

    for (let zone of zoneRes) {
      await knex("api.agreements_zones").insert({
        agreement_id: agreementRes[0].id,
        zone_id: zone.id
      });
    }
  }

  global.spinner.succeed(`Agreements generated.`);
};
