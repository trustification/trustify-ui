import { buildTrustificationEnv, decodeEnv } from "@trustify-ui/common";

const ENV = buildTrustificationEnv(decodeEnv(window._env));

export default ENV;
