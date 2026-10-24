import React from "react";

import {
  compareByScoreTypeFn,
  extractPriorityItemBasedOnScoresType,
} from "@app/api/model-utils";
import {
  type ExtendedSeverity,
  type VulnerabilityStatus,
  extendedSeverityFromSeverity,
} from "@app/api/models";
import type {
  AdvisoryHead,
  BaseScore,
  PurlSummary,
  SbomAdvisory,
  SbomPackage,
  SbomStatus,
  ScoredVector,
} from "@app/client";
import { useFetchSbomsAdvisory } from "@app/queries/sboms";

const areVulnerabilityOfSbomEqual = (
  a: VulnerabilityOfSbom,
  b: VulnerabilityOfSbom | FlatVulnerabilityOfSbom,
) => {
  return (
    a.vulnerability.identifier === b.vulnerability.identifier &&
    a.vulnerabilityStatus === b.vulnerabilityStatus
  );
};

interface FlatVulnerabilityOfSbom {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  advisory: AdvisoryHead;
  packages: SbomPackage[];
  base_score: BaseScore | null;
  scores: ScoredVector[];
}

type AdvisoryFromAnalysis = {
  advisory: AdvisoryHead;
  base_score: BaseScore | null;
  scores: ScoredVector[];
  opinionatedScore: ScoredVector | null;
  opinionatedExtendedSeverity: ExtendedSeverity;
};

type PurlAnalysis =
  | { isOrphan: true; parentName: string }
  | { isOrphan: false; purlSummary: PurlSummary };

interface VulnerabilityOfSbom {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  advisories: Map<string, AdvisoryFromAnalysis>;
  purls: Map<string, PurlAnalysis>;
  opinionatedAdvisory: {
    advisory: AdvisoryHead | null;
    score: ScoredVector | null;
    extendedSeverity: ExtendedSeverity;
  };
}

export type SeveritySummary = {
  total: number;
  severities: { [key in ExtendedSeverity]: number };
};

export interface VulnerabilityOfSbomSummary {
  vulnerabilityStatus: {
    [key in VulnerabilityStatus]: SeveritySummary;
  };
}

const DEFAULT_SEVERITY: SeveritySummary = {
  total: 0,
  severities: { unknown: 0, none: 0, low: 0, medium: 0, high: 0, critical: 0 },
};

export const DEFAULT_SUMMARY: VulnerabilityOfSbomSummary = {
  vulnerabilityStatus: {
    affected: { ...DEFAULT_SEVERITY },
    fixed: { ...DEFAULT_SEVERITY },
    not_affected: { ...DEFAULT_SEVERITY },
    known_not_affected: { ...DEFAULT_SEVERITY },
    under_investigation: { ...DEFAULT_SEVERITY },
  },
};

const enrichPurlMapWithPackages = (
  purls: Map<string, PurlAnalysis>,
  packages: SbomPackage[],
) => {
  const packagePurls = packages.flatMap((pkg) => {
    const hasNoPurlsButOnlyName = pkg.name && pkg.purl.length === 0;
    const result: PurlAnalysis[] = hasNoPurlsButOnlyName
      ? [
          {
            isOrphan: true,
            parentName: pkg.name,
          },
        ]
      : pkg.purl.map((p) => ({
          isOrphan: false,
          purlSummary: p,
        }));
    return result;
  });
  packagePurls.forEach((item) => {
    if (item.isOrphan) {
      purls.set(item.parentName, item);
    } else {
      purls.set(item.purlSummary.uuid, item);
    }
  });
};

const advisoryToModels = (advisories: SbomAdvisory[]) => {
  const vulnerabilities = advisories
    .flatMap((advisory) => {
      return (advisory.status ?? []).map((sbomStatus) => {
        const result: FlatVulnerabilityOfSbom = {
          vulnerability: sbomStatus,
          vulnerabilityStatus: sbomStatus.status as VulnerabilityStatus,
          advisory: advisory,
          packages: sbomStatus.packages,
          base_score: sbomStatus.base_score ?? null,
          scores: sbomStatus.scores || [],
        };
        return result;
      });
    })
    // group
    .reduce((prev, current) => {
      const existingElement = prev.find((item) => {
        return areVulnerabilityOfSbomEqual(item, current);
      });

      let result: VulnerabilityOfSbom[];

      if (existingElement) {
        const arrayWithoutExistingItem = prev.filter(
          (item) => !areVulnerabilityOfSbomEqual(item, existingElement),
        );

        const score = extractPriorityItemBasedOnScoresType(
          current.scores,
          (item) => item.type,
        );
        const extendedSeverity = extendedSeverityFromSeverity(score?.severity);

        // new advisories
        const advisories = new Map<string, AdvisoryFromAnalysis>(
          existingElement.advisories,
        );
        advisories.set(current.advisory.identifier, {
          advisory: current.advisory,
          base_score: current.base_score,
          scores: current.scores,
          opinionatedScore: score,
          opinionatedExtendedSeverity: extendedSeverity,
        });

        // new purls
        const purls = new Map<string, PurlAnalysis>(existingElement.purls);
        enrichPurlMapWithPackages(purls, current.packages);

        // new opinionated advisory
        let opinionatedAdvisory: AdvisoryHead | null;
        let opinionatedScore: ScoredVector | null;
        if (existingElement.opinionatedAdvisory.score?.type !== score?.type) {
          const preferedAdvisoryScore = [
            {
              advisory: existingElement.opinionatedAdvisory.advisory,
              score: existingElement.opinionatedAdvisory.score,
            },
            {
              advisory: current.advisory,
              score: score,
            },
          ].sort(compareByScoreTypeFn((item) => item.score?.type ?? null))[0];

          opinionatedAdvisory = preferedAdvisoryScore.advisory;
          opinionatedScore = preferedAdvisoryScore.score;
        } else {
          const {
            advisory: newOpinionatedAdvisory,
            score: newOpinionatedScore,
          } =
            (score?.value ?? 0) >
            (existingElement.opinionatedAdvisory.score?.value ?? 0)
              ? {
                  score: score,
                  advisory: current.advisory,
                }
              : {
                  score: existingElement.opinionatedAdvisory.score,
                  advisory: existingElement.opinionatedAdvisory.advisory,
                };

          opinionatedAdvisory = newOpinionatedAdvisory;
          opinionatedScore = newOpinionatedScore;
        }

        const opinionatedExtendedSeverity = extendedSeverityFromSeverity(
          opinionatedScore?.severity,
        );

        const updatedItemInArray: VulnerabilityOfSbom = {
          // existing element
          vulnerability: existingElement.vulnerability,
          vulnerabilityStatus: existingElement.vulnerabilityStatus,
          // new values,
          advisories,
          purls,
          opinionatedAdvisory: {
            advisory: opinionatedAdvisory,
            score: opinionatedScore,
            extendedSeverity: opinionatedExtendedSeverity,
          },
        };

        result = [...arrayWithoutExistingItem, updatedItemInArray];
      } else {
        const score = extractPriorityItemBasedOnScoresType(
          current.scores,
          (item) => item.type,
        );
        const extendedSeverity = extendedSeverityFromSeverity(score?.severity);

        // advisories
        const advisories = new Map<string, AdvisoryFromAnalysis>();
        advisories.set(current.advisory.identifier, {
          advisory: current.advisory,
          base_score: current.base_score,
          scores: current.scores,
          opinionatedExtendedSeverity: extendedSeverity,
          opinionatedScore: score,
        });

        // purls
        const purls = new Map<string, PurlAnalysis>();
        enrichPurlMapWithPackages(purls, current.packages);

        const newItemInArray: VulnerabilityOfSbom = {
          vulnerability: current.vulnerability,
          vulnerabilityStatus: current.vulnerabilityStatus,
          advisories,
          purls,
          opinionatedAdvisory: {
            advisory: current.advisory,
            score: score,
            extendedSeverity: extendedSeverity,
          },
        };
        result = [...prev.slice(), newItemInArray];
      }

      return result;
    }, [] as VulnerabilityOfSbom[]);

  const summary = vulnerabilities.reduce(
    (prev, current) => {
      const vulnStatus = current.vulnerabilityStatus;
      const severity = current.opinionatedAdvisory.extendedSeverity;

      const prevVulnStatusValue = prev.vulnerabilityStatus[vulnStatus];

      const result: VulnerabilityOfSbomSummary = Object.assign(prev, {
        vulnerabilityStatus: {
          ...prev.vulnerabilityStatus,
          [vulnStatus]: {
            total: prevVulnStatusValue.total + 1,
            severities: {
              ...prevVulnStatusValue.severities,
              [severity]: prevVulnStatusValue.severities[severity] + 1,
            },
          },
        },
      });
      return result;
    },
    { ...DEFAULT_SUMMARY } as VulnerabilityOfSbomSummary,
  );

  return {
    vulnerabilities,
    summary,
  };
};

export const useVulnerabilitiesOfSbom = (
  sbomId: string,
  includeResolved = false,
) => {
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId, includeResolved);

  const result = React.useMemo(() => {
    return advisoryToModels(advisories || []);
  }, [advisories]);

  return {
    data: result,
    advisories: advisories || [],
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  };
};

export type PurlVexResolution = {
  status: VulnerabilityStatus;
  advisory: AdvisoryHead;
};

const RESOLVING_STATUSES = new Set([
  "not_affected",
  "known_not_affected",
  "fixed",
]);

export const buildVexByPurl = (
  advisories: SbomAdvisory[],
): Map<string, Map<string, PurlVexResolution>> => {
  const result = new Map<string, Map<string, PurlVexResolution>>();
  for (const sbomAdvisory of advisories) {
    for (const status of sbomAdvisory.status) {
      if (!RESOLVING_STATUSES.has(status.status)) continue;
      const vulnId = status.identifier;
      for (const pkg of status.packages) {
        for (const purl of pkg.purl) {
          let purlMap = result.get(vulnId);
          if (!purlMap) {
            purlMap = new Map();
            result.set(vulnId, purlMap);
          }
          purlMap.set(purl.purl, {
            status: status.status as VulnerabilityStatus,
            advisory: sbomAdvisory,
          });
        }
      }
    }
  }
  return result;
};
