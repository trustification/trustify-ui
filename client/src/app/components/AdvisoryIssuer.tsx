import React from "react";

import { AdvisorySummary } from "@app/client";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

interface AdvisoryIssuerProps {
  value: AdvisorySummary;
}

export const AdvisoryIssuer: React.FC<AdvisoryIssuerProps> = ({ value }) => {
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>
          {value.issuer?.name}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Website</DescriptionListTerm>
        <DescriptionListDescription>
          {value.issuer?.website}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
