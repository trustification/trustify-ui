import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import { client } from "@app/axios-config/apiInit";
import {
  deleteProduct,
  getProduct,
  listProducts,
  ProductDetails,
} from "@app/client";

import { requestParamsQuery } from "../hooks/table-controls";

export const ProductsQueryKey = "products";

export const useFetchProducts = (
  params: HubRequestParams = {},
  refetchDisabled: boolean = false
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [ProductsQueryKey, params],
    queryFn: () => {
      return listProducts({
        client,
        query: { ...requestParamsQuery(params) },
      });
    },
    refetchInterval: !refetchDisabled ? 5000 : false,
  });
  return {
    result: {
      data: data?.data?.items || [],
      total: data?.data?.total ?? 0,
      params: params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchProductById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [ProductsQueryKey, id],
    queryFn: () => getProduct({ client, path: { id } }),
  });
  return {
    product: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};

export const useDeleteProductMutation = (
  onError?: (err: AxiosError, id: string) => void,
  onSuccess?: (payload: ProductDetails, id: string) => void
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProduct({ client, path: { id } });
      return response.data as ProductDetails;
    },
    mutationKey: [ProductsQueryKey],
    onSuccess,
    onError,
  });
};
