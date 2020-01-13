require("colors");
const dotenv = require("dotenv");
const moment = require("moment");
const shell = require("shelljs");

dotenv.config({ path: `${__dirname}/../../.env` });
const { POSTGRES_DB, POSTGRES_KINTO_DB, POSTGRES_USER } = process.env;

const NOW = process.argv[2] === "--dev" ? "snapshot" : moment().format("YYYYMMDDHHmmss");

const BACKUPS_DIRECTORY = process.argv[2] === "--dev" ? "./db" : "./backups";
const DB_SERVICE_NAME = "db";
const MAIN_DB_FILENAME = `${NOW}_${POSTGRES_DB}.dump`;
const KINTO_DB_FILENAME = `${NOW}_${POSTGRES_KINTO_DB}.dump`;

if (!shell.which("docker")) {
  shell.echo("[script/db/backup] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/db/backup] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

try {
  shell.exec(
    `docker-compose exec -T ${DB_SERVICE_NAME} pg_dump -cC -Fc --if-exists -f /${MAIN_DB_FILENAME} -U ${POSTGRES_USER} ${POSTGRES_DB}`
  );
  shell.exec(
    `docker-compose exec -T ${DB_SERVICE_NAME} pg_dump -cC -Fc --if-exists -f /${KINTO_DB_FILENAME} -U ${POSTGRES_USER} ${POSTGRES_KINTO_DB}`
  );
  const output = shell.exec(`docker-compose ps -q ${DB_SERVICE_NAME}`);
  const dockerDbContainerId = output.stdout.trim();
  shell.exec(`docker cp ${dockerDbContainerId}:/${MAIN_DB_FILENAME} ${BACKUPS_DIRECTORY}`);
  shell.exec(`docker cp ${dockerDbContainerId}:/${KINTO_DB_FILENAME} ${BACKUPS_DIRECTORY}`);
  shell.exec(`docker-compose exec -T ${DB_SERVICE_NAME} rm /${MAIN_DB_FILENAME}`);
  shell.exec(`docker-compose exec -T ${DB_SERVICE_NAME} rm /${KINTO_DB_FILENAME}`);
} catch (err) {
  shell.echo(`[script/db/backup] Error: ${err.message}`.red);

  shell.exit(1);
}
