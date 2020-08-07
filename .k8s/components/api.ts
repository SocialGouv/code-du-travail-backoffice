import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";
import { addWaitForService } from "@socialgouv/kosko-charts/utils/addWaitForService";

const manifests = create("api", {
  env,
  config: {
    subDomainPrefix: "api-",
    containerPort: 80,
  },
  deployment: {
    container: {
      resources: {
        requests: {
          cpu: "100m",
          memory: "64Mi",
        },
        limits: {
          cpu: "500m",
          memory: "256Mi",
        },
      },
    },
  },
});

const deployment = manifests.find(
  (manifest): manifest is Deployment => manifest.kind === "Deployment",
);

ok(deployment);
addPostgresUserSecret(deployment);
addWaitForPostgres(deployment);
addWaitForService(deployment, "postgrest");

export default manifests;
