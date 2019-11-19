// from google docs TSV
// raw.split("\n").map(row => row.split('\t')).map(row => [row[0], row[1], row[3], row[5], row[7]])

const fs = require("fs");
const btoa = require("btoa");
const fetch = require("node-fetch");

// queries from TU
const data = [
  [
    "rupture conventionnelle",
    "/fiche-service-public/rupture-conventionnelle",
    "",
    "",
    ""
  ],
  [
    "rupture conventionnelle individuelle",
    "/fiche-service-public/rupture-conventionnelle",
    "",
    "",
    ""
  ],
  [
    "rupture conventionnelle individuelle indemnité de rupture",
    "/fiche-ministere-travail/la-rupture-conventionnelle-du-contrat-de-travail-a-duree-indeterminee-quelles-sont-les-indemnites-dues-au-salarie",
    "/fiche-service-public/rupture-conventionnelle",
    "https://www.telerc.travail.gouv.fr/RuptureConventionnellePortailPublic/jsp/site/Portal.jsp?page_id=14",
    ""
  ],
  [
    "rupture conventionnelle collective",
    "/fiche-service-public/rupture-conventionnelle-dun-cdi",
    "",
    "",
    ""
  ],
  [
    "rupture conventionnelle collective comment le contester ?",
    "/code-du-travail/article-l1237-19-8",
    "",
    "",
    ""
  ],
  [
    "lettre de demission",
    "/fiche-ministere-travail/la-demission-comment-presenter-une-demission",
    "/fiche-service-public/demission-dun-salarie",
    "/fiche-service-public/abandon-de-poste-quelles-sont-les-regles-dans-le-secteur-prive",
    ""
  ],
  [
    "inspection du travail",
    "/fiche-ministere-travail/linspection-du-travail-quels-sont-les-droits-et-obligations-des-agents-de-linspection-du-travail",
    "",
    "",
    ""
  ],
  ["cheque vacances", "/code-du-travail/article-l3263-1", "", "", ""],
  [
    "contrat de professionnalisation",
    "/fiche-service-public/contrat-de-professionnalisation",
    "/fiche-service-public/contrat-de-professionnalisation-ou-apprentissage-quelles-differences",
    "/fiche-ministere-travail/le-contrat-de-professionnalisation-quels-contrats-et-conditions-de-travail-du-contrat-de-professionnalisation",
    "/fiche-ministere-travail/le-contrat-de-professionnalisation-quelles-demarches-pour-formaliser-un-contrat-de-professionnalisation"
  ],
  ["CDI", "/fiche-ministere-travail/quel-est-le-contenu-du-cdi", "", "", ""],
  [
    "dpae",
    "/fiche-ministere-travail/les-obligations-de-lemployeur-lors-de-lembauche-quest-ce-que-la-declaration-prealable-a-lembauche",
    "/fiche-ministere-travail/les-obligations-de-lemployeur-lors-de-lembauche-quels-sont-les-documents-a-remettre-au-salarie",
    "",
    ""
  ],
  [
    "cpf",
    "/fiche-service-public/compte-personnel-de-formation-cpf",
    "",
    "",
    ""
  ],
  [
    "chsct",
    "/fiche-service-public/comite-dhygiene-de-securite-et-des-conditions-de-travail-chsct",
    "",
    "",
    ""
  ],
  [
    "vae",
    "/fiche-ministere-travail/vae-a-quoi-ca-sert-et-pour-quelle-reconnaissance",
    "",
    "",
    ""
  ],
  [
    "kbis",
    "/fiche-service-public/comment-se-procurer-un-extrait-k-ou-kbis",
    "",
    "",
    ""
  ],
  [
    "abandon de poste",
    "/fiche-service-public/abandon-de-poste-quelles-sont-les-regles-dans-le-secteur-prive",
    "/fiche-service-public/demission-dun-salarie",
    "",
    ""
  ],
  [
    "congé parental",
    "/fiche-service-public/conge-parental-deducation-a-temps-plein-dans-le-secteur-prive",
    "/fiche-ministere-travail/le-conge-parental-deducation-comment-prendre-le-conge-parental",
    "",
    ""
  ],
  [
    "compte personnel de formation",
    "/fiche-service-public/compte-personnel-de-formation-cpf",
    "",
    "",
    ""
  ],
  [
    "solde de tout compte",
    "/fiche-service-public/solde-de-tout-compte",
    "https://www.service-public.fr/particuliers/vosdroits/F2413",
    "/code-du-travail/article-l1234-20",
    "/fiche-service-public/quels-sont-les-documents-remis-au-salarie-a-la-fin-de-son-contrat"
  ],
  [
    "licenciement économique conditions",
    "/fiche-service-public/licenciement-economique-les-obligations-de-lemployeu",
    "/fiche-service-public/licenciement-economique-information-et-consultation-obligatoires",
    "/fiche-service-public/licenciement-economique-nul-injustifie-ou-irregulier",
    ""
  ],
  ["congés payés", "/fiche-service-public/conges-payes", "", "", ""],
  [
    "epargne salariale",
    "https://www.service-public.fr/particuliers/vosdroits/N517",
    "/code-du-travail/article-l3332-1",
    "",
    ""
  ],
  [
    "harcèlement moral",
    "/fiche-ministere-travail/le-harcelement-moral-quels-recours",
    "/code-du-travail/article-l1152-1",
    "/fiche-ministere-travail/le-harcelement-moral-qui-organise-la-prevention-en-matiere-de-harcelement-moral",
    "/fiche-ministere-travail/le-harcelement-moral-quelles-sanctions-a-lencontre-de-lauteur-de-harcelement-moral"
  ],
  [
    "certificat de travail",
    "/fiche-service-public/certificat-de-travail",
    "/fiche-ministere-travail/les-documents-remis-aux-salaries-lors-de-la-rupture-du-contrat-de-travail-quand-delivrer-le-certificat-de-travail",
    "/modeles_de_courriers/modele-de-certificat-de-travail",
    ""
  ],
  [
    "demission cdi chomage",
    "/fiche-service-public/peut-on-percevoir-lallocation-chomage-en-cas-de-demission",
    "/fiche-ministere-travail/le-droit-aux-allocations-chomage-du-salarie-demissionnaire-quelles-sont-les-demissions-considerees-comme-legitimes",
    "/fiche-service-public/demission-dun-salarie",
    ""
  ],
  [
    "ai je droit à l'allocation chômage en cas de rupture conventionnelle",
    "/fiche-service-public/peut-on-percevoir-lallocation-chomage-en-cas-de-demission",
    "",
    "",
    ""
  ],
  [
    "licenciement pour faute grave",
    "/fiche-service-public/faute-simple-grave-ou-lourde-quelles-differences-pour-le-salarie-licencie",
    "/fiche-service-public/indemnite-de-licenciement",
    "/fiche-service-public/procedure-de-licenciement-pour-motif-personnel",
    ""
  ],
  [
    "calcul indemnité rupture conventionnelle",
    "https://www.telerc.travail.gouv.fr/RuptureConventionnellePortailPublic/jsp/site/Portal.jsp?page_id=14",
    "/fiche-ministere-travail/la-rupture-conventionnelle-du-contrat-de-travail-a-duree-indeterminee-quelles-sont-les-indemnites-dues-au-salarie",
    "/code-du-travail/article-l1237-19-1",
    ""
  ],
  [
    "contrat de professionnalisation salaire",
    "/fiche-ministere-travail/le-contrat-de-professionnalisation-remuneration",
    "",
    "",
    ""
  ],
  [
    "formulaire accident du travail",
    "https://www.service-public.fr/particuliers/vosdroits/R14587",
    "",
    "",
    ""
  ],
  [
    "combien est on payé en accident de travail",
    "/fiche-service-public/accident-du-travail-indemnites-journalieres-pendant-larret-de-travail",
    "",
    "",
    ""
  ],
  [
    "licenciement économique",
    "/fiche-service-public/quest-ce-quun-licenciement-pour-motif-economique",
    "/fiche-service-public/licenciement-economique-les-obligations-de-lemployeur",
    "",
    ""
  ],
  [
    "convention collective",
    "/fiche-service-public/convention-collective",
    "/fiche-service-public/comment-consulter-une-convention-collective",
    "",
    ""
  ],
  [
    "congé maternité",
    "/fiche-service-public/conge-de-maternite-dune-salariee-du-secteur-prive",
    "/fiche-ministere-travail/le-conge-de-maternite-quelle-est-la-duree-du-conge-de-maternite",
    "/fiche-service-public/licenciement-dune-salariee-enceinte-ou-en-conge-de-maternite",
    ""
  ],
  [
    "indemnité licenciemenet inaptitude professionnelle",
    "/outils/indemnite-licenciement",
    "/fiche-service-public/percoit-on-des-indemnites-en-cas-de-licenciement-pour-inaptitude-physique",
    "",
    ""
  ],
  [
    "refus congés payés",
    "/fiche-service-public/conges-payes",
    "/fiche-service-public/un-employeur-peut-il-refuser-des-conges-demandes-par-le-salarie",
    "/modeles_de_courriers/reclamation-conges-payes",
    ""
  ],
  [
    "congés payés imposés",
    "/fiche-service-public/conges-payes",
    "/fiche-service-public/un-employeur-peut-il-refuser-des-conges-demandes-par-le-salarie",
    "/fiche-ministere-travail/les-conges-payes-quelles-sont-les-modalites-de-prise-des-conges-payes",
    ""
  ],
  [
    "inaptitude ancienneté propreté indemnité de licenciement",
    "/outils/indemnite-licenciement",
    "",
    "",
    ""
  ],
  [
    "comment rompre mon contrat d'apprentissage",
    "/modeles_de_courriers/rupture-dun-commun-accord-dun-contrat-dapprentissage",
    "",
    "",
    ""
  ],
  [
    "comment contester mon licenciement pour faute grave",
    "/fiche-service-public/faute-simple-grave-ou-lourde-quelles-differences-pour-le-salarie-licencie",
    "",
    "",
    ""
  ],
  [
    "rendez vous médicaux grossesse",
    "/fiche-service-public/grossesse-et-autorisation-dabsence-quelles-sont-les-regles",
    "/code-du-travail/article-l1225-16",
    "",
    ""
  ],
  [
    "temps de travail effectif",
    "/fiche-ministere-travail/la-duree-legale-du-travail-quels-sont-les-temps-de-travail-comptabilises-dans-la-duree-legale",
    "",
    "",
    ""
  ],
  [
    "Est ce que mon employeur doit me remettre mon contrat de travail",
    "/fiche-ministere-travail/quelle-forme-doit-revetir-le-cdi",
    "",
    "",
    ""
  ],
  [
    "A quelle date l'employeur doit il régler mon salaire",
    "/question/quelle-est-la-date-a-laquelle-selon-la-loi-mon-employeur-doit-verser-mon-salaire-oabkxegkk-th2g",
    "",
    "",
    ""
  ],
  [
    "Est-ce que mon employeur peut me licencier durant mon arrêt maladie?",
    "/fiche-service-public/licenciement-dun-salarie-en-arret-maladie-dans-le-secteur-prive",
    "/fiche-ministere-travail/les-absences-liees-a-la-maladie-ou-a-laccident-non-professionnel-peut-il-y-avoir-licenciement-pour-maladie",
    "",
    ""
  ],
  [
    "Quelles sont les conséquences si je ne respecte pas mon préavis de démission?",
    "/fiche-service-public/peut-on-travailler-pour-un-nouvel-employeur-avant-la-fin-du-preavis",
    "",
    "",
    ""
  ],
  [
    "Quelles sont les risques encourus si je ne respecte pas mon préavis de démission?",
    "/fiche-service-public/peut-on-travailler-pour-un-nouvel-employeur-avant-la-fin-du-preavis",
    "",
    "",
    ""
  ],
  [
    "A quelle date l'employeur doit il me remettre mes documents de fin de contrat?",
    "/fiche-ministere-travail/les-documents-remis-aux-salaries-lors-de-la-rupture-du-contrat-de-travail-et-lattestation-pour-pole-emploi",
    "",
    "",
    ""
  ],
  [
    "remise de mes dcuments de fin de contrat",
    "/fiche-service-public/quels-sont-les-documents-remis-au-salarie-a-la-fin-de-son-contrat",
    "",
    "",
    ""
  ],
  [
    "je n'ai pas signé de contrat de travail travail illégal",
    "/fiche-ministere-travail/les-obligations-de-lemployeur-lors-de-lembauche-quest-ce-que-la-declaration-prealable-a-lembauche",
    "",
    "",
    ""
  ],
  [
    "L'employeur a t-il le droit de me payer en liquide ou en espèce",
    "/fiche-service-public/paiement-du-salaire",
    "",
    "",
    ""
  ],
  [
    "différencier salarié, indépendant, et faux indépendant?",
    "/fiche-ministere-travail/les-sanctions-liees-au-travail-illegal-le-travail-dissimule",
    "",
    "",
    ""
  ],
  [
    "je n'ai pas signé de contrat de travail ai-je été emabauché illégalement?",
    "/fiche-service-public/le-contrat-de-travail-est-il-obligatoirement-ecrit",
    "/fiche-ministere-travail/contrat-de-travail-le-contrat-doit-il-etre-ecrit",
    "",
    ""
  ],
  [
    "je suis stagiaire, quels sont mes droits?",
    "/fiche-service-public/stages-les-obligations-de-lemployeur",
    "",
    "",
    ""
  ],
  [
    "licenciée pour inaptitude professionnelle 18 ans",
    "/outils/indemnite-licenciement",
    "",
    "",
    ""
  ],
  [
    "modification du contrat de travail, réduction d'horaires",
    "/fiche-ministere-travail/la-modification-du-contrat-de-travail-la-reduction-du-temps-de-travail-par-voie-daccord-constitue-t-elle-une-modification-du-contrat-de-travail",
    "",
    "",
    ""
  ],
  [
    "Je suis en CDD quelle est ma période d'essai",
    "/fiche-service-public/periode-dessai",
    "",
    "",
    ""
  ],
  [
    "Comment demander une rupture conventionnelle?",
    "/fiche-service-public/rupture-conventionnelle-dun-cdi",
    "",
    "",
    ""
  ],
  [
    "Qui dois-je consulter en cas de harcèlement moral?",
    "/fiche-ministere-travail/le-harcelement-moral-quels-recours",
    "",
    "",
    ""
  ],
  [
    "quelle est la durée du congé de maternité",
    "/fiche-ministere-travail/le-conge-de-maternite-quelle-est-la-duree-du-conge-de-maternite",
    "",
    "",
    ""
  ],
  [
    "assistance entretien préalable",
    "/fiche-ministere-travail/la-procedure-en-cas-de-licenciement-pour-motif-personnel-en-quoi-consiste-lentretien-prealable",
    "",
    "/code-du-travail/article-l1232-4",
    ""
  ],
  [
    "je travaille dans le bâtiment, et mon chef ne relève pas mes heures de travail",
    "/code-du-travail/article-d3171-8",
    "",
    "",
    ""
  ],
  [
    "je travaille dans une entreprise de nettoyage industrielle, mon employeur a perdu le marché est je que conserve mon contrat de travail?",
    "/question/je-travaille-dans-le-secteur-de-la-proprete-que-deviennent-les-dispositions-de-mon-contrat-de-travail-en-cas-de-reprise-du-chantier-sur-lequel-je-suis-affecte-emmtfkoy0gf4wa",
    "",
    "",
    ""
  ],
  [
    "je suis employé à domicile, est-il obligatoire d'avoir un contrat de travail?",
    "/fiche-service-public/contrat-de-travail-du-salarie-a-domicile-services-a-la-personne",
    "",
    "",
    ""
  ],
  [
    "j'ai négocié d'avancer la fin de mon préavis avec mon employeur, celle ci est elle remis een cause en cas d'absence injustifiée?",
    "/fiche-ministere-travail/la-demission-faut-il-respecter-un-preavis",
    "",
    "",
    ""
  ],
  ["L1242-8", "/code-du-travail/article-l1242-8", "", "", ""],
  ["L.1242-8", "/code-du-travail/article-l1242-8", "", "", ""],
  ["L 1242-8", "/code-du-travail/article-l1242-8", "", "", ""]
];

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "Exemples de requêtes / réponses",
  required: ["title"],
  properties: {
    title: {
      $id: "#/properties/title",
      type: "string",
      title: "Requête",
      default: ""
    },
    refs: {
      $id: "#/properties/refs",
      type: "array",
      title: "Références",
      items: {
        $id: "#/properties/refs/items",
        type: "object",
        title: "Référence",
        required: ["url"],
        properties: {
          url: {
            $id: "#/properties/refs/items/properties/url",
            type: "string",
            title: "Url de la référence",
            examples: ["/code-du-travail/article-l1242-8"]
          }
        }
      }
    }
  }
};

const KINTO_URL = process.env.KINTO_URL || "http://127.0.0.1:8888/v1";

const BUCKET = "datasets";
const DATASET_NAME = "requetes";

const parseResponse = res => {
  if (res.status >= 400) {
    throw new Error(`${res.url} [${res.status}] : ${res.statusText}`);
  }
};

const wait = (delay = 1000) =>
  new Promise((resolve, _) => setTimeout(resolve, delay * Math.random()));

const updateDatabase = async () => {
  try {
    // create admin account
    await fetch(`${KINTO_URL}/accounts/admin`, {
      method: "PUT",
      body: JSON.stringify({ data: { password: "s3cr3t" } }),
      headers: { "Content-Type": "application/json" }
    });

    // create bucket
    await fetch(`${KINTO_URL}/buckets/${BUCKET}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Basic ${btoa("admin:s3cr3t")}`
      },
      body: JSON.stringify({
        data: {
          id: BUCKET
        },
        permissions: {
          read: ["account:admin", "system.Everyone"],
          write: ["account:admin", "system.Everyone"],
          "collection:create": ["system.Everyone"]
        }
      }),
      method: "PUT"
    }).then(parseResponse);

    // remove any existing collection
    await fetch(`${KINTO_URL}/buckets/${BUCKET}/collections/${DATASET_NAME}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // create collection
    await fetch(`${KINTO_URL}/buckets/${BUCKET}/collections/${DATASET_NAME}`, {
      method: "PUT",
      body: JSON.stringify({
        data: { id: DATASET_NAME, schema }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(parseResponse);

    // create records from TUs
    data.forEach(async row => {
      const data = {
        title: row[0],
        refs: [
          row[1] && { url: row[1] },
          row[2] && { url: row[2] },
          row[3] && { url: row[3] },
          row[4] && { url: row[4] }
        ].filter(Boolean)
      };

      await fetch(
        `${KINTO_URL}/buckets/${BUCKET}/collections/${DATASET_NAME}/records`,
        {
          method: "POST",
          body: JSON.stringify({ data }),
          headers: { "Content-Type": "application/json" }
        }
      ).then(parseResponse);

      await wait();
    });

    // add frequent queries (from armand file)
    const frequentQueries = fs
      .readFileSync("./frequent-queries.tsv")
      .toString();
    const rows = frequentQueries
      .split("\n")
      .slice(1)
      .map(row => row.split("\t"))
      .filter(row => row[1] !== "");
    const groupByTheme = rows.reduce((a, row) => {
      if (!a[row[1]]) {
        a[row[1]] = [];
      }
      // prevent duplicates
      if (a[row[1]].indexOf(row[0]) === -1) {
        a[row[1]].push(row[0]);
      }
      return a;
    }, {});
    Object.keys(groupByTheme).forEach(async key => {
      const data = {
        title: key,
        variants: groupByTheme[key].join("\n"),
        refs: [{}]
      };

      await fetch(
        `${KINTO_URL}/buckets/${BUCKET}/collections/${DATASET_NAME}/records`,
        {
          method: "POST",
          body: JSON.stringify({ data }),
          headers: { "Content-Type": "application/json" }
        }
      ).then(parseResponse);

      await wait();
    });
  } catch (e) {
    console.log("e", e);
  }
};

updateDatabase();
