import { Api } from "./api";

export default new Api(
  process.env.CDTN_API_URL !== undefined
    ? process.env.CDTN_API_URL
    : "https://cdtn-api.fabrique.social.gouv.fr",
);
