import React from "react";

import {
  compareByScoreTypeFn,
  extractPriorityScoreFromScores,
} from "@app/api/model-utils";
import {
  type ExtendedSeverity,
  type VulnerabilityStatus,
  extendedSeverityFromSeverity,
} from "@app/api/models";
import type {
  AdvisoryHead,
  SbomAdvisory,
  SbomPackage,
  SbomStatus,
  Score,
  VulnerabilityHead,
} from "@app/client";
import {
  useFetchSbomsAdvisory,
  useFetchSbomsAdvisoryBatch,
} from "@app/queries/sboms";
import { useFetchVulnerabilitiesByPackageIds } from "@app/queries/vulnerabilities";

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
  advisory: SbomAdvisory;
  packages: SbomPackage[];
}

interface VulnerabilityOfSbom {
  vulnerability: SbomStatus;
  vulnerabilityStatus: VulnerabilityStatus;
  relatedPackages: {
    advisory: SbomAdvisory;
    packages: SbomPackage[];
  }[];
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

const DEFAULT_SUMMARY: VulnerabilityOfSbomSummary = {
  vulnerabilityStatus: {
    affected: { ...DEFAULT_SEVERITY },
    fixed: { ...DEFAULT_SEVERITY },
    not_affected: { ...DEFAULT_SEVERITY },
    known_not_affected: { ...DEFAULT_SEVERITY },
  },
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

        const updatedItemInArray: VulnerabilityOfSbom = {
          ...existingElement,
          relatedPackages: [
            ...existingElement.relatedPackages,
            {
              advisory: current.advisory,
              packages: current.packages,
            },
          ],
        };

        result = [...arrayWithoutExistingItem, updatedItemInArray];
      } else {
        const newItemInArray: VulnerabilityOfSbom = {
          vulnerability: current.vulnerability,
          vulnerabilityStatus: current.vulnerabilityStatus,
          relatedPackages: [
            {
              advisory: current.advisory,
              packages: current.packages,
            },
          ],
        };
        result = [...prev.slice(), newItemInArray];
      }

      return result;
    }, [] as VulnerabilityOfSbom[]);

  const summary = vulnerabilities.reduce(
    (prev, current) => {
      const vulnStatus = current.vulnerabilityStatus;
      const severity = extendedSeverityFromSeverity(
        current.vulnerability.average_severity,
      );

      const prevVulnStatusValue = prev.vulnerabilityStatus[vulnStatus];

      // biome-ignore lint/performance/noAccumulatingSpread: allowed
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

export const useVulnerabilitiesOfSbom = (sbomId: string) => {
  const {
    advisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  } = useFetchSbomsAdvisory(sbomId);

  const result = React.useMemo(() => {
    return advisoryToModels(advisories || []);
  }, [advisories]);

  return {
    data: result,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
  };
};

export const useVulnerabilitiesOfSboms = (sbomIds: string[]) => {
  const { advisories, isFetching, fetchError } =
    useFetchSbomsAdvisoryBatch(sbomIds);

  const result = React.useMemo(() => {
    return (advisories ?? []).map((item) => {
      return advisoryToModels(item || []);
    });
  }, [advisories]);

  return {
    data: result,
    isFetching: isFetching,
    fetchError: fetchError,
  };
};

//

type AdvisoryFromAnalysis = {
  advisory: AdvisoryHead;
  scores: Score[];
  opinionatedScore: Score | null;
  opinionatedExtendedSeverity: ExtendedSeverity;
};

interface VulnerabilityOfSbomFromAnalysis {
  vulnerability: VulnerabilityHead;
  status: VulnerabilityStatus;
  advisories: Map<string, AdvisoryFromAnalysis>;
  purls: Set<string>;
  opinionatedAvisory: {
    advisory: AdvisoryHead | null;
    score: Score | null;
    extendedSeverity: ExtendedSeverity;
  };
}

export const useVulnerabilitiesOfSbomByPurls = (purls: string[]) => {
  const { packages, isFetching, fetchError } =
    useFetchVulnerabilitiesByPackageIds(purls);

  const result = React.useMemo(() => {
    if (isFetching || fetchError || Object.keys(packages).length === 0) {
      return {
        summary: { ...DEFAULT_SUMMARY },
        vulnerabilities: [],
      };
    }

    const vulnerabilities = Object.entries(packages)
      .flatMap(([purl, analysisDetails]) => {
        return analysisDetails.details.flatMap((vulnerability) => {
          return Object.entries(vulnerability.status).flatMap(
            ([status, advisories]) => {
              return advisories.map((advisory) => {
                return {
                  purl,
                  vulnerability,
                  status: status as VulnerabilityStatus,
                  advisory,
                  scores: advisory.scores,
                };
              });
            },
          );
        });
      })
      //group
      .reduce((prev, current) => {
        const areVulnerabilityOfPackageEqual = (
          a: Pick<VulnerabilityOfSbomFromAnalysis, "vulnerability" | "status">,
          b: Pick<VulnerabilityOfSbomFromAnalysis, "vulnerability" | "status">,
        ) => {
          return (
            a.vulnerability.identifier === b.vulnerability.identifier &&
            a.status === b.status
          );
        };

        let result: VulnerabilityOfSbomFromAnalysis[];

        const existingElement = prev.find((item) => {
          return areVulnerabilityOfPackageEqual(item, current);
        });

        if (existingElement) {
          const arrayWithoutExistingItem = prev.filter(
            (item) => !areVulnerabilityOfPackageEqual(item, existingElement),
          );

          const score = extractPriorityScoreFromScores(current.scores);
          const extendedSeverity = extendedSeverityFromSeverity(
            score?.severity,
          );

          // new advisories
          const advisories = new Map<string, AdvisoryFromAnalysis>(
            existingElement.advisories,
          );
          advisories.set(current.advisory.identifier, {
            advisory: current.advisory,
            scores: current.scores,
            opinionatedScore: score,
            opinionatedExtendedSeverity: extendedSeverity,
          });

          // new purls
          const purls = new Set(existingElement.purls);
          purls.add(current.purl);

          // new opinionated advisory
          let opinionatedAdvisory: AdvisoryHead | null = null;
          let opinionatedScore: Score | null = null;
          if (existingElement.opinionatedAvisory.score?.type !== score?.type) {
            const preferedAdvisoryScore = [
              {
                advisory: existingElement.opinionatedAvisory.advisory,
                score: existingElement.opinionatedAvisory.score,
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
              (existingElement.opinionatedAvisory.score?.value ?? 0)
                ? {
                    score: score,
                    advisory: current.advisory,
                  }
                : {
                    score: existingElement.opinionatedAvisory.score,
                    advisory: existingElement.opinionatedAvisory.advisory,
                  };

            opinionatedAdvisory = newOpinionatedAdvisory;
            opinionatedScore = newOpinionatedScore;
          }

          const opinionatedExtendedSeverity = extendedSeverityFromSeverity(
            opinionatedScore?.severity,
          );

          const updatedItemInArray: VulnerabilityOfSbomFromAnalysis = {
            // existing element
            vulnerability: existingElement.vulnerability,
            status: existingElement.status,
            // new values,
            advisories,
            purls,
            opinionatedAvisory: {
              advisory: opinionatedAdvisory,
              score: opinionatedScore,
              extendedSeverity: opinionatedExtendedSeverity,
            },
          };

          result = [...arrayWithoutExistingItem, updatedItemInArray];
        } else {
          const score = extractPriorityScoreFromScores(current.scores);
          const extendedSeverity = extendedSeverityFromSeverity(
            score?.severity,
          );

          // advisories
          const advisories = new Map<string, AdvisoryFromAnalysis>();
          advisories.set(current.advisory.identifier, {
            advisory: current.advisory,
            scores: current.scores,
            opinionatedExtendedSeverity: extendedSeverity,
            opinionatedScore: score,
          });

          // purls
          const purls = new Set<string>();
          purls.add(current.purl);

          const newItemInArray: VulnerabilityOfSbomFromAnalysis = {
            vulnerability: current.vulnerability,
            status: current.status,
            advisories,
            purls,
            opinionatedAvisory: {
              advisory: current.advisory,
              score: score,
              extendedSeverity: extendedSeverity,
            },
          };
          result = [...prev.slice(), newItemInArray];
        }

        return result;
      }, [] as VulnerabilityOfSbomFromAnalysis[]);

    const summary = vulnerabilities.reduce(
      (prev, current) => {
        const vulnStatus = current.status as VulnerabilityStatus;
        const severity = current.opinionatedAvisory.extendedSeverity;

        const prevVulnStatusValue = prev.vulnerabilityStatus[vulnStatus];

        // biome-ignore lint/performance/noAccumulatingSpread: allowed
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
  }, [packages, isFetching, fetchError]);

  return {
    data: result,
    isFetching,
    fetchError,
  };
};
