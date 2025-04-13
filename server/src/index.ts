/* eslint-env node */

import path from "node:path";
import { fileURLToPath } from "node:url";

import cookieParser from "cookie-parser";
import ejs from "ejs";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createHttpTerminator } from "http-terminator";

import {
  SERVER_ENV_KEYS,
  TRUSTIFICATION_ENV,
  brandingStrings,
  encodeEnv,
  proxyMap,
} from "@trustify-ui/common";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pathToClientDist = path.join(__dirname, "../../client/dist");

const port = TRUSTIFICATION_ENV.PORT
  ? Number.parseInt(TRUSTIFICATION_ENV.PORT, 10)
  : 8080;

const app = express();
app.set("x-powered-by", false);
app.use(cookieParser());

// Setup proxy handling
for (const proxyPath in proxyMap) {
  app.use(proxyPath, createProxyMiddleware(proxyMap[proxyPath]));
}

app.engine("ejs", ejs.renderFile);
app.use(express.json());
app.set("views", pathToClientDist);
app.use(express.static(pathToClientDist));

// Handle any request that hasn't already been handled by express.static or proxy
app.get("*", (_, res) => {
  res.render("index.html.ejs", {
    _env: encodeEnv(TRUSTIFICATION_ENV, SERVER_ENV_KEYS),
    branding: brandingStrings,
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port::${port}`);
});

// Handle shutdown signals Ctrl-C (SIGINT) and default podman/docker stop (SIGTERM)
const httpTerminator = createHttpTerminator({ server });

const shutdown = async (signal) => {
  if (!server) {
    console.log(`${signal}, no server running.`);
    return;
  }

  console.log(`${signal} - Stopping server on port::${port}`);
  await httpTerminator.terminate();
  console.log(`${signal} - Stopped server on port::${port}`);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
