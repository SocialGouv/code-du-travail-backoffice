const ACTIONS = ["delete", "patch", "post"];

function getRandomIntBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIp() {
  return Array.from({ length: 4 }, () => getRandomIntBetween(0, 255)).join(".");
}

function getRandomLog() {
  const created_at = new Date(Date.now() - getRandomIntBetween(0, 30 * 24 * 60 * 60 * 1000));
  const ip = getRandomIp();
  const method = ACTIONS[getRandomIntBetween(0, 2)];
  const path = "/dummy-path";
  const user_id = `00000000-0000-4000-8000-00000000040${getRandomIntBetween(1, 5)}`;

  return {
    created_at,
    ip,
    method,
    path,
    user_id,
  };
}

exports.seed = async knex => {
  global.spinner.start(`Generating logs...`);

  const logs = Array.from({ length: 100 }, getRandomLog);

  await knex("public.logs").insert(logs);

  global.spinner.succeed(`Logs generated.`);
};
