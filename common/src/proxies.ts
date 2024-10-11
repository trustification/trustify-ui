import type { Options } from "http-proxy-middleware";
import { TRUSTIFICATION_ENV } from "./environment.js";

export const proxyMap: Record<string, Options> = {
  "/api": {
    target: TRUSTIFICATION_ENV.TRUSTIFY_API_URL || "http://localhost:8080",
    logLevel: process.env.DEBUG ? "debug" : "info",
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any, _res: any) => {
      // Add the Bearer token to the request if it is not already present, AND if
      // the token is part of the request as a cookie
      if (req.cookies?.keycloak_cookie && !req.headers["authorization"]) {
        proxyReq.setHeader(
          "Authorization",
          `Bearer ${req.cookies.keycloak_cookie}`
        );
      }
    },
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      const includesJsonHeaders =
        req.headers.accept?.includes("application/json");
      if (
        (!includesJsonHeaders && proxyRes.statusCode === 401) ||
        (!includesJsonHeaders && proxyRes.statusMessage === "Unauthorized")
      ) {
        res.redirect("/");
      }
    },
  },
};
