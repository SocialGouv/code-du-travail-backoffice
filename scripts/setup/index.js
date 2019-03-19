const crypto = require("crypto");
const dotenv = require("dotenv");
const fs = require("fs");
const ora = require("ora");
const { promisify } = require("util");

const migrateDb = require("./migrateDb");
const seedDb = require("./seedDb");
const runDockerCompose = require("./runDockerCompose");

const ROOT = `${__dirname}/../..`;
const envPath = `${ROOT}/.env`;
const sampleEnvPath = `${ROOT}/.env.sample`;

const randomBytesP = promisify(crypto.randomBytes);
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

const spinner = ora();

function waitFor(timeInMs) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}

async function generateRandomHexString(length, onlyLetters) {
  const res = (await randomBytesP(length)).toString("base64");

  return Boolean(onlyLetters) ? res.replace(/[^a-z]/gi, "") : res;
}

async function install() {
  // Copy and fill .env file (if it doesn't already exist)
  if (!fs.existsSync(envPath)) {
    spinner.start(`Generating .env file...`);

    const sampleEnvBuffer = await readFileP(sampleEnvPath);
    const sampleEnvConfig = dotenv.parse(sampleEnvBuffer);

    const API_URI = process.env.API_URI !== undefined
      ? process.env.API_URI
      : "http://localhost:3200";
    const POSTGRES_DB = (await generateRandomHexString(10, true))
      .toLowerCase();
    const POSTGRES_USER = (await generateRandomHexString(18, true))
      .toLowerCase();
    const POSTGRES_PASSWORD = (await generateRandomHexString(32))
      .replace(/[^0-9a-z]/gi, "");
    const PGRST_DB_URI =
      `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${sampleEnvConfig.DB_PORT}/${POSTGRES_DB}`;

    const PGRST_JWT_SECRET = await generateRandomHexString(32);

    const envConfig = {
      ...sampleEnvConfig,
      API_URI,
      POSTGRES_DB,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      PGRST_JWT_SECRET,
      PGRST_DB_URI
    };
    const envSource = Object.entries(envConfig).reduce(
      (acc, kvPair) => `${acc}${kvPair[0]}=${kvPair[1]}\n`,
      ""
    );
    await writeFileP(envPath, envSource);

    spinner.succeed(`Local .env file generated.`);
  }

  if (process.argv[2] === "--env-only") return

  // Start Docker Compose
  spinner.start(`Starting a new "db" container...`);
  await runDockerCompose("up", "db", () => {
    spinner.succeed(`The "db" container is stopped.`);

    process.exit(0);
  });
  spinner.succeed(`The "db" container is up and runnning.`);

  await waitFor(1000);

  // Migrate PostgreSQL structure
  spinner.start(`Migrating PostgreSQL structure...`);
  await migrateDb(ROOT);
  spinner.succeed(`PostgreSQL structure migrated.`);

  // Seed PostgreSQL database
  spinner.start(`Seeding PostgreSQL database...`);
  await seedDb(ROOT);
  spinner.succeed(`PostgreSQL database seeded.`);

  spinner.start(`Stopping "db" container...`);
  runDockerCompose("stop", "db");
}

install();
