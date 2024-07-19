import { useFetchAdvisoryById } from "@app/queries/advisories";
import { formatDate } from "@app/utils/utils";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";
import React from "react";
import { NavLink } from "react-router-dom";
import { LabelsAsList } from "./LabelsAsList";
import { SeverityShieldAndText } from "./SeverityShieldAndText";
import { LoadingWrapper } from "./LoadingWrapper";

export interface AdvisoryInDrawerInfoProps {
  advisoryId: string;
}

export const AdvisoryInDrawerInfo: React.FC<AdvisoryInDrawerInfoProps> = ({
  advisoryId,
}) => {
  const { advisory, isFetching, fetchError } = useFetchAdvisoryById(advisoryId);

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Identifier</DescriptionListTerm>
          <DescriptionListDescription>
            <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
              <NavLink to={`/advisories/${advisory?.uuid}`}>
                {advisory?.identifier}
              </NavLink>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Severity</DescriptionListTerm>
          <DescriptionListDescription>
            {advisory?.average_severity && (
              <SeverityShieldAndText value={advisory?.average_severity} />
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Title</DescriptionListTerm>
          <DescriptionListDescription>
            {advisory?.title}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Labels</DescriptionListTerm>
          <DescriptionListDescription>
            {advisory?.labels && <LabelsAsList value={advisory?.labels} />}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Published</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(advisory?.published)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Modified</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(advisory?.modified)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Modified</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(advisory?.withdrawn)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Issuer</DescriptionListTerm>
          <DescriptionListDescription>
            {advisory?.issuer?.name}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </LoadingWrapper>
  );
};
