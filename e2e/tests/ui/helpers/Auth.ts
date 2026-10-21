import { expect, type Page } from "@playwright/test";
import axios from "axios";
import https from "node:https";

import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_PASSWORD,
  AUTH_REQUIRED,
  AUTH_SCOPE,
  AUTH_URL,
  AUTH_USER,
  TRUSTIFY_UI_URL,
  UI_AUTH_MODE,
  logger,
} from "../../common/constants";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const discoverFrontendOidcConfig = async (baseURL: string) => {
  const response = await axios.get<string>(baseURL, {
    maxRedirects: 0,
    httpsAgent,
    timeout: 5000,
    timeoutErrorMessage: `Could not fetch index.html from ${baseURL}`,
  });

  const matcher = response.data.match(/window._env\s*=\s*"([^"]+)"/);
  const serverConfig = matcher?.[1];
  if (!serverConfig) {
    throw new Error(
      "Could not discover OIDC config from frontend index.html. " +
        "Set PLAYWRIGHT_AUTH_URL explicitly.",
    );
  }

  const envInfo: Record<string, string> = JSON.parse(atob(serverConfig));
  return {
    oidcServerUrl: envInfo.OIDC_SERVER_URL,
    oidcClientId: envInfo.OIDC_CLIENT_ID || "frontend",
  };
};

const getClientCredentialsToken = async (authUrl: string) => {
  const oidcConfigResponse = await axios.get(
    `${authUrl}/.well-known/openid-configuration`,
    { httpsAgent },
  );
  const tokenEndpoint = oidcConfigResponse.data.token_endpoint;
  expect(
    tokenEndpoint,
    "Could not discover token_endpoint from OIDC configuration",
  ).toBeTruthy();

  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", AUTH_CLIENT_ID);
  data.append("client_secret", AUTH_CLIENT_SECRET);
  if (AUTH_SCOPE) {
    data.append("scope", AUTH_SCOPE);
  }

  const response = await axios.post(tokenEndpoint, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent,
  });

  return response.data as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };
};

const loginWithTokenInjection = async (page: Page) => {
  const { oidcServerUrl, oidcClientId } =
    await discoverFrontendOidcConfig(TRUSTIFY_UI_URL);
  logger.info(
    `Discovered frontend OIDC config: server=${oidcServerUrl}, clientId=${oidcClientId}`,
  );

  const authUrl = AUTH_URL || oidcServerUrl;
  if (!authUrl) {
    throw new Error(
      "Auth URL not available. Set PLAYWRIGHT_AUTH_URL or ensure the frontend exposes OIDC_SERVER_URL.",
    );
  }

  const tokenResponse = await getClientCredentialsToken(authUrl);
  logger.info("Obtained access token via client_credentials");

  const expiresAt =
    Math.floor(Date.now() / 1000) + (tokenResponse.expires_in || 3600);

  const storageKey = `oidc.user:${oidcServerUrl}:${oidcClientId}`;
  const userObject = JSON.stringify({
    access_token: tokenResponse.access_token,
    token_type: "Bearer",
    scope: AUTH_SCOPE || "openid",
    expires_at: expiresAt,
    profile: {
      sub: AUTH_CLIENT_ID,
    },
  });

  logger.debug(`Injecting token into sessionStorage key: ${storageKey}`);

  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      sessionStorage.setItem(key, value);
    },
    { key: storageKey, value: userObject },
  );

  await page.goto("/importers");
  await expect(page.getByRole("heading", { name: "Importers" })).toHaveCount(1);
};

const loginWithForm = async (page: Page) => {
  const userName = AUTH_USER;
  const userPassword = AUTH_PASSWORD;

  await page.goto("/importers");

  await page.fill('input[name="username"]:visible', userName);
  await page.fill('input[name="password"]:visible', userPassword);
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: "Importers" })).toHaveCount(1);
};

export const login = async (page: Page) => {
  if (AUTH_REQUIRED !== "true") {
    return;
  }

  if (UI_AUTH_MODE === "token_injection") {
    await loginWithTokenInjection(page);
  } else {
    await loginWithForm(page);
  }
};
