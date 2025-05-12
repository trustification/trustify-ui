import { buildTrustificationEnv, decodeEnv } from "@trustify-ui/common";

export const ENV = buildTrustificationEnv(decodeEnv(window._env));

export default ENV;
