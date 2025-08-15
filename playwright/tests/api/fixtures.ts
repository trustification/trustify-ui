import { test as base, expect } from "@playwright/test";
import axios, { type AxiosInstance } from "axios";
import https from "node:https";

import { logger } from "../common/constants";

let access_token = "";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

const getToken = async (baseURL?: string) => {
  let authUrl: string | null = null;
  if (process.env.TRUSTIFY_AUTH_URL) {
    authUrl = process.env.TRUSTIFY_AUTH_URL;
  } else if (baseURL) {
    authUrl = await discoverTokenEndpoint(axios, baseURL);
  }

  expect(
    authUrl,
    "TRUSTIFY_AUTH_URL was not set and couldn't be discovered",
  ).not.toBeNull();

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
  data.append("client_id", process.env.TRUSTIFY_AUTH_CLIENT_ID ?? "cli");
  data.append(
    "client_secret",
    process.env.TRUSTIFY_AUTH_CLIENT_SECRET ?? "secret",
  );

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
  const indexPage = await axios.get<string>(baseURL, {
    maxRedirects: 0,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
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
  axios: async ({ baseURL, ignoreHTTPSErrors }, use) => {
    const axiosInstance = axios.create({
      baseURL,
      httpsAgent: ignoreHTTPSErrors
        ? new https.Agent({
            rejectUnauthorized: false,
          })
        : undefined,
    });

    if (process.env.TRUSTIFY_AUTH_ENABLED === "true") {
      await initAxiosInstance(axiosInstance, baseURL);
    }

    await use(axiosInstance);
  },
});

export { expect } from "@playwright/test";
