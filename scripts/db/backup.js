require("colors");
const shell = require("shelljs");

const { POSTGRES_DB, POSTGRES_USER } = process.env;

const NOW = process.argv[2] === "--dev" ? "snapshot" : new Date().toISOString();

const BACKUPS_DIRECTORY = process.argv[2] === "--dev" ? "./db" : "./backups";
const DB_SERVICE_NAME = "db";
const MAIN_DB_FILENAME = `${NOW}_${POSTGRES_DB}.dump`;

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
  run(
    `docker-compose exec -T ${DB_SERVICE_NAME} pg_dump -cC -Fc --if-exists -f /${MAIN_DB_FILENAME} -U ${POSTGRES_USER} ${POSTGRES_DB}`,
  );
  const output = run(`docker-compose ps -q ${DB_SERVICE_NAME}`);
  const dockerDbContainerId = output.stdout.trim();
  run(`docker cp ${dockerDbContainerId}:/${MAIN_DB_FILENAME} ${BACKUPS_DIRECTORY}`);
  run(`docker-compose exec -T ${DB_SERVICE_NAME} rm /${MAIN_DB_FILENAME}`);
} catch (err) {
  shell.echo(`[script/db/backup] Error: ${err.message}`.red);

  shell.exit(1);
}
