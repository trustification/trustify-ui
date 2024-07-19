import React from "react";
import { NavLink } from "react-router-dom";

import { formatDate } from "@app/utils/utils";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";

import { useFetchSBOMById } from "@app/queries/sboms";

import { LabelsAsList } from "./LabelsAsList";
import { LoadingWrapper } from "./LoadingWrapper";

export interface SbomInDrawerInfoProps {
  sbomId: string;
}

export const SbomInDrawerInfo: React.FC<SbomInDrawerInfoProps> = ({
  sbomId,
}) => {
  const { sbom, isFetching, fetchError } = useFetchSBOMById(sbomId);

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>
            <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
              <NavLink to={`/sboms/${sbomId}`}>{sbom?.name}</NavLink>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Published</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(sbom?.published)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Labels</DescriptionListTerm>
          <DescriptionListDescription>
            {sbom?.labels && (
              <LabelsAsList defaultIsOpen value={sbom?.labels} />
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </LoadingWrapper>
  );
};
