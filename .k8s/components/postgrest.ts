import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { IIoK8sApiCoreV1Container } from "kubernetes-models/_definitions/IoK8sApiCoreV1Container";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";

const getManifests = async () => {
  const manifests = await create("postgrest", {
    env,
    config: {
      ingress: false,
      image: "postgrest/postgrest:v6.0.2",
      containerPort: 3000,
      withPostgres: true,
      // withPostgres: {
      //   prepare: `
      //     ALTER USER user_${process.env.CI_COMMIT_SHORT_SHA} with CREATEROLE;
      //     GRANT user_${process.env.CI_COMMIT_SHORT_SHA} to cdtncontribadmin;
      //     ALTER DATABASE autodevops_${process.env.CI_COMMIT_SHORT_SHA} OWNER TO user_${process.env.CI_COMMIT_SHORT_SHA};
      //     GRANT anonymous TO user_${process.env.CI_COMMIT_SHORT_SHA};
      //     `,
      // },
    },
    deployment: {
      container: {
        livenessProbe: {
          exec: {
            command: ["cat", "/etc/hosts"], //todo
          },
        },
        readinessProbe: {
          exec: {
            command: ["cat", "/etc/hosts"], //todo
          },
        },
        startupProbe: {
          exec: {
            command: ["cat", "/etc/hosts"], //todo
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
    command: string[];
  };

  const masterImage = `${process.env.CI_REGISTRY_IMAGE}/master:${process.env.CI_COMMIT_SHA}`;

  const defaultCommandSpecs = {
    imagePullPolicy: "Always",
    resources: {
      requests: {
        cpu: "5m",
        memory: "16Mi",
      },
      limits: {
        cpu: "500m",
        memory: "128Mi",
      },
    },
  };

  const makeYarnCommand = ({ name, command }: MakeCommandParams) => ({
    name,
    image: masterImage,
    ...defaultCommandSpecs,
    env: [
      // todo: dev only !
      { name: "PGDATABASE", value: `autodevops_${process.env.CI_COMMIT_SHORT_SHA}` },
      {
        name: "DB_URI",
        valueFrom: { secretKeyRef: { name: "azure-pg-admin-user", key: "DATABASE_URL" } },
      },
      { name: "PGRST_JWT_SECRET", value: process.env.CI_COMMIT_SHORT_SHA },
      { name: "POSTGRES_DB", value: `autodevops_${process.env.CI_COMMIT_SHORT_SHA}` },
    ],
    command,
    envFrom: [
      {
        secretRef: {
          name: "azure-pg-admin-user",
        },
      },
    ],
  });

  const makeMigration = (): IIoK8sApiCoreV1Container =>
    makeYarnCommand({
      name: "db-migration",
      command: ["yarn", "db:migrate"],
    });

  const makeSeed = (): IIoK8sApiCoreV1Container =>
    makeYarnCommand({
      name: "db-seed",
      command: ["yarn", "db:seed"],
    });

  /*
pg_restore -ae --disable-triggers -d ${POSTGRES_DB} -j 8 -U ${POSTGRES_USER}`;


"pg_restore", "-ae", "--disable-triggers", "-d", database, "-j", 8, "-N", "public", path

  const end = `/${MAIN_DB_FILENAME}`;
  run(`${start} -N public ${end}`);
  run(`${start} -n public -t users_agreements ${end}`);

  */
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
  ok(deployment.spec.template.spec.containers[0].startupProbe);
  delete deployment.spec.template.spec.containers[0].livenessProbe.httpGet;
  delete deployment.spec.template.spec.containers[0].readinessProbe.httpGet;
  delete deployment.spec.template.spec.containers[0].startupProbe.httpGet;

  // Db secrets + init
  if (env.env === "dev") {
    addInitContainer(deployment, makeMigration());
    addInitContainer(deployment, makeSeed());
  }
};
export default getManifests;
