import React from "react";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

import { DecomposedPurl } from "@app/api/models";

import { PackageQualifiers } from "./PackageQualifiers";

export interface PackageInDrawerInfoProps {
  decomposedPurl: DecomposedPurl;
}

export const PackageInDrawerInfo: React.FC<PackageInDrawerInfoProps> = ({
  decomposedPurl,
}) => {
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>
          {decomposedPurl.name}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Namespace</DescriptionListTerm>
        <DescriptionListDescription>
          {decomposedPurl.namespace}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Type</DescriptionListTerm>
        <DescriptionListDescription>
          {decomposedPurl.type}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {decomposedPurl.version && (
        <DescriptionListGroup>
          <DescriptionListTerm>Version</DescriptionListTerm>
          <DescriptionListDescription>
            {decomposedPurl.version}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {decomposedPurl.path && (
        <DescriptionListGroup>
          <DescriptionListTerm>Path</DescriptionListTerm>
          <DescriptionListDescription>
            {decomposedPurl.path}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {decomposedPurl.qualifiers && (
        <DescriptionListGroup>
          <DescriptionListTerm>Qualifiers</DescriptionListTerm>
          <DescriptionListDescription>
            <PackageQualifiers value={decomposedPurl.qualifiers} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );
};
