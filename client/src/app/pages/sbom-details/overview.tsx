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
                <DescriptionListDescription aria-label="SBOM's name">
                  {sbom.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription aria-label="SBOM's namespace">
                  {sbom.document_id}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Data License</DescriptionListTerm>
                <DescriptionListDescription aria-label="SBOM's license">
                  {sbom.data_licenses.join(", ")}
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
                <DescriptionListDescription aria-label="SBOM's creation date">
                  {formatDate(sbom.published)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Creator</DescriptionListTerm>
                <DescriptionListDescription aria-label="SBOM's creator">
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
      <GridItem md={12}>
        <Card isFullHeight>
          <CardTitle>Package</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Version</DescriptionListTerm>
                <DescriptionListDescription>
                  {sbom.described_by.map((e) => e.version).join(", ")}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>External References</DescriptionListTerm>
                <DescriptionListDescription>
                  <List>
                    {sbom.described_by
                      .flatMap((e) => e.cpe)
                      .map((e, index) => (
                        <ListItem key={index}>{e}</ListItem>
                      ))}
                    <ListItem>
                      {sbom.described_by
                        .flatMap((e) => e.purl)
                        .map((e) => e.purl)}
                    </ListItem>
                  </List>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
