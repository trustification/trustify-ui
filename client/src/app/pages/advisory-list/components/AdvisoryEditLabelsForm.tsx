import React from "react";

import type { AxiosError } from "axios";

import type { AdvisorySummary } from "@app/client";
import { EditLabelsForm } from "@app/components/EditLabelsForm";
import { NotificationsContext } from "@app/components/NotificationsContext";
import { useUpdateAdvisoryLabelsMutation } from "@app/queries/advisories";
import { useUpdateSbomLabelsMutation } from "@app/queries/sboms";

interface AdvisoryEditLabelsFormProps {
  advisory: AdvisorySummary;
  onClose: () => void;
}

export const AdvisoryEditLabelsForm: React.FC<AdvisoryEditLabelsFormProps> = ({
  advisory,
  onClose,
}) => {
  const { pushNotification } = React.useContext(NotificationsContext);

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
    />
  );
};
