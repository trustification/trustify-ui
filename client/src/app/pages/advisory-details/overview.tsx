import React from "react";

import prettyBytes from "pretty-bytes";

import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "@patternfly/react-core";
import PenIcon from "@patternfly/react-icons/dist/esm/icons/pen-icon";

import type { AdvisorySummary } from "@app/client";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { formatDate } from "@app/utils/utils";

import { AdvisoryEditLabelsForm } from "../advisory-list/components/AdvisoryEditLabelsForm";

interface InfoProps {
  advisory: AdvisorySummary;
}

export const Overview: React.FC<InfoProps> = ({ advisory }) => {
  const [showEditLabels, setShowEditLabels] = React.useState(false);

  const closeEditLabelsModal = () => {
    setShowEditLabels(false);
  };

  return (
    <>
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
                  <DescriptionListTerm>Size</DescriptionListTerm>
                  <DescriptionListDescription>
                    {prettyBytes(advisory.size)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Labels {""}
                    <Button
                      variant={ButtonVariant.link}
                      size="sm"
                      icon={<PenIcon />}
                      iconPosition="end"
                      onClick={() => setShowEditLabels(true)}
                    >
                      Edit
                    </Button>
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <Card isCompact>
                      <CardBody>
                        {advisory.labels && (
                          <LabelsAsList defaultIsOpen value={advisory.labels} />
                        )}
                      </CardBody>
                    </Card>
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
                  <DescriptionListTerm>
                    Initial release date
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {formatDate(advisory.published)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Current release date
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {formatDate(advisory.modified)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Modal
        isOpen={showEditLabels}
        variant="medium"
        title="Edit labels"
        onClose={closeEditLabelsModal}
      >
        <ModalHeader title="Edit labels" />
        <ModalBody>
          <AdvisoryEditLabelsForm
            advisory={advisory}
            onClose={closeEditLabelsModal}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
