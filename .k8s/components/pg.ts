import env from "@kosko/env";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

import { loadYaml } from "@socialgouv/kosko-charts/utils/getEnvironmentComponent";
import { updateMetadata } from "@socialgouv/kosko-charts/utils/updateMetadata";
import gitlab from "@socialgouv/kosko-charts/environments/gitlab";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

export default () => {
  if (env.env === "dev" || env.env === "local") {
    return create({
      env,
      config: {
        prepareScript: `
ALTER USER user_${process.env.CI_COMMIT_SHORT_SHA} with CREATEROLE;
CREATE EXTENSION "uuid-ossp";
GRANT anonymous TO user_${process.env.CI_COMMIT_SHORT_SHA};
      `,
      },
    });
  }

  // in prod/preprod, we try to add a fixed sealed-secret
  const secret = loadYaml<SealedSecret>(env, `pg-user.sealed-secret.yaml`);
  if (!secret) {
    return [];
  }

  const envParams = gitlab(process.env);
  // add gitlab annotations
  updateMetadata(secret, {
    annotations: envParams.annotations || {},
    labels: envParams.labels || {},
    namespace: envParams.namespace,
  });
  return [secret];
};
