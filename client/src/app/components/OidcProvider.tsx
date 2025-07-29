import React, { Suspense } from "react";

import { AuthProvider, useAuth } from "react-oidc-context";

import { initInterceptors } from "@app/axios-config";
import ENV from "@app/env";
import { oidcClientSettings } from "@app/oidc";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";

import { AppPlaceholder } from "./AppPlaceholder";

interface IOidcProviderProps {
  children: React.ReactNode;
}

export const OidcProvider: React.FC<IOidcProviderProps> = ({ children }) => {
  return ENV.AUTH_REQUIRED !== "true" ? (
    children
  ) : (
    <AuthProvider
      {...oidcClientSettings}
      automaticSilentRenew={true}
      onSigninCallback={() => {
        const params = new URLSearchParams(window.location.search);
        const relativePath = params.get("state")?.split(";")?.[1];
        window.history.replaceState({}, document.title, relativePath ?? "/");
      }}
    >
      <AuthEnabledOidcProvider>{children}</AuthEnabledOidcProvider>
    </AuthProvider>
  );
};

const AuthEnabledOidcProvider: React.FC<IOidcProviderProps> = ({
  children,
}) => {
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading && !auth.error) {
      auth.signinRedirect({
        url_state: window.location.pathname,
      });
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error, auth.signinRedirect]);

  React.useEffect(() => {
    initInterceptors();
  }, []);

  if (auth.isAuthenticated) {
    return <Suspense fallback={<AppPlaceholder />}>{children}</Suspense>;
  }
  if (auth.isLoading) {
    return <AppPlaceholder />;
  }
  if (auth.error) {
    return (
      <Bullseye>
        <EmptyState
          status="danger"
          titleText="Auth Error"
          headingLevel="h4"
          icon={ExclamationCircleIcon}
          variant={EmptyStateVariant.sm}
        >
          <EmptyStateBody>
            {`${auth.error.name}: ${auth.error.message}`}. Revisit your OIDC
            configuration or contact your admin.
          </EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }
  return <p>Login in...</p>;
};
