import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("api", {
  env,
  config: {
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

// todo: add pgsecret
// PGRST_DB_URI;
// PGRST_JWT_SECRET;

export default manifests;
