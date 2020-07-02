import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { addToEnvFrom } from "@socialgouv/kosko-charts/utils/addToEnvFrom";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";
import { loadYaml } from "../getEnvironmentComponent";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const params = env.component("postgrest");
const { deployment, ingress, service } = create(params);

const secret = new SealedSecret({
  ...loadYaml(env, "postgrest-env.sealed-secret.yaml"),
  metadata: {
    ...metadataFromParams(params),
    name: `postgrest-env`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
});

const configMap = new ConfigMap({
  ...loadYaml(env, "postgrest-env.configmap.yaml"),
  metadata: {
    ...metadataFromParams(params),
    name: `postgrest-env`,
  },
  data: {
    FRONTEND_HOST: ingress.spec!.rules![0].host!,
  },
});

//

const secretSource = new EnvFromSource({
  secretRef: {
    name: `postgrest-env`,
  },
});

const configMapSource = new EnvFromSource({
  configMapRef: {
    name: `postgrest-env`,
  },
});

addToEnvFrom({
  deployment,
  data: [secretSource, configMapSource],
});

const azureSecretSource = new EnvFromSource({
  secretRef: {
    name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
  },
});
addToEnvFrom({
  deployment,
  data: [azureSecretSource],
});

//

export default [secret, configMap, deployment, ingress, service];
