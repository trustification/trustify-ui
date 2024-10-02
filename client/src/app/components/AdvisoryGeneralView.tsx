import React from "react";

import { AdvisorySummary } from "@app/client";
import { formatDate } from "@app/utils/utils";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListProps,
  DescriptionListTerm,
} from "@patternfly/react-core";

type FIELDS = "title" | "published" | "modified" | "withdrawn";

interface AdvisoryGeneralViewProps {
  advisory: AdvisorySummary;
  excludedFields?: FIELDS[];
  descriptionListProps?: DescriptionListProps;
}

export const AdvisoryGeneralView: React.FC<AdvisoryGeneralViewProps> = ({
  advisory: value,
  excludedFields = [],
  descriptionListProps,
}) => {
  return (
    <DescriptionList {...descriptionListProps}>
      {!excludedFields.includes("title") && (
        <DescriptionListGroup>
          <DescriptionListTerm>Title</DescriptionListTerm>
          <DescriptionListDescription>{value.title}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {!excludedFields.includes("published") && (
        <DescriptionListGroup>
          <DescriptionListTerm>Published</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(value.published)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {!excludedFields.includes("modified") && (
        <DescriptionListGroup>
          <DescriptionListTerm>Modified</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(value.modified)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {!excludedFields.includes("withdrawn") && (
        <DescriptionListGroup>
          <DescriptionListTerm>Withdrawn</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(value.withdrawn)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );
};
