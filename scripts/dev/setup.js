require("colors");
const fs = require("fs");
const shell = require("shelljs");

const { NODE_ENV } = process.env;
const DOCKER_CONTAINER_NAME = "cdtn_backoffice_db";

if (NODE_ENV === "production") {
  shell.echo(
    "[script/dev/setup] Error: You can't run this script in a production environment!.".red,
  );

  shell.exit(1);
}
if (!shell.which("docker")) {
  shell.echo("[script/dev/setup] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/dev/setup] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);
}

(async () => {
  try {
    fs.appendFileSync(".env", "\nNODE_ENV=development\n");
    run(`lerna link`);
    run(`docker-compose down --remove-orphans -v`);
    run(`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`);
    shell.echo(`Waiting for db to be up and ready…`.blue);
    // https://stackoverflow.com/a/63011266/2736233
    run(
      `timeout 90s bash -c "until docker exec ${DOCKER_CONTAINER_NAME} pg_isready ; do sleep 5 ; done"`,
    );
    run(`yarn db:snapshot:restore`);

    run(`yarn dev:docker`);
    run(`docker-compose stop`);
    shell.exit(0);
  } catch (err) {
    shell.echo(`[script/dev/setup] Error: ${err.message}`.red);

    shell.exit(1);
  }
})();
