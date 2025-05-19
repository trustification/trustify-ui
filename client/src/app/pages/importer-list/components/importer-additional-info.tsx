import React from "react";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
} from "@patternfly/react-core";

import type { Importer } from "@app/client";

import { getConfiguration } from "../importer-list";

interface IImporterAdditionalInfoProps {
  importer: Importer;
}

export const ImporterAdditionalInfo: React.FC<IImporterAdditionalInfoProps> = ({
  importer,
}) => {
  const configuration = React.useMemo(() => {
    return getConfiguration(importer);
  }, [importer]);

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Labels</DescriptionListTerm>
          <DescriptionListDescription>
            <List>
              {Object.entries(configuration.configuration.labels ?? {}).map(
                ([k, v]) => (
                  <ListItem key={`${k}: ${v}`}>{`${k}: ${v}`}</ListItem>
                ),
              )}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>V3 signatures</DescriptionListTerm>
          <DescriptionListDescription>
            {configuration.configuration.v3Signatures ? "true" : "false"}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Size limits</DescriptionListTerm>
          <DescriptionListDescription>
            {configuration.configuration.sizeLimit ?? "-"}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Only patterns</DescriptionListTerm>
          <DescriptionListDescription>
            {configuration.configuration.onlyPatterns ?? "-"}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};
