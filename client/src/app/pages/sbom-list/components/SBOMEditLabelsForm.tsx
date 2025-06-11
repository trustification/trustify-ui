import React from "react";

import type { AxiosError } from "axios";

import type { SbomSummary } from "@app/client";
import { EditLabelsForm } from "@app/components/EditLabelsForm";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useFetchSBOMLabels,
  useUpdateSbomLabelsMutation,
} from "@app/queries/sboms";

interface SBOMEditLabelsFormProps {
  sbom: SbomSummary;
  onClose: () => void;
}

export const SBOMEditLabelsForm: React.FC<SBOMEditLabelsFormProps> = ({
  sbom,
  onClose,
}) => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const [inputValue, setInputValue] = React.useState("");
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 400);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  const { labels } = useFetchSBOMLabels(debouncedInputValue);

  const onUpdateSuccess = () => {
    pushNotification({
      title: `Labels updated for SBOM ${sbom.name}`,
      variant: "success",
    });
    onClose();
  };

  const onUpdateError = (_error: AxiosError) => {
    pushNotification({
      title: `Error while updating labels for SBOM ${sbom.name}`,
      variant: "danger",
    });
  };

  const { mutate: updateLabels, isPending } = useUpdateSbomLabelsMutation(
    onUpdateSuccess,
    onUpdateError,
  );

  const onSave = (value: { [key: string]: string }) => {
    updateLabels({ id: sbom.id, labels: value });
  };

  return (
    <EditLabelsForm
      title={`Labels of SBOM: ${sbom.name}`}
      value={sbom.labels}
      isDisabled={isPending}
      onSave={onSave}
      onClose={onClose}
      onInputChange={setInputValue}
      options={labels}
    />
  );
};
