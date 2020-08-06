import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("api", {
  env,
  config: {
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

// todo: add pgsecret
// DB_URI;

export default manifests;
