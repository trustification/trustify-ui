import { test as base, expect } from "@playwright/test";
import axios, { type AxiosInstance } from "axios";
import https from "node:https";

import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_REQUIRED,
  AUTH_URL,
  logger,
  TRUSTIFY_API_URL,
} from "../common/constants";

let access_token = "";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

const getToken = async (baseURL?: string) => {
  let authUrl: string | null = null;
  if (AUTH_URL) {
    authUrl = AUTH_URL;
  } else if (baseURL) {
    logger.info("Token URL not defined. Discovering token endpoint");
    authUrl = await discoverTokenEndpoint(axios, baseURL);
  }

  expect(
    authUrl,
    "TRUSTIFY_AUTH_URL was not set and couldn't be discovered",
  ).not.toBeNull();

  logger.info(`Auth URL: ${authUrl}`);

  // Discover token endpoint
  const oidcConfigResponse = await axios.get(
    `${authUrl}/.well-known/openid-configuration`,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    },
  );
  const tokenServiceURL = oidcConfigResponse.data.token_endpoint;
  expect(tokenServiceURL).not.toBeUndefined();

  // Request token
  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", AUTH_CLIENT_ID);
  data.append("client_secret", AUTH_CLIENT_SECRET);

  return await axios.post<TokenResponse>(tokenServiceURL, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const discoverTokenEndpoint = async (
  axios: AxiosInstance,
  baseURL: string,
) => {
  logger.info(`Extracting index.html from ${baseURL}`);
  const indexPage = await axios.get<string>(baseURL, {
    maxRedirects: 0,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    timeout: 2000,
    timeoutErrorMessage: `Could not fetch index.html from ${baseURL}`,
  });

  const matcher = indexPage.data.match(/window._env\s*=\s*"([^"]+)"/);
  const serverConfig = matcher?.[1];
  if (!serverConfig) {
    return null;
  }

  const envInfo: Record<string, string> = JSON.parse(atob(serverConfig));
  logger.debug("Discovered Auth Config", envInfo);

  return envInfo.OIDC_SERVER_URL ?? null;
};

const initAxiosInstance = async (
  axiosInstance: AxiosInstance,
  baseURL?: string,
) => {
  const { data: tokenResponse } = await getToken(baseURL);
  access_token = tokenResponse.access_token;

  // Intercept Requests
  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${access_token}`;
      logger.debug(config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Intercept Responses
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        const { data: refreshedTokenResponse } = await getToken(baseURL);
        access_token = refreshedTokenResponse.access_token;

        const retryCounter = error.config.retryCounter || 1;
        const retryConfig = {
          ...error.config,
          headers: {
            ...error.config.headers,
            Authorization: `Bearer ${access_token}`,
          },
        };

        // Retry limited times
        if (retryCounter < 2) {
          return axios({
            ...retryConfig,
            retryCounter: retryCounter + 1,
          });
        }
      }

      return Promise.reject(error);
    },
  );
};

// Declare the types of your fixtures.
type ApiClientFixture = {
  axios: AxiosInstance;
};

export const test = base.extend<ApiClientFixture>({
  axios: async ({ ignoreHTTPSErrors }, use) => {
    logger.info(`API URL: ${TRUSTIFY_API_URL}`);

    const axiosInstance = axios.create({
      baseURL: TRUSTIFY_API_URL,
      httpsAgent: ignoreHTTPSErrors
        ? new https.Agent({
            rejectUnauthorized: false,
          })
        : undefined,
    });

    if (AUTH_REQUIRED === "true") {
      logger.info("Auth enabled. Initializing configuration");
      await initAxiosInstance(axiosInstance, TRUSTIFY_API_URL);
    }

    await use(axiosInstance);
  },
});

export { expect } from "@playwright/test";
