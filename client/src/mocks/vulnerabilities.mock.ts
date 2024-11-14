import { VulnerabilityDetails } from "@app/client";
import * as actual from "@app/queries/vulnerabilities";
import { vulnerabilitiesPopulated } from "@mocks/data/vulnerabilities/populated";

export * from "@app/queries/vulnerabilities";

// mock implementation for useFetchVulnerabilityById
export const useFetchVulnerabilityById = jest
  .fn((id: string) => {
    return vulnerabilitiesPopulated[id] || actual.useFetchVulnerabilityById(id);
  })
  .mockName("useFetchVulnerabilityById");
