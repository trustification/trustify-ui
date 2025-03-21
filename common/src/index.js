var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  proxyMap: () => proxyMap,
  encodeEnv: () => encodeEnv,
  decodeEnv: () => decodeEnv,
  buildTrustificationEnv: () => buildTrustificationEnv,
  brandingStrings: () => brandingStrings,
  TRUSTIFICATION_ENV_DEFAULTS: () => TRUSTIFICATION_ENV_DEFAULTS,
  TRUSTIFICATION_ENV: () => TRUSTIFICATION_ENV,
  SERVER_ENV_KEYS: () => SERVER_ENV_KEYS
});
module.exports = __toCommonJS(exports_src);

// src/environment.ts
var SERVER_ENV_KEYS = ["PORT", "TRUSTIFY_API_URL", "BRANDING"];
var buildTrustificationEnv = ({
  NODE_ENV = "production",
  PORT,
  VERSION = "99.0.0",
  MOCK = "off",
  OIDC_SERVER_URL,
  OIDC_SERVER_IS_EMBEDDED = "false",
  OIDC_SERVER_EMBEDDED_PATH,
  AUTH_REQUIRED = "true",
  OIDC_CLIENT_ID,
  OIDC_SCOPE,
  UI_INGRESS_PROXY_BODY_SIZE = "500m",
  TRUSTIFY_API_URL,
  BRANDING,
  ANALYTICS_ENABLED = "false",
  ANALYTICS_WRITE_KEY
} = {}) => ({
  NODE_ENV,
  PORT,
  VERSION,
  MOCK,
  OIDC_SERVER_URL,
  OIDC_SERVER_IS_EMBEDDED,
  OIDC_SERVER_EMBEDDED_PATH,
  AUTH_REQUIRED,
  OIDC_CLIENT_ID,
  OIDC_SCOPE,
  UI_INGRESS_PROXY_BODY_SIZE,
  TRUSTIFY_API_URL,
  BRANDING,
  ANALYTICS_ENABLED,
  ANALYTICS_WRITE_KEY
});
var TRUSTIFICATION_ENV_DEFAULTS = buildTrustificationEnv();
var TRUSTIFICATION_ENV = buildTrustificationEnv(process.env);
// src/proxies.ts
var proxyMap = {
  ...TRUSTIFICATION_ENV.OIDC_SERVER_IS_EMBEDDED === "true" && {
    "/auth": {
      target: TRUSTIFICATION_ENV.OIDC_SERVER_URL || "http://localhost:8090",
      logLevel: process.env.DEBUG ? "debug" : "info",
      changeOrigin: true,
      onProxyReq: (proxyReq, req, _res) => {
        req.socket.remoteAddress && proxyReq.setHeader("X-Forwarded-For", req.socket.remoteAddress);
        req.socket.remoteAddress && proxyReq.setHeader("X-Real-IP", req.socket.remoteAddress);
        req.headers.host && proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
      }
    }
  },
  "/api": {
    target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
    logLevel: process.env.DEBUG ? "debug" : "info",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, _res) => {
      if (req.cookies?.keycloak_cookie && !req.headers.authorization) {
        proxyReq.setHeader("Authorization", `Bearer ${req.cookies.keycloak_cookie}`);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      const includesJsonHeaders = req.headers.accept?.includes("application/json");
      if (!includesJsonHeaders && proxyRes.statusCode === 401 || !includesJsonHeaders && proxyRes.statusMessage === "Unauthorized") {
        res.redirect("/");
      }
    }
  }
};
// src/branding-strings-stub.json
var branding_strings_stub_default = {
  application: {
    title: "Stub to allow package build to work",
    name: "",
    description: ""
  },
  about: {
    displayName: "",
    image: "",
    documentationUrl: ""
  },
  masthead: {
    leftBrand: {
      src: "",
      alt: "",
      height: ""
    },
    leftTitle: null,
    rightBrand: null
  }
};

// src/branding.ts
var brandingStrings = branding_strings_stub_default;

// src/index.ts
var encodeEnv = (env, exclude) => {
  const filtered = exclude ? Object.fromEntries(Object.entries(env).filter(([key]) => !exclude.includes(key))) : env;
  return btoa(JSON.stringify(filtered));
};
var decodeEnv = (env) => !env ? {} : JSON.parse(atob(env));

//# debugId=B7BB46F085E7854864756E2164756E21
//# sourceMappingURL=index.js.map
