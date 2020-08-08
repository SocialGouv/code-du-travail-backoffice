import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { IIoK8sApiCoreV1Container } from "kubernetes-models/_definitions/IoK8sApiCoreV1Container";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";
import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";

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

const secretName = process.env.PRODUCTION
  ? `azure-pg-user`
  : `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`;

type MakeCommandParams = {
  name: string;
  image: string;

  command: string[];
};

const makeCommand = ({ name, image, command }: MakeCommandParams) => ({
  name,
  image,
  imagePullPolicy: "Always",
  resources: {
    requests: {
      cpu: "5m",
      memory: "16Mi",
    },
    limits: {
      cpu: "200m",
      memory: "128Mi",
    },
  },
  envFrom: [
    {
      secretRef: {
        name: secretName,
      },
    },
  ],
  env: [
    // todo: dev only !
    { name: "PGRST_JWT_SECRET", value: process.env.CI_COMMIT_SHORT_SHA },
    { name: "POSTGRES_DB", value: `autodevops_${process.env.CI_COMMIT_SHORT_SHA}` },
  ],
  command,
});

const makeMigration = (): IIoK8sApiCoreV1Container =>
  makeCommand({
    name: "db-migration",
    image: `${process.env.CI_REGISTRY_IMAGE}/master:${process.env.CI_COMMIT_SHA}`,
    command: ["yarn", "knex", "migrate:latest"],
  });

const makeSeed = (): IIoK8sApiCoreV1Container =>
  makeCommand({
    name: "db-seed",
    image: `${process.env.CI_REGISTRY_IMAGE}/master:${process.env.CI_COMMIT_SHA}`,
    command: ["yarn", "knex", "seed:run"],
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
delete deployment.spec.template.spec.containers[0].livenessProbe.httpGet;
delete deployment.spec.template.spec.containers[0].readinessProbe.httpGet;

// Db secrets + init
addPostgresUserSecret(deployment);
addWaitForPostgres(deployment);
addInitContainer(deployment, makeMigration());
addInitContainer(deployment, makeSeed());

export default manifests;
