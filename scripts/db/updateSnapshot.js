require("colors");
const Jabber = require("jabber");
const knex = require("knex");
const path = require("path");
const shell = require("shelljs");

const { DEV_DB_PORT, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;
const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;
const DOCKER_COMPOSE_SERVICE_NAME = "db";
const DOCKER_CONTAINER_NAME = "cdtn_backoffice_db";

if (process.argv[2] === undefined) {
  shell.echo(
    `[script/db/updateSnapshot.js] Error: You must give the dump file name (YYYY_MM_DD).`.red,
  );

  shell.exit(1);
}

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);

  return output;
}

(async () => {
  try {
    const backupPath = path.join(__dirname, `../../backups/${process.argv[2]}.sql`);

    run(`docker-compose down -v`);
    run(
      `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d ${DOCKER_COMPOSE_SERVICE_NAME}`,
    );
    // https://stackoverflow.com/a/63011266/2736233
    run(
      `timeout 90s bash -c "until docker exec ${DOCKER_CONTAINER_NAME} pg_isready ; do sleep 5 ; done"`,
    );

    run(
      `cat ${backupPath} | docker exec -i ${DOCKER_CONTAINER_NAME} psql -d ${POSTGRES_DB} -U ${POSTGRES_USER}`,
    );

    const jabber = new Jabber();
    const knexClient = knex({
      client: "postgresql",
      connection: DATABASE_URL,
    });

    const userIds = (await knexClient("auth.users").select("id")).map(({ id }) => id);
    for (const userId of userIds) {
      await knexClient("auth.users")
        .where({
          id: userId,
        })
        .update({
          email: jabber.createEmail(),
          name: jabber.createFullName(),
          password: "Azerty123",
        });
    }

    const locationIds = (await knexClient("api.locations").select("id")).map(({ id }) => id);
    const devUsers = [
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
    ];
    await knexClient("auth.users").insert(devUsers);

    run(`yarn db:backup --dev`);

    shell.exit();
  } catch (err) {
    shell.echo(`[script/db/updateSnapshot.js] Error: ${err}`.red);
    console.error(err);

    shell.exit(1);
  }
})();
