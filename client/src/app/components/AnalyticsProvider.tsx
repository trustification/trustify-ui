import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useLocation } from "react-router";

import { isAuthRequired } from "@app/Constants";
import { analyticsSettings } from "@app/analytics";
import ENV from "@app/env";
import { AnalyticsBrowser } from "@segment/analytics-next";

const contextDefaultValue = {} as AnalyticsBrowser;

const AnalyticsContext =
  React.createContext<AnalyticsBrowser>(contextDefaultValue);

interface IAnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<IAnalyticsProviderProps> = ({
  children,
}) => {
  return ENV.ANALYTICS_ENABLED !== "true" ? (
    <>{children}</>
  ) : (
    <AnalyticsContextProvider>{children}</AnalyticsContextProvider>
  );
};

export const AnalyticsContextProvider: React.FC<IAnalyticsProviderProps> = ({
  children,
}) => {
  const auth = (isAuthRequired && useAuth()) || undefined;
  const analytics = React.useMemo(() => {
    return AnalyticsBrowser.load(analyticsSettings);
  }, []);

  // Identify
  useEffect(() => {
    if (auth) {
      const claims = auth.user?.profile;
      analytics.identify(claims?.sub, {
        // biome-ignore lint/suspicious/noExplicitAny:
        organization_id: ((claims as any)?.organization as any)?.id,
        domain: claims?.email?.split("@")[1],
      });
    }
  }, [auth, analytics]);

  // Watch navigation
  const location = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: required to track page changes
  useEffect(() => {
    analytics.page();
  }, [analytics, location]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
