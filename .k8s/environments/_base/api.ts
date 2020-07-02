import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  name: "api",
  subdomain: `api-${process.env.CI_PROJECT_NAME as string}`,
  image: {
    name: process.env.CI_REGISTRY_IMAGE + "/api",
    tag: process.env.CI_COMMIT_TAG ? process.env.CI_COMMIT_TAG.slice(1) : process.env.CI_COMMIT_SHA,
  },
  ingress: {
    secretName: process.env.PRODUCTION ? "api-crt" : "wildcard-crt",
  },
  labels: {
    component: "api",
  },
  requests: {
    cpu: "100m",
    memory: "64Mi",
  },
  limits: {
    cpu: "500m",
    memory: "256Mi",
  },
  containerPort: 80,
  servicePort: 80,
} as Readonly<AppComponentEnvironment>;
