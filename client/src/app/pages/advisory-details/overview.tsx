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

import dayjs from "dayjs";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { Advisory } from "@app/api/models";

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
                        {dayjs(advisory.published).format(RENDER_DATE_FORMAT)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Modified</DescriptionListTerm>
                      <DescriptionListDescription>
                        {dayjs(advisory.modified).format(RENDER_DATE_FORMAT)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>

                    <p style={{ color: "red" }}>
                      Is this all the metadata we intent to expose?
                    </p>

                    {/* <DescriptionListGroup>
                      <DescriptionListTerm>Category</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.category}
                      </DescriptionListDescription>
                    </DescriptionListGroup> */}
                    {/* <DescriptionListGroup>
                      <DescriptionListTerm>
                        Aggregate severity
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <SeverityShieldAndText
                          value={advisory.severity}
                        />
                      </DescriptionListDescription>
                    </DescriptionListGroup> */}
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
            {/* <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Publisher</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.publisher.name}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Namespace</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.publisher.namespace}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Contact details</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.publisher.contact_details}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Issuing authority
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.metadata.publisher.issuing_authority}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem> */}
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
                        {dayjs(
                          advisory.metadata.tracking.initial_release_date
                        ).format(RENDER_DATE_FORMAT)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Current release date
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {dayjs(
                          advisory.metadata.tracking.current_release_date
                        ).format(RENDER_DATE_FORMAT)}
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
