import React from "react";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import {
  Bullseye,
  Card,
  CardBody,
  Grid,
  GridItem,
  Spinner,
} from "@patternfly/react-core";

import { WatchedSbomsContext } from "../watched-sboms-context";
import { WatchedSbom } from "./WatchedSbom";

export const WatchedSbomsSection: React.FC = () => {
  const { sboms, isFetching, fetchError } =
    React.useContext(WatchedSbomsContext);

  return (
    <LoadingWrapper
      isFetching={isFetching}
      fetchError={fetchError}
      isFetchingState={
        <Grid hasGutter>
          {Array.from(Array(4).keys()).map((k) => (
            <GridItem key={k} md={3}>
              <Card>
                <CardBody>
                  <Bullseye>
                    <Spinner />
                  </Bullseye>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      }
    >
      <Grid hasGutter>
        {sboms &&
          Object.entries(sboms).map(([fieldName, fieldValue]) => {
            return (
              <GridItem key={`${fieldName}:${fieldValue}`} md={3}>
                <WatchedSbom fieldName={fieldName} sbomId={fieldValue} />
              </GridItem>
            );
          })}
      </Grid>
    </LoadingWrapper>
  );
};
