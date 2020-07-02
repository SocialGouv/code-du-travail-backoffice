import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  name: "app",
  image: {
    name: process.env.CI_REGISTRY_IMAGE + "/app",
    tag: process.env.CI_COMMIT_TAG ? process.env.CI_COMMIT_TAG.slice(1) : process.env.CI_COMMIT_SHA,
  },
  ingress: {
    secretName: process.env.PRODUCTION ? "app-crt" : "wildcard-crt",
  },
  labels: {
    component: "app",
  },
  requests: {
    cpu: "1m",
    memory: "64Mi",
  },
  limits: {
    cpu: "50m",
    memory: "128Mi",
  },
  containerPort: 3000,
  servicePort: 3000,
} as Readonly<AppComponentEnvironment>;
