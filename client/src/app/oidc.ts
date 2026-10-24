import type { OidcClientSettings } from "oidc-client-ts";

import { isAuthServerEmbedded } from "./Constants";
import ENV from "./env";

export const OIDC_SERVER_URL = isAuthServerEmbedded
  ? ENV.OIDC_SERVER_EMBEDDED_PATH || "/auth/realms/trustify"
  : ENV.OIDC_SERVER_URL || "http://localhost:8090/realms/trustify";
export const OIDC_CLIENT_ID = ENV.OIDC_CLIENT_ID || "frontend";
const OIDC_LOAD_USER = ENV.OIDC_LOAD_USER === "true";

// Cognito requires client_id + logout_uri.
// Keycloak ignores both (uses id_token_hint + post_logout_redirect_uri added by oidc-client-ts instead) and follows the OIDC RP-Initiated Logout spec.
export const oidcSignoutArgs = {
  extraQueryParams: {
    client_id: OIDC_CLIENT_ID,
    logout_uri: window.location.origin,
  },
};

export const oidcClientSettings: OidcClientSettings = {
  authority: OIDC_SERVER_URL,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  response_type: "code",
  loadUserInfo: OIDC_LOAD_USER,
  scope: ENV.OIDC_SCOPE || "openid",
};
