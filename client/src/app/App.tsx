import "./App.css";
import "./tailwind.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { DefaultLayout } from "./layout";
import { AppRoutes } from "./Routes";
import { NotificationsProvider } from "./components/NotificationsContext";
import { AnalyticsProvider } from "./components/AnalyticsProvider";

import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import { AIAssistantProvider } from "./components/ai-assistant";

const App: React.FC = () => {
  return (
    <Router>
      <AnalyticsProvider>
        <NotificationsProvider>
          <AIAssistantProvider>
            <DefaultLayout>
              <AppRoutes />
            </DefaultLayout>
          </AIAssistantProvider>
        </NotificationsProvider>
      </AnalyticsProvider>
    </Router>
  );
};

export default App;
