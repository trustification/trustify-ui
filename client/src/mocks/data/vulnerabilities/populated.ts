import getCves from "@mocks/data/cves/list/01.json";

// Define the expected data structure for vulnerabilities
type Vulnerability = {
  id: string;
};

// Use Record for a cleaner definition
export const vulnerabilitiesPopulated: Record<string, Vulnerability> = {
  "CVE-X": {
    id: "",
  },
};
