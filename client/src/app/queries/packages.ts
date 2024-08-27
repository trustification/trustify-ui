import { useQuery } from "@tanstack/react-query";

import { HubRequestParams } from "@app/api/models";
import { convertQuery, dataOf } from "./dataOf";
import { getPurl, listPackages, listPurl } from "../client";
import { client } from "../axios-config/apiInit";
import { requestParamsQuery } from "../hooks/table-controls";

export const PackagesQueryKey = "packages";

export const useFetchPackages = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const query = useQuery({
    queryKey: [PackagesQueryKey, params],
    queryFn: () =>
      dataOf(
        listPurl({
          client: client,
          query: { ...requestParamsQuery(params) },
        })
      ),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });

  return {
    ...convertQuery(query),
    result: {
      data: query.data?.items || [],
      total: query.data?.total ?? 0,
      params: params,
    },
  };
};

export const useFetchPackageById = (id: string) => {
  const query = useQuery({
    queryKey: [PackagesQueryKey, id],
    queryFn: () => dataOf(getPurl({ client, path: { key: id } })),
  });

  return {
    ...convertQuery(query),
    pkg: query.data,
  };
};

export const useFetchPackagesBySbomId = (
  sbomId: string,
  params: HubRequestParams = {}
) => {
  const query = useQuery({
    queryKey: [PackagesQueryKey, "by-sbom", sbomId, params],
    queryFn: () =>
      dataOf(
        listPackages({
          client,
          path: { id: sbomId },
          query: { ...requestParamsQuery(params) },
        })
      ),
  });

  return {
    ...convertQuery(query),
    result: {
      data: query.data?.items || [],
      total: query.data?.total ?? 0,
      params,
    },
  };
};
