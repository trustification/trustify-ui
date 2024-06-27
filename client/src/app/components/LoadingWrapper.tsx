import React from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";

import { StateError } from "./StateError";

export const LoadingWrapper = (props: {
  isFetching: boolean;
  fetchError?: Error;
  children: React.ReactNode;
}) => {
  if (props.isFetching) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  } else if (props.fetchError) {
    return <StateError />;
  } else {
    return props.children;
  }
};
