import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { client } from "@app/axios-config/apiInit";
import { aiFlags, ChatState, completions } from "@app/client";
import { dataOf } from "./dataOf";

export const useCompletionMutation = (
  onError?: (err: AxiosError, next: ChatState) => void,
  onSuccess?: (payload: ChatState, next: ChatState) => void
) => {
  return useMutation({
    mutationFn: async (next: ChatState) => {
      const response = await completions({ client, body: next });
      return response.data as ChatState;
    },
    onSuccess,
    onError,
  });
};

export const useFetchAiFlagsQuery = () => {
  return useQuery({
    queryKey: ["ai/flags"],
    queryFn: () => {
      return dataOf(aiFlags({ client }));
    },
    refetchInterval: false,
  });
};
