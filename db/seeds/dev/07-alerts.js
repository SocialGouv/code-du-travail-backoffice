const ora = require("ora");
const postgrester = require("postgrester");

global.postgresterClient = postgrester.create({
  axiosConfig: {
    baseURL: "https://contributions-api.codedutravail.fabrique.social.gouv.fr",
  },
});

global.spinner = ora();

const DumDum = require("dumdum");

const AGREEMENTS = [
  { dila_container_id: "KALICONT000005635624", idcc: "0016" },
  { dila_container_id: "KALICONT000005635184", idcc: "0176" },
  { dila_container_id: "KALICONT000005635872", idcc: "0275" },
  { dila_container_id: "KALICONT000005635918", idcc: "1672" },
  { dila_container_id: "KALICONT000027172335", idcc: "3043" },
];
const VERSIONS = ["1.2.3", "4.5.6", "7.8.9"];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDilaId() {
  return `KALIARTI9999${getRandomIntInclusive(10000000, 99999999)}`;
}

function getRandomAgreementIdcc() {
  return AGREEMENTS[Math.floor(Math.random() * AGREEMENTS.length)].idcc;
}

exports.seed = async knex => {
  global.spinner.start(`Generating alerts...`);

  const dumdum = DumDum.create({ locale: "fr" });
  const alerts = [];
  let counter = 10;
  while (--counter > 0) {
    const agreementIdcc = getRandomAgreementIdcc();
    const agreements = await knex("api.agreements").where({ idcc: agreementIdcc });
    const agreement = agreements[0];
    const answers = await knex("api.answers").where({ agreement_id: agreement.id });
    const version = VERSIONS[Math.floor(Math.random() * VERSIONS.length)];

    for (const answer of answers) {
      const answerReferences = await knex("api.answers_references").where({
        answer_id: answer.id,
        category: "agreement",
      });
      if (answerReferences.length === 0) {
        continue;
      }
      const answerReference = answerReferences[0];

      alerts.push({
        answer_id: answer.id,
        dila_cid: answerReference.dila_cid,
        dila_container_id: answerReference.dila_container_id,
        dila_id: getRandomDilaId(),
        value: {
          etat: { current: "Current State", previous: "Previous State" },
          texts: [
            { current: dumdum.text(620), previous: dumdum.text(620) },
            { current: dumdum.text(620), previous: dumdum.text(620) },
          ],
        },
        version,
      });
    }
  }

  await knex("api.alerts").insert(alerts);

  global.spinner.succeed(`Alerts generated.`);
};
