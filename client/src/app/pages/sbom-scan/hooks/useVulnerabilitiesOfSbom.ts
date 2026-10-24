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
import type { AdvisoryHead, Score, VulnerabilityHead } from "@app/client";
import {
  DEFAULT_SUMMARY,
  type VulnerabilityOfSbomSummary,
} from "@app/hooks/domain-controls/useVulnerabilitiesOfSbom";
import { useFetchVulnerabilitiesByPackageIds } from "@app/queries/vulnerabilities";

type AdvisoryFromAnalysis = {
  advisory: AdvisoryHead;
  scores: Score[];
  opinionatedScore: Score | null;
  opinionatedExtendedSeverity: ExtendedSeverity;
};

export interface VulnerabilityOfSbomFromAnalysis {
  vulnerability: VulnerabilityHead;
  status: VulnerabilityStatus;
  advisories: Map<string, AdvisoryFromAnalysis>;
  purls: Set<string>;
  opinionatedAdvisory: {
    advisory: AdvisoryHead | null;
    score: Score | null;
    extendedSeverity: ExtendedSeverity;
  };
}

export const useVulnerabilitiesOfSbomByPurls = (purls: string[]) => {
  const { analysisResponse, isFetching, fetchError } =
    useFetchVulnerabilitiesByPackageIds(purls);

  const result = React.useMemo(() => {
    if (
      isFetching ||
      fetchError ||
      Object.keys(analysisResponse).length === 0
    ) {
      return {
        summary: { ...DEFAULT_SUMMARY },
        vulnerabilities: [],
      };
    }

    const vulnerabilities = Object.entries(analysisResponse)
      .flatMap(([purl, analysisDetails]) => {
        return analysisDetails.details.flatMap((vulnerability) => {
          return vulnerability.purl_statuses.flatMap((status) => {
            return {
              purl,
              vulnerability: status.vulnerability,
              status: status.status as VulnerabilityStatus,
              advisory: status.advisory,
              scores: status.scores,
            };
          });
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
          let opinionatedAdvisory: AdvisoryHead | null;
          let opinionatedScore: Score | null;
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
            ].sort(
              compareByScoreTypeFn((item) => item.score?.type ?? null),
            )[0]!;

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

          const updatedItemInArray: VulnerabilityOfSbomFromAnalysis = {
            // existing element
            vulnerability: existingElement.vulnerability,
            status: existingElement.status,
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
            opinionatedAdvisory: {
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
  }, [analysisResponse, isFetching, fetchError]);

  return {
    data: result,
    analysisResponse,
    isFetching,
    fetchError,
  };
};
