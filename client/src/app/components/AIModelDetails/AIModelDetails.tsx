import type React from "react";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";

import type { SbomModel } from "@app/client";

import { getModelProperties } from "./utils";

interface ExternalReference {
  type: string;
  url: string;
  comment?: string;
}

const parseExternalReferences = (json?: string): ExternalReference[] => {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface IAIModelDetailsProps {
  model: SbomModel;
}

export const AIModelDetails: React.FC<IAIModelDetailsProps> = ({ model }) => {
  const props = getModelProperties(model.properties);
  const externalRefs = parseExternalReferences(props.external_references);

  return (
    <Stack hasGutter>
      <StackItem>
        <Card isCompact>
          <CardTitle>Identity & Purpose</CardTitle>
          <CardBody>
            <DescriptionList
              isCompact
              columnModifier={{
                default: "2Col",
              }}
            >
              {props.typeOfModel && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Model type</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.typeOfModel}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.primaryPurpose && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Primary purpose</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Label color="blue">{props.primaryPurpose}</Label>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.licenses && (
                <DescriptionListGroup>
                  <DescriptionListTerm>License</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.licenses}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.suppliedBy && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Supplied by</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.suppliedBy}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>
      </StackItem>

      <StackItem>
        <Card isCompact>
          <CardTitle>SBOM Metadata</CardTitle>
          <CardBody>
            <DescriptionList
              isCompact
              columnModifier={{
                default: "2Col",
              }}
            >
              {props.bomFormat && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Format</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.bomFormat}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.specVersion && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Spec version</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.specVersion}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.serialNumber && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Serial number</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.serialNumber}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {props.version && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Manifest version</DescriptionListTerm>
                  <DescriptionListDescription>
                    {props.version}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>
      </StackItem>

      {externalRefs.length > 0 && (
        <StackItem>
          <Card isCompact>
            <CardTitle>External References</CardTitle>
            <CardBody>
              <DescriptionList isCompact>
                {externalRefs.map((ref) => (
                  <DescriptionListGroup key={`${ref.type}-${ref.url}`}>
                    <DescriptionListTerm>{ref.type}</DescriptionListTerm>
                    <DescriptionListDescription>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ref.comment || ref.url} <ExternalLinkAltIcon />
                      </a>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
      )}

      {props.downloadLocation && (
        <StackItem>
          <Button
            variant="secondary"
            component="a"
            href={props.downloadLocation}
            target="_blank"
            rel="noopener noreferrer"
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
          >
            Download
          </Button>
        </StackItem>
      )}
    </Stack>
  );
};
