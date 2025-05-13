import React from "react";

import { Content, Tab, TabTitleText, Tabs } from "@patternfly/react-core";

import type { Importer } from "@app/client";
import {
  type IPageDrawerContentProps,
  PageDrawerContent,
} from "@app/components/PageDrawerContext";

import { ImporterAdditionalInfo } from "./importer-additional-info";
import { ImporterExecutions } from "./importer-executions";

export interface IImporterDetailDrawerProps
  extends Pick<IPageDrawerContentProps, "onCloseClick"> {
  importer: Importer | null;
}

export enum TabKey {
  Executions = 0,
  AdditionalInfo = 1,
}

export const ImporterDetailDrawer: React.FC<IImporterDetailDrawerProps> = ({
  importer,
  onCloseClick,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>(
    TabKey.Executions,
  );

  return (
    <PageDrawerContent
      isExpanded={!!importer}
      onCloseClick={onCloseClick}
      focusKey={importer?.name}
      pageKey="importer-details"
      header={
        <Content>
          <small>Name</small>
          <h2>{importer?.name}</h2>
        </Content>
      }
    >
      <div>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabKey) => setActiveTabKey(tabKey as TabKey)}
        >
          {!importer ? null : (
            <Tab
              eventKey={TabKey.Executions}
              title={<TabTitleText>Executions</TabTitleText>}
            >
              <ImporterExecutions importer={importer} />
            </Tab>
          )}

          {!importer ? null : (
            <Tab
              eventKey={TabKey.AdditionalInfo}
              title={<TabTitleText>Additional info</TabTitleText>}
            >
              <ImporterAdditionalInfo importer={importer} />
            </Tab>
          )}
        </Tabs>
      </div>
    </PageDrawerContent>
  );
};
