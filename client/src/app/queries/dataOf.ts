import { RequestResult } from "@hey-api/client-axios";
import { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

export const dataOf = async <Data, Error>(
  promise: RequestResult<Data, Error>
) => {
  return (await promise).data;
};

export const convertQuery = <TData, TError>(
  q: UseQueryResult<TData, TError>
) => {
  return {
    isFetching: q.isLoading,
    fetchError: q.error as AxiosError,
    refetch: q.refetch,
  };
};
