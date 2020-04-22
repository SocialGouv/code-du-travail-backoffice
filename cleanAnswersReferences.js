const axios = require("axios");
const dotenv = require("dotenv");
const postgrester = require("postgrester");

const getArticleById = require("./packages/api/src/libs/getArticleById");

dotenv.config();

const API_URI = "https://contributions-api.codedutravail.fabrique.social.gouv.fr";

const axiosClient = axios.create({
  baseURL: API_URI,
  headers: {
    authorization: process.env.AUTHORIZATION,
  },
});

const postgresterClient = postgrester.create({
  axiosInstance: axiosClient,
});

(async () => {
  const { data: answersReferencesMissingDilaCid } = await postgresterClient.not
    .is("dila_id", null)
    .is("dila_cid", null)
    .get("/answers_references");
  console.log(`Answers References missing "dila_cid": ${answersReferencesMissingDilaCid.length}`);

  // const answersReferencesWithDilaId = answersReferences.filter(({ dila_id }) => dila_id !== null);
  // console.log(`Answers References with "dila_id": ${answersReferencesWithDilaId.length}`);

  // const answersReferencesMissingDilaCid = answersReferencesWithDilaId.filter(
  //   ({ dila_cid }) => dila_cid === null,
  // );
  // console.log(`Answers References missing "dila_cid": ${answersReferencesMissingDilaCid.length}`);

  let index = answersReferencesMissingDilaCid.length;
  while (--index >= 0) {
    const answerReference = { ...answersReferencesMissingDilaCid[index] };
    const { dila_id, id } = answerReference;
    const path = `/legal-references/${dila_id}`;
    const logStart = `[${String(index).padStart(4, "0")}] ${dila_id}:`;
    const logEnd = `(${API_URI}${path})`;

    try {
      const legalReference = getArticleById(dila_id);
      // const { data: legalReference } = await axiosClient.get(path);
      const { agreementId, cid } = legalReference;

      console.log(`${logStart} dila_cid=${cid} dila_container_id=${agreementId} ${logEnd}`);

      // delete answerReference.created_at;
      // delete answerReference.updated_at;
      // answerReference.dila_cid = cid;
      // answerReference.dila_container_id = agreementId;

      // await axiosClient.post("/answers_references", [answerReference], {
      //   headers: {
      //     Prefer: "resolution=merge-duplicates",
      //   },
      // });

      // console.log(`${logStart} Updated: ${API_URI}/answers_references?id=eq.${id}`);
    } catch (err) {
      console.log(`[ERROR] ${logStart} ${err.message} ${logEnd}`);
      console.log(answerReference);

      // process.exit(1);
    }
  }
  // console.log(answersReferencesWithDilaId);
})();
