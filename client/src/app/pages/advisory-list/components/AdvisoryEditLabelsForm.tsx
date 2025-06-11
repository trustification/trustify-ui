import React from "react";

import type { AxiosError } from "axios";

import type { AdvisorySummary } from "@app/client";
import { EditLabelsForm } from "@app/components/EditLabelsForm";
import { NotificationsContext } from "@app/components/NotificationsContext";
import {
  useFetchAdvisoryLabels,
  useUpdateAdvisoryLabelsMutation,
} from "@app/queries/advisories";

interface AdvisoryEditLabelsFormProps {
  advisory: AdvisorySummary;
  onClose: () => void;
}

export const AdvisoryEditLabelsForm: React.FC<AdvisoryEditLabelsFormProps> = ({
  advisory,
  onClose,
}) => {
  const { pushNotification } = React.useContext(NotificationsContext);

  const [inputValue, setInputValue] = React.useState("");
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  const { labels } = useFetchAdvisoryLabels(debouncedInputValue);

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 400);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  const onUpdateSuccess = () => {
    pushNotification({
      title: `Labels updated for Advisory ${advisory.document_id}`,
      variant: "success",
    });
    onClose();
  };

  const onUpdateError = (_error: AxiosError) => {
    pushNotification({
      title: `Error while updating labels for Advisory ${advisory.document_id}`,
      variant: "danger",
    });
  };

  const { mutate: updateLabels, isPending } = useUpdateAdvisoryLabelsMutation(
    onUpdateSuccess,
    onUpdateError,
  );

  const onSave = (value: { [key: string]: string }) => {
    updateLabels({ id: advisory.uuid, labels: value });
  };

  return (
    <EditLabelsForm
      title={`Labels of Advisory: ${advisory.document_id}`}
      value={advisory.labels}
      isDisabled={isPending}
      onSave={onSave}
      onClose={onClose}
      onInputChange={setInputValue}
      options={labels}
    />
  );
};
