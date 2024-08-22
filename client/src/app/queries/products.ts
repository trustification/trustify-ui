import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import { getProductById, getProducts } from "@app/api/rest";
import { deleteProduct, ProductDetails } from "@app/client";
import { client } from "@app/axios-config/apiInit";

export const ProductsQueryKey = "products";

export const useFetchProducts = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [ProductsQueryKey, params],
    queryFn: () => getProducts(params),
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    result: {
      data: data?.data || [],
      total: data?.total ?? 0,
      params: data?.params ?? params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchProductById = (id: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [ProductsQueryKey, id],
    queryFn: () => getProductById(id),
    enabled: id !== undefined,
  });

  return {
    product: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteProductMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: ProductDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) =>
      (await deleteProduct({ client, path: { id } })).data,
    mutationKey: [ProductsQueryKey],
    onSuccess,
    onError,
  });
};
