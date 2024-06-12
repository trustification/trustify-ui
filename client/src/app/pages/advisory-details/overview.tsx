import React from "react";

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
  Stack,
  StackItem,
} from "@patternfly/react-core";

import { Advisory } from "@app/api/models";
import { formatDate } from "@app/utils/utils";

interface OverviewProps {
  advisory: Advisory;
}

export const Overview: React.FC<OverviewProps> = ({ advisory }) => {
  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Grid hasGutter>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>General view</CardTitle>
                <CardBody>
                  <DescriptionList>
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
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Issuer</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.issuer?.name}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Website</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.issuer?.website}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
            {/* <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Tracking</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.tracking.status}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Initial release date
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {formatDate(
                          advisory.metadata.tracking.initial_release_date
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Current release date
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {formatDate(
                          advisory.metadata.tracking.current_release_date
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem> */}
          </Grid>
        </StackItem>
        {/* <StackItem>
          <Grid hasGutter>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>References</CardTitle>
                <CardBody>
                  <List>
                    {advisory.metadata.references.map((e, index) => (
                      <ListItem key={index}>
                        <a href={e.url} target="_blank" rel="noreferrer">
                          {e.label || e.url} <ExternalLinkAltIcon />
                        </a>{" "}
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={8}>
              <Card isFullHeight>
                <CardTitle>Product info</CardTitle>
                <CardBody>Remaining to be defined</CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem> */}
      </Stack>
    </>
  );
};
