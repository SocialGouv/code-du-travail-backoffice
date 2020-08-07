import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";

const manifests = create("app", {
  env,
  config: {
    containerPort: 3000,
  },
  deployment: {
    container: {
      livenessProbe: {
        periodSeconds: 20,
      },
      readinessProbe: {
        periodSeconds: 20,
      },
      resources: {
        requests: {
          cpu: "100m",
          memory: "256Mi",
        },
        limits: {
          cpu: "500m",
          memory: "512Mi",
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

export default manifests;
