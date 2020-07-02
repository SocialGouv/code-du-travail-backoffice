import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  name: "postgrest",
  subdomain: `postgrest-${process.env.CI_PROJECT_NAME as string}`,
  image: {
    name: "postgrest/postgrest",
    tag: "v6.0.2",
  },
  ingress: {
    secretName: process.env.PRODUCTION ? "postgrest-crt" : "wildcard-crt",
  },
  labels: {
    component: "postgrest",
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
