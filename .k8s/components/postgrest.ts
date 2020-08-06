import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";

const manifests = create("postgrest", {
  env,
  config: {
    ingress: false,
    image: "postgrest/postgrest:v6.0.2",
    containerPort: 3000,
  },
  deployment: {
    container: {
      livenessProbe: {
        httpGet: {
          path: "/",
          port: 3000,
        },
        periodSeconds: 20,
      },
      readinessProbe: {
        httpGet: {
          path: "/",
          port: 3000,
        },
        periodSeconds: 20,
      },
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

// todo: add PGRST_JWT_SECRET;

export default manifests;
