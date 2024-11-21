import React, { Suspense } from "react";

import { AuthProvider, useAuth } from "react-oidc-context";

import { initInterceptors } from "@app/axios-config";
import ENV from "@app/env";
import { oidcClientSettings } from "@app/oidc";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { global_danger_color_200 as globalDangerColor200 } from "@patternfly/react-tokens";

import { AppPlaceholder } from "./AppPlaceholder";

interface IOidcProviderProps {
  children: React.ReactNode;
}

export const OidcProvider: React.FC<IOidcProviderProps> = ({ children }) => {
  return ENV.AUTH_REQUIRED !== "true" ? (
    <>{children}</>
  ) : (
    <AuthProvider
      {...oidcClientSettings}
      automaticSilentRenew={true}
      onSigninCallback={() =>
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      }
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
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error]);

  React.useEffect(() => {
    initInterceptors();
  }, []);

  if (auth.isAuthenticated) {
    return <Suspense fallback={<AppPlaceholder />}>{children}</Suspense>;
  } else if (auth.isLoading) {
    return <AppPlaceholder />;
  } else if (auth.error) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateIcon
            icon={ExclamationCircleIcon}
            color={globalDangerColor200.value}
          />
          <Title headingLevel="h2" size="lg">
            Auth Error
          </Title>
          <EmptyStateBody>
            {`${auth.error.name}: ${auth.error.message}`}. Revisit your OIDC
            configuration or contact your admin.
          </EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  } else {
    return <p>Login in...</p>;
  }
};
