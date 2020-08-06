import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("app", {
  env,
  config: {
    image: "registry.gitlab.factory.social.gouv.fr/socialgouv/code-du-travail-backoffice/app",
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

// todo: add pgsecret
// DB_URI;

export default manifests;
