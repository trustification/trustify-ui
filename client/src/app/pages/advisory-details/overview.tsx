import React from "react";

import prettyBytes from "pretty-bytes";

import { ChartDonut } from "@patternfly/react-charts";
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
} from "@patternfly/react-core";

import { compareBySeverityFn, severityList } from "@app/api/model-utils";
import { AdvisorySummary, Severity } from "@app/client";
import { SeverityShieldAndText } from "@app/components/SeverityShieldAndText";
import { formatDate } from "@app/utils/utils";

interface InfoProps {
  advisory: AdvisorySummary;
}

export const Overview: React.FC<InfoProps> = ({ advisory }) => {
  return (
    <Grid hasGutter>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Overview</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Title</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.title}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.labels.type}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Aggregate Severity</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.average_severity && (
                    <SeverityShieldAndText
                      value={advisory.average_severity as Severity}
                    />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Size</DescriptionListTerm>
                <DescriptionListDescription>
                  {prettyBytes(advisory.size)}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Publisher</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.issuer?.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Contact details</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.issuer?.website}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={4}>
        <Card isFullHeight>
          <CardTitle>Tracking</CardTitle>
          <CardBody>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>ID</DescriptionListTerm>
                <DescriptionListDescription>
                  {advisory.identifier}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Initial release date</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(advisory.published)}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Current release date</DescriptionListTerm>
                <DescriptionListDescription>
                  {formatDate(advisory.modified)}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
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
        color: severityProps.color.value,
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
