exports.seed = async knex => {
  global.spinner.start(`Generating users...`);

  const locationIds = await knex("api.locations")
    .select("id")
    .map(({ id }) => id);

  global.users = [
    {
      email: "doris@sea.com",
      id: "00000000-0000-4000-8000-000000000401",
      location_id: locationIds[0],
      name: "Doris L'Administratrice",
      password: "Azerty123",
      role: "administrator",
    },
    {
      email: "nemo@sea.com",
      id: "00000000-0000-4000-8000-000000000402",
      location_id: locationIds[1],
      name: "Nemo Le Contributeur",
      password: "Azerty123",
      role: "contributor",
    },
    {
      email: "astrid@sea.com",
      id: "00000000-0000-4000-8000-000000000403",
      location_id: locationIds[2],
      name: "Astrid La Contributrice",
      password: "Azerty123",
      role: "contributor",
    },
    {
      email: "marin@sea.com",
      id: "00000000-0000-4000-8000-000000000404",
      location_id: locationIds[3],
      name: "Marin Le Contributeur",
      password: "Azerty123",
      role: "contributor",
    },
    {
      email: "deb@sea.com",
      id: "00000000-0000-4000-8000-000000000405",
      location_id: locationIds[3],
      name: "Deb L'Administratrice Régionale",
      password: "Azerty123",
      role: "regional_administrator",
    },
  ];

  await knex("auth.users").insert(global.users);

  await knex("users_agreements").insert(
    (await knex("api.agreements").limit(3)).map(({ id: agreement_id }) => ({
      agreement_id,
      user_id: "00000000-0000-4000-8000-000000000402",
    })),
  );
  await knex("users_agreements").insert(
    (await knex("api.agreements").limit(3)).map(({ id: agreement_id }) => ({
      agreement_id,
      user_id: "00000000-0000-4000-8000-000000000403",
    })),
  );
  await knex("users_agreements").insert(
    (await knex("api.agreements").limit(2).offset(3)).map(({ id: agreement_id }) => ({
      agreement_id,
      user_id: "00000000-0000-4000-8000-000000000404",
    })),
  );

  global.spinner.succeed(`Users generated.`);
};
