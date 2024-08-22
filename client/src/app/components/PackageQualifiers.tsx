import React from "react";

import { Label } from "@patternfly/react-core";

interface PackageQualifiersProps {
  value: { [key: string]: string };
}

export const PackageQualifiers: React.FC<PackageQualifiersProps> = ({
  value,
}) => {
  return (
    <>
      {Object.entries(value).map(([k, v], index) => (
        <Label key={index} isCompact>{`${k}=${v}`}</Label>
      ))}
    </>
  );
};
