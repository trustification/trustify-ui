import type React from "react";

import { Content } from "@patternfly/react-core";

import type { Importer } from "@app/client";
import {
  type IPageDrawerContentProps,
  PageDrawerContent,
} from "@app/components/PageDrawerContext";

import { ImporterExecutions } from "./importer-executions";

export interface IImporterDetailDrawerProps
  extends Pick<IPageDrawerContentProps, "onCloseClick"> {
  importer: Importer | null;
}

export const ImporterDetailDrawer: React.FC<IImporterDetailDrawerProps> = ({
  importer,
  onCloseClick,
}) => {
  return (
    <PageDrawerContent
      isExpanded={!!importer}
      onCloseClick={onCloseClick}
      focusKey={importer?.name}
      pageKey="importer-details"
      defaultSize="700px"
      header={
        <Content>
          <h2>{importer?.name}</h2>
        </Content>
      }
    >
      <div>{importer && <ImporterExecutions importer={importer} />}</div>
    </PageDrawerContent>
  );
};
