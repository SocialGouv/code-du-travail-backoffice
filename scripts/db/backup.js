require("colors");
const dayjs = require("dayjs");
const path = require("path");
const shell = require("shelljs");

const { NODE_ENV, POSTGRES_USER } = process.env;

const DOCKER_COMPOSE_SERVICE_NAME = "db";
const DOCKER_CONTAINER_NAME = "cdtn_backoffice_db";

if (!shell.which("docker")) {
  shell.echo("[script/db/backup] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/db/backup] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);

  return output;
}

try {
  const backupFileName = dayjs().format("YYYY_MM_DD");
  const backupPath = path.join(__dirname, `../../backups/${backupFileName}.sql`);
  const isProduction = NODE_ENV === "production";

  if (isProduction) {
    run(`docker-compose up -d ${DOCKER_COMPOSE_SERVICE_NAME}`);
  } else {
    run(
      `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d ${DOCKER_COMPOSE_SERVICE_NAME}`,
    );
  }
  // https://stackoverflow.com/a/63011266/2736233
  run(
    `timeout 90s bash -c "until docker exec ${DOCKER_CONTAINER_NAME} pg_isready ; do sleep 1 ; done"`,
  );

  run(`docker exec -t ${DOCKER_CONTAINER_NAME} pg_dumpall -c -U ${POSTGRES_USER} > ${backupPath}`);
} catch (err) {
  shell.echo(`[script/db/backup] Error: ${err}`.red);
  console.error(err);

  shell.exit(1);
}
