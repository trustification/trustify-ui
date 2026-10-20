import React from "react";
import {
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

import { PolicyLabel } from "@app/components/PolicyLabel";
import type { CryptoAlgorithm } from "../crypto-context";

interface ICryptoAlgorithmDetailProps {
  algorithm: CryptoAlgorithm;
}

const policyReasonMap: Record<string, { label: string; description: string }> =
  {
    compliant: {
      label: "Post-quantum",
      description: "Post-quantum safe algorithm",
    },
    warning: {
      label: "Classical only",
      description: "Classical algorithm, not post-quantum",
    },
    non_compliant: {
      label: "Weak / broken",
      description: "Weak or broken algorithm",
    },
  };

export const CryptoAlgorithmDetail: React.FC<ICryptoAlgorithmDetailProps> = ({
  algorithm,
}) => {
  const props = algorithm.properties as Record<string, unknown>;
  const ap = (props?.algorithmProperties as Record<string, unknown>) ?? {};
  const rcm =
    (props?.relatedCryptoMaterialProperties as Record<string, unknown>) ?? {};

  const primitive = (ap.primitive as string) ?? undefined;
  const type = (rcm.type as string) ?? undefined;
  const cryptoFunctions = ap.cryptoFunctions as string[] | undefined;
  const parameterSetIdentifier =
    (ap.parameterSetIdentifier as string) ?? undefined;
  const curve = (ap.curve as string) ?? undefined;
  const mode = (ap.mode as string) ?? undefined;
  const padding = (ap.padding as string) ?? undefined;
  const executionEnvironment = (ap.executionEnvironment as string) ?? undefined;
  const implementationPlatform =
    (ap.implementationPlatform as string) ?? undefined;
  const certificationLevel = (ap.certificationLevel as string[]) ?? undefined;
  const classicalSecurityLevel =
    (ap.classicalSecurityLevel as number) ?? undefined;
  const nistQuantumSecurityLevel =
    (ap.nistQuantumSecurityLevel as number) ?? undefined;

  const policyStatus = algorithm.policy_status;
  const reason = policyReasonMap[policyStatus];

  return (
    <Stack hasGutter>
      <StackItem>
        <Card isCompact>
          <CardTitle>Summary</CardTitle>
          <CardBody>
            <DescriptionList isCompact>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {algorithm.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Asset type</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label color="blue">{algorithm.asset_type}</Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
              {algorithm.oid && (
                <DescriptionListGroup>
                  <DescriptionListTerm>OID</DescriptionListTerm>
                  <DescriptionListDescription>
                    {algorithm.oid}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {(primitive || type) && (
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Primitive / material
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <Label color="blue">{primitive ?? type}</Label>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {cryptoFunctions && cryptoFunctions.length > 0 && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Functions</DescriptionListTerm>
                  <DescriptionListDescription>
                    {cryptoFunctions.map((fn) => (
                      <Label key={fn} color="blue" style={{ marginRight: 4 }}>
                        {fn}
                      </Label>
                    ))}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {parameterSetIdentifier && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Parameter set</DescriptionListTerm>
                  <DescriptionListDescription>
                    {parameterSetIdentifier}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {curve && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Curve</DescriptionListTerm>
                  <DescriptionListDescription>
                    {curve}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {mode && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Mode</DescriptionListTerm>
                  <DescriptionListDescription>
                    {mode}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {padding && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Padding</DescriptionListTerm>
                  <DescriptionListDescription>
                    {padding}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>
      </StackItem>

      {(executionEnvironment ||
        implementationPlatform ||
        certificationLevel) && (
        <StackItem>
          <Card isCompact>
            <CardTitle>Environment</CardTitle>
            <CardBody>
              <DescriptionList isCompact>
                {executionEnvironment && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Execution</DescriptionListTerm>
                    <DescriptionListDescription>
                      {executionEnvironment}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {implementationPlatform && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Platform</DescriptionListTerm>
                    <DescriptionListDescription>
                      {implementationPlatform}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {certificationLevel && certificationLevel.length > 0 && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Certification</DescriptionListTerm>
                    <DescriptionListDescription>
                      {certificationLevel.join(", ")}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
      )}

      {(classicalSecurityLevel !== undefined ||
        nistQuantumSecurityLevel !== undefined) && (
        <StackItem>
          <Card isCompact>
            <CardTitle>Security levels</CardTitle>
            <CardBody>
              <DescriptionList isCompact>
                {classicalSecurityLevel !== undefined && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Classical</DescriptionListTerm>
                    <DescriptionListDescription>
                      {classicalSecurityLevel} bits
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                {nistQuantumSecurityLevel !== undefined && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      NIST quantum level
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {nistQuantumSecurityLevel}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
      )}

      <StackItem>
        <Card isCompact>
          <CardTitle>Policy compliance</CardTitle>
          <CardBody>
            <DescriptionList isCompact>
              <DescriptionListGroup>
                <DescriptionListTerm>Overall</DescriptionListTerm>
                <DescriptionListDescription>
                  <PolicyLabel policyStatus={policyStatus} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              {reason && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Reason</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Label
                      color={
                        policyStatus === "compliant"
                          ? "green"
                          : policyStatus === "non_compliant"
                            ? "red"
                            : "orange"
                      }
                    >
                      {reason.label}
                    </Label>{" "}
                    {reason.description}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};
