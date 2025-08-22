import * as cookie from "cookie";
import { TRUSTIFICATION_ENV } from "@trustify-ui/common";

const logger =
  process.env.DEBUG === "1"
    ? console
    : {
        info() {},
        warn: console.warn,
        error: console.error,
      };

export const proxyMap = {
  ...(TRUSTIFICATION_ENV.OIDC_SERVER_IS_EMBEDDED === "true" && {
    auth: {
      pathFilter: "/auth",
      target: TRUSTIFICATION_ENV.OIDC_SERVER_URL || "http://localhost:8090",
      logger,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req, _res) => {
          // Keycloak needs these header set so we can function in Kubernetes (non-OpenShift)
          // https://www.keycloak.org/server/reverseproxy
          //
          // Note, on OpenShift, this works as the haproxy implementation
          // for the OpenShift route is setting these for us automatically
          //
          // We saw problems with including the below broke the OpenShift route
          //  {"X-Forwarded-Proto", req.protocol} broke the OpenShift
          //  {"X-Forwarded-Port", req.socket.localPort}
          //  {"Forwarded", `for=${req.socket.remoteAddress};proto=${req.protocol};host=${req.headers.host}`}
          // so we are not including even though they are customary
          //
          req.socket.remoteAddress &&
            proxyReq.setHeader("X-Forwarded-For", req.socket.remoteAddress);
          req.socket.remoteAddress &&
            proxyReq.setHeader("X-Real-IP", req.socket.remoteAddress);
          req.headers.host &&
            proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
        },
      },
    },
  }),
  api: {
    pathFilter: "/api",
    target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
    logger,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, _res) => {
        const cookies = cookie.parse(req.headers.cookie ?? "");
        const bearerToken = cookies.keycloak_cookie;
        if (bearerToken && !req.headers.authorization) {
          proxyReq.setHeader("Authorization", `Bearer ${bearerToken}`);
        }
      },
      proxyRes: (proxyRes, req, res) => {
        if (
          !req.headers.accept?.includes("application/json") &&
          (proxyRes.statusCode === 401 ||
            proxyRes.statusMessage === "Unauthorized")
        ) {
          res.writeHead(302, { Location: "/" }).end();
          proxyRes?.destroy();
        }
      },
    },
  },
  openapi: {
    pathFilter: "/openapi",
    target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
    logger,
    changeOrigin: true,
  },
  openapiJson: {
    pathFilter: "/openapi.json",
    target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
    logger,
    changeOrigin: true,
  },
};
