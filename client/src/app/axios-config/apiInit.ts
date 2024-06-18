import axios from "axios";
import { User, UserManager } from "oidc-client-ts";

import { OIDC_CLIENT_ID, OIDC_SERVER_URL, oidcClientSettings } from "@app/oidc";

function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${OIDC_SERVER_URL}:${OIDC_CLIENT_ID}`
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export const initInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = getUser();
      const token = user?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        const userManager = new UserManager(oidcClientSettings);
        try {
          const refreshedUser = await userManager.signinSilent();
          const access_token = refreshedUser?.access_token;
          const retryConfig = {
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: `Bearer ${access_token}`,
            },
          };
          return axios(retryConfig);
        } catch (refreshError) {
          await userManager.signoutRedirect();
        }
      }

      return Promise.reject(error);
    }
  );
};
