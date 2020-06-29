// @ts-check

import axios from "axios";
import log from "npmlog";

const { CDTN_API_URL } = process.env;

log.enableColor();

const axiosClient = axios.create({
  baseURL: CDTN_API_URL,
});

/**
 * @param {string} id
 *
 * @returns {boolean}
 */
const isAgreementId = id => typeof id === "string" && /^KALICONT\d{12}$/.test(id);

(async () => {
  try {
    const start = process.hrtime();

    // ==================================================
    // Agreements

    const { data: indexedAgreements } = await axiosClient.get("/agreements");
    const filteredIndexedAgreements = indexedAgreements.filter(({ id }) => isAgreementId(id));
    let iMax = filteredIndexedAgreements.length;
    let i = -1;
    while (++i < iMax) {
      const { id } = filteredIndexedAgreements[i];
      const index = `[${String(i + 1).padStart(3, "0")}/${iMax}]`;

      log.info("scripts/dev/updateApiCache.js", `${index} Updating agreement cache for ID=${id}…`);
      await axiosClient.get(`/agreement/articles?agreementIdOrIdcc=${id}&query=1`);
      log.info("scripts/dev/updateApiCache.js", `${index} Agreement cache updated for ID=${id}.`);
    }

    // ==================================================
    // Codes

    const { data: indexedCodes } = await axiosClient.get("/codes");
    const filteredIndexedCodes = indexedCodes.filter(({ id }) => id === "LEGITEXT000006072050");
    iMax = filteredIndexedCodes.length;
    i = -1;
    while (++i < iMax) {
      const { id } = filteredIndexedCodes[i];
      const index = `[${String(i + 1).padStart(3, "0")}/${iMax}]`;

      log.info("scripts/dev/updateApiCache.js", `${index} Updating code cache for ID=${id}…`);
      await axiosClient.get(`/code/articles?codeId=${id}&query=1`);
      log.info("scripts/dev/updateApiCache.js", `${index} Code cache updated for ID=${id}.`);
    }

    const end = process.hrtime(start);
    log.info(
      "scripts/dev/updateApiCache.js",
      "Cache updated in %ds %dms.",
      end[0],
      end[1] / 1000000,
    );
  } catch (err) {
    log.error("scripts/dev/updateApiCache.js", err);
  }
})();
