import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addWaitForService } from "@socialgouv/kosko-charts/utils/addWaitForService";

const manifests = create("app", {
  env,
  config: {
    containerPort: 3000,
    withPostgres: true,
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
addWaitForService(deployment, "postgrest");

export default manifests;
