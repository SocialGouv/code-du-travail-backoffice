const knexConfig = require("../../knexfile.js").development;

const csvParse = require("csv-parse");
const fs = require("fs");
const knex = require("knex")(knexConfig);
const ora = require('ora')
const path = require("path");

function waitFor(timeInMs) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}

const spinner = ora();

class Script {
  constructor() {
    this.isReading = true;

    this.initParser();
  }

  async checkDatabaseConsistency() {
    spinner.start(`Checking data consistency...`);

    try {
      const agreementsRes = await knex("api.agreements").count('id');
      const answersRes = await knex("api.answers").count('id');
      const questionsRes = await knex("api.questions").count('id');

      const agreementsCount = Number(agreementsRes[0].count);
      const answersCount = Number(answersRes[0].count);
      const questionsCount = Number(questionsRes[0].count);

      if (answersCount !== agreementsCount * questionsCount) {
        spinner.fail(`Data is inconsistent.`);
        await this.repairMissingAnswers();

        return;
      }

      spinner.succeed(`Data consistency checked.`);
    } catch (err) {
      spinner.fail(`Data consistency checking failed.`);
      console.log(err.message);

      process.exit(-1);
    }
  }

  async repairMissingAnswers() {
    spinner.start(`Repairing missing answers...`);

    try {
      const questions = await knex('api.questions').orderBy('index');
      const agreements = await knex('api.agreements').orderBy('idcc');

      for (let question of questions) {
        for (let agreement of agreements) {
          spinner.start(`Generating answers: ${question.index}) ${question.value} => ${agreement.idcc}`);

          const answer = {
            agreement_id: agreement.id,
            question_id: question.id
          }

          const foundAnswers = await knex('api.answers').where(answer);

          if (foundAnswers.length === 0) {
            await knex('api.answers').insert({
              ...answer,
              value: ""
            })
          }
        }
      }

      spinner.succeed(`Missing answers repaired.`);

      await this.checkDatabaseConsistency();
    } catch (err) {
      spinner.fail(`Missing answers repairing failed.`);
      console.log(err.message);

      process.exit(-1);
    }
  }

  /**
   * @see https://csv.js.org/parse/api/
   */
  initParser() {
    spinner.start(`Initializing CSV parser...`);

    try {
      this.csvParser = csvParse();

      this.csvParser.on('readable', async () => {
        if (!this.isReading) return;

        spinner.succeed(`CSV data parsed.`);

        spinner.start(`Importing CSV data...`);

        let isFirst = true;
        let record;

        while (record = this.csvParser.read()) {
          if (isFirst) {
            isFirst = false;

            continue;
          }

          try {
            /*
              [0] Email du contributeur ou du service
              [1] question clean
              [2] index clean
              [3] Réponse à la question de l'usager
              [4] Liste des articles et textes juridiques de référence
              [5] Spécifiez ici la convention collective ou son IDCC
              [6] Catégories de salariés dans la branche
              [7] Coefficient de classification de la convention collective (si connu et nécessaire)
              [8] Listez ici les thèmes de la question
              [9] Types de contrat
              [10] La réponse s'adresse à
              [11] Travailleurs particuliers
              [12] Particularisme- droit spécifique
              [13] Durée du travail
              [14] Type d'horaire
              [15] Informations complémentaires à ajouter
            */

            const agreementIdcc = record[5].match(/\d+/)[0].padStart(4, "0");
            const questionIndex = Number(record[2]);
            const userEmail = record[0];

            const agreement = (
              await knex("api.agreements").where({ idcc: agreementIdcc })
            )[0];
            const question = (
              await knex("api.questions").where({ index: questionIndex })
            )[0];
            const tags = await knex("api.tags");
            const user = (
              await knex("auth.users").where({ email: userEmail })
            )[0];

            const answer = (
              await knex("api.answers").where({
                agreement_id: agreement.id,
                question_id: question.id
              })
            )[0];

            const value = record[3]
              .trim()
              .replace(/\n[-—‣•)[\n\s\t]*/g, "\n_LI_")
              .replace(/\s*\n{2,}/g, "_P_")
              .replace(/\s*\n/g, "_BR_")
              .replace(/\s{2,}/g, " ")
              .replace(/_BR__LI_/g, "_P__LI_")
              .replace(/_P_/g, "\n\n")
              .replace(/_BR_/g, "<br>\n")
              .replace(/_LI_/g, "* ")
            ;

            const newAnswer = {
              state: "draft",
              value,
              user_id: user.id
            };

            const rawTags = [
              ...record.slice(6, 7),
              ...record.slice(8, 15)
            ]
              .map(tagGroup => tagGroup.replace(/ et/, ","))
              .map(tagGroup => tagGroup.replace(/^Les coefficients sont précisés dans le corps de la réponse.$/, ""))
              .map(tagGroup => tagGroup.replace(/^Information non pertinente à demander$/, ""))
              .map(tagGroup => tagGroup.replace(/^Aucune$/, ""))
              .map(tagGroup => tagGroup.replace(/^non$/, ""))
              .map(tagGroup => tagGroup.replace(/^La période d'essai$/, "Période d'essai"))
              .map(tagGroup => tagGroup.replace(/^Les 2 indifféremment$/, "Employeur, Salarié"))
              .map(tagGroup => tagGroup.replace(/^Tout type de contrat$/, "CDD, CDI"))
              .map(tagGroup => tagGroup.replace(/CADRE/, "Cadre"))
              .map(tagGroup => tagGroup.replace(/OUVRIER/, "Ouvrier"))
              .filter(tagGroup => tagGroup.length !== 0)
              .join(", ")
              .split(", ")
              .map(tag => tag[0].toLocaleUpperCase() + tag.slice(1))
            ;

            if (answer === undefined)
              throw new Error(`Answer not found: (question_id: ${question.id}, agreement_id: ${agreement.id})`);

            await knex("api.answers")
              .where({ id: answer.id, })
              .update(newAnswer);

            for (let rawTag of rawTags) {
              const foundTags = tags.filter(tag => tag.value === rawTag);

              if (foundTags.length === 0) continue;

              const answerTag = {
                answer_id: answer.id,
                tag_id: foundTags[0].id
              };

              if (
                (await knex("api.answers_tags").where(answerTag)).length !== 0
              ) {
                continue;
              }

              await knex("api.answers_tags").insert(answerTag);
            }
          } catch (err) {
            console.log(err.message);
          }
        }

        this.isReading = false;
        spinner.succeed(`CSV data imported.`);
        this.csvParser.end();
      });

      this.csvParser.on('error', err => {
        spinner.fail(`CSV data parsing failed.`);
        console.error(err.message);

        process.exit(-1);
      });

      this.csvParser.on('end', () => {
        console.log("Done.");
      });

      spinner.succeed(`CSV parser initialized.`);
    } catch (err) {
      spinner.fail(`CSV parser initialization failed.`);
      console.log(err.message);
      this.isReading = false;

      process.exit(-1);
    }
  }

  async run() {
    try {
      await this.checkDatabaseConsistency();

      spinner.start(`Reading CSV file...`);

      const csvFilePath = path.resolve(process.cwd(), process.argv[2]);
      const csvFileSource = fs.readFileSync(csvFilePath, "utf8");

      spinner.succeed(`CSV file read.`);

      this.csvParser.write(csvFileSource);

      while (this.isReading) {
        await waitFor(250);
      }

      this.csvParser.end();
      process.exit(0);
    } catch (err) {
      spinner.fail(`CSV file reading failed.`);
      console.log(err.message);
    }
  }
}

const script = new Script();

script.run();
