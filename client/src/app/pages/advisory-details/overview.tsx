import React from "react";

import prettyBytes from "pretty-bytes";

import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
} from "@patternfly/react-core";

import { AdvisorySummary, Severity } from "@app/client";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { formatDate } from "@app/utils/utils";

interface InfoProps {
  advisory: AdvisorySummary;
}

export const Overview: React.FC<InfoProps> = ({ advisory }) => {
  return (
    <Grid hasGutter>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Overview</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Title</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.title}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.labels.type}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Aggregate Severity</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.average_severity && (
                    <SeverityShieldAndText
                      value={advisory.average_severity as Severity}
                    />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Size</DescriptionListTerm>
                <DescriptionListDescription>
                  {prettyBytes(advisory.size)}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Publisher</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.issuer?.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Contact details</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.issuer?.website}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Tracking</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>ID</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.identifier}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Initial release date</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(advisory.published)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Current release date</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(advisory.modified)}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
