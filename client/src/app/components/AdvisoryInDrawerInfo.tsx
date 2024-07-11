import { AdvisoryWithinVulnerability } from "@app/api/models";
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
import { SeverityShieldAndText } from "./SeverityShieldAndText";

export interface AdvisoryInDrawerInfoProps {
  advisory: AdvisoryWithinVulnerability;
}

export const AdvisoryInDrawerInfo: React.FC<AdvisoryInDrawerInfoProps> = ({
  advisory,
}) => {
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Identifier</DescriptionListTerm>
        <DescriptionListDescription>
          <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
            <NavLink to={`/advisories/${advisory.uuid}`}>
              {advisory.identifier}
            </NavLink>
          </Button>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Severity</DescriptionListTerm>
        <DescriptionListDescription>
          {advisory.severity && (
            <SeverityShieldAndText value={advisory.severity} />
          )}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Title</DescriptionListTerm>
        <DescriptionListDescription>
          {advisory.title}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Published</DescriptionListTerm>
        <DescriptionListDescription>
          {formatDate(advisory.published)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Modified</DescriptionListTerm>
        <DescriptionListDescription>
          {formatDate(advisory.modified)}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
