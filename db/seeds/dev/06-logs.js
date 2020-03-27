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
  const ip = getRandomIp();
  const action = ACTIONS[getRandomIntBetween(0, 2)];
  const url = "/path";
  const created_at = new Date(Date.now() - getRandomIntBetween(0, 30 * 24 * 60 * 60 * 1000));
  const user_id = `00000000-0000-4000-8000-00000000040${getRandomIntBetween(1, 5)}`;

  return {
    action,
    created_at,
    ip,
    url,
    user_id,
  };
}

exports.seed = async knex => {
  global.spinner.start(`Generating logs...`);

  const logs = Array.from({ length: 1000 }, getRandomLog);

  await knex("api.logs").insert(logs);

  global.spinner.succeed(`Logs generated.`);
};
