require("colors");
const dotenv = require("dotenv");
const moment = require("moment");
const shell = require("shelljs");

dotenv.config({ path: `${__dirname}/../../.env` });
const { POSTGRES_DB, POSTGRES_KINTO_DB, POSTGRES_USER } = process.env;

const NOW = moment().format("YYYYMMDDHHmmss");

const BACKUPS_DIRECTORY = "./backups";
const DOCKER_COMPOSE_DB_SERVICE_NAME = "db";
const POSTGRESQL_MAIN_DB_FILENAME = `${NOW}_${POSTGRES_DB}.dump`;
const POSTGRESQL_KINTO_DB_FILENAME = `${NOW}_${POSTGRES_KINTO_DB}.dump`;

if (!shell.which("docker")) {
  shell.echo("Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

try {
  shell.exec(
    `docker-compose exec -T ${DOCKER_COMPOSE_DB_SERVICE_NAME} pg_dump -U ${POSTGRES_USER} -Fc ${POSTGRES_DB} -f /${POSTGRESQL_MAIN_DB_FILENAME}`
  );
  shell.exec(
    `docker-compose exec -T ${DOCKER_COMPOSE_DB_SERVICE_NAME} pg_dump -U ${POSTGRES_USER} -Fc ${POSTGRES_KINTO_DB} -f /${POSTGRESQL_KINTO_DB_FILENAME}`
  );
  const output = shell.exec(`docker-compose ps -q ${DOCKER_COMPOSE_DB_SERVICE_NAME}`);
  const dockerDbContainerId = output.stdout.trim();
  shell.exec(
    `docker cp ${dockerDbContainerId}:/${POSTGRESQL_MAIN_DB_FILENAME} ${BACKUPS_DIRECTORY}`
  );
  shell.exec(
    `docker cp ${dockerDbContainerId}:/${POSTGRESQL_KINTO_DB_FILENAME} ${BACKUPS_DIRECTORY}`
  );
  shell.exec(
    `docker-compose exec -T ${DOCKER_COMPOSE_DB_SERVICE_NAME} rm /${POSTGRESQL_MAIN_DB_FILENAME}`
  );
  shell.exec(
    `docker-compose exec -T ${DOCKER_COMPOSE_DB_SERVICE_NAME} rm /${POSTGRESQL_KINTO_DB_FILENAME}`
  );
} catch (err) {
  shell.echo(`[script/db/backup] Error: ${err.message}`.red);

  shell.exit(1);
}
