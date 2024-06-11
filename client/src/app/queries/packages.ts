import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PackageURL } from "packageurl-js";

import { HubRequestParams, Package } from "@app/api/models";
import { getPackageById, getPackages } from "@app/api/rest";

export const PackagessQueryKey = "packages";

export const useFetchPackages = (params: HubRequestParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PackagessQueryKey, params],
    queryFn: () => getPackages(params),
  });

  const enrichedData = data?.data.map((pkg) => {
    try {
      const packageData = PackageURL.fromString(pkg.purl);
      const result: Package = {
        ...pkg,
        package: {
          type: packageData.type,
          name: packageData.name,
          namespace: packageData.namespace ?? undefined,
          version: packageData.version ?? undefined,
          qualifiers: packageData.qualifiers ?? undefined,
          path: packageData.subpath ?? undefined,
        },
      };
      return result;
    } catch (error) {
      console.error(error);
      return pkg;
    }
  });

  return {
    result: {
      data: enrichedData || [],
      total: data?.total ?? 0,
      params: data?.params ?? params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchPackageById = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [PackagessQueryKey, id],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getPackageById(id),
    enabled: id !== undefined,
  });

  return {
    pkg: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
