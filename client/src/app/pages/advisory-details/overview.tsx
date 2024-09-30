import React from "react";

import { AxiosError } from "axios";

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
  FormGroup,
  Grid,
  GridItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import PenIcon from "@patternfly/react-icons/dist/esm/icons/pen-icon";

import { AdvisoryDetails } from "@app/client";
import { AdvisoryGeneralView } from "@app/components/AdvisoryGeneralView";
import { AdvisoryIssuer } from "@app/components/AdvisoryIssuer";
import { EditLabelsModal } from "@app/components/EditLabelsModal";
import { LabelsAsList } from "@app/components/LabelsAsList";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { useUpdateAdvisoryLabelsMutation } from "@app/queries/advisories";

interface OverviewProps {
  advisory: AdvisoryDetails;
}

export const Overview: React.FC<OverviewProps> = ({ advisory }) => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const [showEditLabels, setShowEditLabels] = React.useState(false);

  const onUpdateLabelsError = (_error: AxiosError) => {
    pushNotification({
      title: "Error while updating labels",
      variant: "danger",
    });
  };

  const { mutate: updateAdvisoryLabels } = useUpdateAdvisoryLabelsMutation(
    () => {},
    onUpdateLabelsError
  );

  const execSaveLabels = (labels: { [key: string]: string }) => {
    updateAdvisoryLabels({ ...advisory, labels });
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Grid hasGutter>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>General view</CardTitle>
                <CardBody>
                  <AdvisoryGeneralView advisory={advisory} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Issuer</CardTitle>
                <CardBody>
                  <AdvisoryIssuer value={advisory} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>System</CardTitle>
                <CardBody>
                  <DescriptionList>
                    {/* <DescriptionListGroup>
                      <DescriptionListTerm>Hashes</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.hashes && (
                          <HashesAsList value={advisory.hashes} />
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup> */}
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
                        <div className="pf-v5-c-form">
                          <FormGroup>
                            <div
                              className="pf-v5-c-form-control"
                              style={{ padding: 10 }}
                            >
                              {advisory.labels && (
                                <LabelsAsList
                                  defaultIsOpen
                                  value={advisory.labels}
                                />
                              )}
                            </div>
                          </FormGroup>
                        </div>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem>
      </Stack>

      {showEditLabels && (
        <EditLabelsModal
          resourceName={advisory.identifier}
          value={advisory.labels ?? {}}
          onSave={(labels) => {
            execSaveLabels(labels);

            setShowEditLabels(false);
          }}
          onClose={() => setShowEditLabels(false)}
        />
      )}
    </>
  );
};
