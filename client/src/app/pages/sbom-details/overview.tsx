import React from "react";

import { ChartDonut } from "@patternfly/react-charts";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
} from "@patternfly/react-core";

import { compareBySeverityFn, severityList } from "@app/api/model-utils";
import { SBOM, Severity } from "@app/api/models";
import { formatDate } from "@app/utils/utils";
import { SbomDetails } from "@app/client";

interface InfoProps {
  sbom: SbomDetails;
}

export const Overview: React.FC<InfoProps> = ({ sbom }) => {
  return (
    <Grid hasGutter>
      <GridItem md={6}>
        <DescriptionList
          columnModifier={{
            default: "2Col",
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>{sbom.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Author</DescriptionListTerm>
            <DescriptionListDescription>
              {sbom.authors}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Published</DescriptionListTerm>
            <DescriptionListDescription>
              {formatDate(sbom.published)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
    </Grid>
  );
};

//

interface ChartData {
  severity: Severity;
  legend: string;
  count: number;
  color: string;
}

interface CVEsChartProps {
  data: { [key in Severity]: number };
}

export const CVEsChart: React.FC<CVEsChartProps> = ({ data }) => {
  const enrichedData = Object.entries(data)
    .map(([severity, count]) => {
      const severityProps = severityList[severity as Severity];

      const result: ChartData = {
        severity: severity as Severity,
        legend: severityProps.name,
        color: severityProps.shieldIconColor.value,
        count: count,
      };

      return result;
    })
    .sort(compareBySeverityFn((item) => item.severity));

  const chartData = enrichedData.map((e) => {
    return {
      x: e.legend,
      y: e.count,
    };
  });

  const chartLegendData = enrichedData.map((e) => ({
    name: `${e.count} ${e.legend}`,
  }));

  const chartColorData = enrichedData.map((e) => e.color);

  return (
    <>
      <div style={{ height: "230px", width: "350px" }}>
        <ChartDonut
          ariaDesc="CVEs"
          ariaTitle="CVEs"
          constrainToVisibleArea
          data={chartData}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          legendData={chartLegendData}
          colorScale={chartColorData}
          legendOrientation="vertical"
          legendPosition="right"
          name="CVEs"
          padding={{
            bottom: 20,
            left: 20,
            right: 140, // Adjusted to accommodate legend
            top: 20,
          }}
          subTitle="CVEs"
          title={enrichedData
            .map((e) => e.count)
            .reduce((prev, current) => prev + current, 0)
            .toString()}
          width={350}
        />
      </div>
    </>
  );
};
