import { ok } from "assert";
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addWaitForService } from "@socialgouv/kosko-charts/utils/addWaitForService";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";

const getManifests = async () => {
  const manifests = await create("app", {
    env,
    config: {
      image: getHarborImagePath({ name: "cdtn-backoffice/app", project: "cdtn" }),
      containerPort: 3000,
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

  const deployment = manifests.find(
    (manifest): manifest is Deployment => manifest.kind === "Deployment",
  );
  ok(deployment);
  addWaitForService(deployment, "postgrest");
  return manifests;
};

export default getManifests;
