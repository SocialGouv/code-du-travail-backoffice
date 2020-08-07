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
        exec: {
          command: ["cat", "/etc/hosts"],
        },
      },
      readinessProbe: {
        exec: {
          command: ["cat", "/etc/hosts"],
        },
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

// delete http probes
ok(deployment);
ok(deployment.spec);
ok(deployment.spec.template);
ok(deployment.spec.template.spec);
ok(deployment.spec.template.spec.containers[0]);
ok(deployment.spec.template.spec.containers[0].livenessProbe);
ok(deployment.spec.template.spec.containers[0].readinessProbe);
deployment.spec.template.spec.containers[0].livenessProbe.httpGet;
deployment.spec.template.spec.containers[0].readinessProbe.httpGet;

addPostgresUserSecret(deployment);
addWaitForPostgres(deployment);

// todo: add PGRST_JWT_SECRET;

export default manifests;
