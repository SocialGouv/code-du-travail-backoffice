import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";
//import { addWaitForService } from "@socialgouv/kosko-charts/utils/addWaitForService";
import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";

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

const script = `
env
echo "ioooo";
`;

export const debugContainer = () => {
  return {
    name: "debug",
    image: `bash:latest`,
    imagePullPolicy: "Always",
    resources: {
      requests: {
        cpu: "5m",
        memory: "16Mi",
      },
      limits: {
        cpu: "20m",
        memory: "32Mi",
      },
    },
    envFrom: [
      {
        secretRef: {
          name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
        },
      },
    ],
    command: ["sh", "-c", script],
  };
};

const deployment = manifests.find(
  (manifest): manifest is Deployment => manifest.kind === "Deployment",
);

export const waitForService = (name: string) => {
  return {
    name: `wait-for-${name}`,
    image: `bash:4`,
    imagePullPolicy: "Always",
    resources: {
      requests: {
        cpu: "5m",
        memory: "16Mi",
      },
      limits: {
        cpu: "20m",
        memory: "32Mi",
      },
    },
    command: [
      "sh",
      "-c",
      `until nslookup ${name}.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo en attente de ${name}; sleep 2; done`,
    ],
  };
};

const addWaitForService = (deployment: Deployment, name: string): Deployment => {
  const initContainer = waitForService(name);

  addInitContainer(deployment, initContainer);

  return deployment;
};

ok(deployment);
addPostgresUserSecret(deployment);
addWaitForPostgres(deployment);
addWaitForService(deployment, "postgrest");
//todo: add wait for postgrest
export default manifests;
