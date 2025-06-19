import type { RequestResult } from "@app/client/client";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const dataOf = async <Data, Error>(
  promise: RequestResult<Data, Error>,
) => {
  return (await promise).data;
};

export const convertQuery = <TData, TError>(
  q: UseQueryResult<TData, TError>,
) => {
  return {
    isFetching: q.isLoading,
    fetchError: q.error as AxiosError,
    refetch: q.refetch,
  };
};
