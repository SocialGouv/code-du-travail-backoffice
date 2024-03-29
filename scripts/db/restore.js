require("colors");
const path = require("path");
const shell = require("shelljs");

const { NODE_ENV, POSTGRES_DB, POSTGRES_USER } = process.env;

if (process.argv[2] === undefined) {
  shell.echo(
    `[script/db/restore.js] Error: You must give the dump file name (YYYY_MM_DD) in non-dev mode.`
      .red,
  );

  shell.exit(1);
}

const DOCKER_COMPOSE_SERVICE_NAME = "db";
const DOCKER_CONTAINER_NAME = "cdtn_backoffice_db";

if (!shell.which("docker")) {
  shell.echo("[script/db/restore.js] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/db/restore.js] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);

  return output;
}

try {
  const backupFileName = process.argv[2];
  const backupPath = path.join(__dirname, `../../backups/${backupFileName}.sql`);
  const isProduction = NODE_ENV === "production";

  run(`docker-compose down -v`);
  if (isProduction) {
    run(`docker-compose up -d ${DOCKER_COMPOSE_SERVICE_NAME}`);
  } else {
    run(
      `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d ${DOCKER_COMPOSE_SERVICE_NAME}`,
    );
  }
  // https://stackoverflow.com/a/63011266/2736233
  run(
    `timeout 90s bash -c "until docker exec ${DOCKER_CONTAINER_NAME} pg_isready ; do sleep 5 ; done"`,
  );

  run(
    `cat ${backupPath} | docker exec -i ${DOCKER_CONTAINER_NAME} psql -d ${POSTGRES_DB} -U ${POSTGRES_USER}`,
  );

  shell.echo(`[script/db/restore.js] The database has now been restored.`.green);
  run(`docker-compose ps`);
} catch (err) {
  shell.echo(`[script/db/restore.js] Error: ${err}`.red);
  console.error(err);

  shell.exit(1);
}
