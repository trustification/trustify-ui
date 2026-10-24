import type React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

import { ThemeProvider, type ThemeMode } from "@app/components/Theme";

import { useLocalStorage } from "@app/hooks/useStorage";

import { NotificationsProvider } from "./components/NotificationsContext";
import { ReadOnlyProvider } from "./components/ReadOnlyContext";
import { DefaultLayout } from "./layout";

import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/patternfly-charts.css";

const STORAGE_KEY = "theme-preference";

const App: React.FC = () => {
  const [mode, setMode] = useLocalStorage<ThemeMode>({
    key: STORAGE_KEY,
    defaultValue: "system",
  });

  return (
    <ThemeProvider mode={mode} setMode={setMode}>
      <ReadOnlyProvider>
        <NotificationsProvider>
          <DefaultLayout>
            <Outlet />
          </DefaultLayout>
        </NotificationsProvider>
      </ReadOnlyProvider>
    </ThemeProvider>
  );
};

export default App;
