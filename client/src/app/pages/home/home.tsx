import type React from "react";

import { PageSection, Stack, StackItem } from "@patternfly/react-core";

import { MonitoringSection } from "./components/MonitoringSection";
import { WatchedSbomsSection } from "./components/WatchedSbomsSection";
import { WatchedSbomsProvider } from "./watched-sboms-context";

export const Home: React.FC = () => {
  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        <StackItem>
          <MonitoringSection />
        </StackItem>
        <StackItem>
          <WatchedSbomsProvider>
            <WatchedSbomsSection />
          </WatchedSbomsProvider>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
