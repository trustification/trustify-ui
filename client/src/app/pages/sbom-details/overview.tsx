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
  List,
  ListItem,
} from "@patternfly/react-core";

import { SbomSummary } from "@app/client";
import { formatDate } from "@app/utils/utils";

interface InfoProps {
  sbom: SbomSummary;
}

export const Overview: React.FC<InfoProps> = ({ sbom }) => {
  return (
    <Grid hasGutter>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Metadata</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.document_id}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Creation</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(sbom.published)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>License List Version</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.data_licenses.join(", ")}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Creator</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.authors}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Statistics</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Size</DescriptionListTerm>
                <DescriptionListDescription>
                  {prettyBytes(sbom.size)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Packages</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.number_of_packages}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
