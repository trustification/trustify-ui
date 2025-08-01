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
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "@patternfly/react-core";
import PenIcon from "@patternfly/react-icons/dist/esm/icons/pen-icon";

import type { SbomSummary } from "@app/client";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { formatDate } from "@app/utils/utils";

import { SBOMEditLabelsForm } from "../sbom-list/components/SBOMEditLabelsForm";

interface InfoProps {
  sbom: SbomSummary;
}

export const Overview: React.FC<InfoProps> = ({ sbom }) => {
  const [showEditLabels, setShowEditLabels] = React.useState(false);

  const closeEditLabelsModal = () => {
    setShowEditLabels(false);
  };

  return (
    <>
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
                    {sbom.suppliers}
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
                        {sbom.labels && (
                          <LabelsAsList defaultIsOpen value={sbom.labels} />
                        )}
                      </CardBody>
                    </Card>
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
                        .map((e) => (
                          <ListItem key={e}>{e}</ListItem>
                        ))}
                      {sbom.described_by
                        .flatMap((e) => e.purl)
                        .map((e) => (
                          <ListItem key={e.uuid}>{e.purl}</ListItem>
                        ))}
                    </List>
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
        onClose={closeEditLabelsModal}
      >
        <ModalHeader title="Edit labels" />
        <ModalBody>
          <SBOMEditLabelsForm sbom={sbom} onClose={closeEditLabelsModal} />
        </ModalBody>
      </Modal>
    </>
  );
};
