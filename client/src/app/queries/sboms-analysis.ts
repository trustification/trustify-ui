import { useQueryClient } from "@tanstack/react-query";

import { uploadSbomForAnalysis } from "@app/api/rest";
import type { ExtractResult } from "@app/client";
import { useUpload } from "@app/hooks/useUpload";

export const SBOMAnalysisQueryKey = "sbom-analysis";

export const useUploadAndAnalyzeSBOM = (
  onSuccess: (data: ExtractResult, file: File) => void,
) => {
  const queryClient = useQueryClient();
  return useUpload<ExtractResult, { message: string }>({
    parallel: true,
    uploadFn: (formData, config) => {
      return uploadSbomForAnalysis(formData, config);
    },
    onSuccess: async (response, file) => {
      onSuccess(response.data, file);
      await queryClient.invalidateQueries({
        queryKey: [SBOMAnalysisQueryKey],
      });
    },
  });
};
