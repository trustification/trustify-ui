import axios from "axios";
import { User } from "oidc-client-ts";

import { OIDC_CLIENT_ID, OIDC_SERVER_URL } from "@app/oidc";

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
};
