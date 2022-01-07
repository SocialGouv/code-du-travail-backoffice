import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

export default () => {
  return create("pg-user", {
    env,
  });
};
