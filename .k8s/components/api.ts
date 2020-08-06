import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";

const manifests = create("api", {
  env,
  config: {
    subDomainPrefix: "api-",
    image:
      "registry.gitlab.factory.social.gouv.fr/socialgouv/code-du-travail-backoffice/api:04f04a7421bc25ac22bfda631902358a12e58f3c",
    containerPort: 80,
  },
  deployment: {
    container: {
      livenessProbe: {
        httpGet: {
          path: "/",
          port: 80,
        },
        periodSeconds: 20,
      },
      readinessProbe: {
        httpGet: {
          path: "/",
          port: 80,
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

export default manifests;
