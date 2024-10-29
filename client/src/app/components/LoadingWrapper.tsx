import React from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";

import { StateError } from "./StateError";

export const LoadingWrapper = (props: {
  isFetching: boolean;
  fetchError?: Error | null;
  isFetchingState?: React.ReactNode;
  fetchErrorState?: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (props.isFetching) {
    return (
      props.isFetchingState || (
        <Bullseye>
          <Spinner />
        </Bullseye>
      )
    );
  } else if (props.fetchError) {
    return props.fetchErrorState || <StateError />;
  } else {
    return props.children;
  }
};
