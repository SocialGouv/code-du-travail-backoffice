import { ok } from "assert";
import { getProdDatabaseParameters } from "@socialgouv/kosko-charts/components/azure-db/params";

export default {
  name: "create-db-job",
  ...getProdDatabaseParameters(),
};
