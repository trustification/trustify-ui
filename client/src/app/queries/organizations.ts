import { useQuery } from "@tanstack/react-query";

import { HubRequestParams } from "@app/api/models";
import { convertQuery, dataOf } from "./dataOf";
import { getOrganization, listOrganizations } from "../client";
import { client } from "../axios-config/apiInit";
import { requestParamsQuery } from "../hooks/table-controls";

export const OrganizationsQueryKey = "organizations";

export const useFetchOrganizations = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const query = useQuery({
    queryKey: [OrganizationsQueryKey, params],
    queryFn: () =>
      dataOf(
        listOrganizations({
          client,
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

export const useFetchOrganizationById = (id: string) => {
  const query = useQuery({
    queryKey: [OrganizationsQueryKey, id],
    queryFn: () => dataOf(getOrganization({ client, path: { id } })),
  });
  return {
    ...convertQuery(query),
    organization: query.data,
  };
};
