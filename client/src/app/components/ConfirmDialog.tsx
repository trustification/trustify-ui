import type React from "react";

import {
  Button,
  ButtonVariant,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";

export interface ConfirmDialogProps {
  isOpen: boolean;

  title: string;
  titleIconVariant?:
    | "success"
    | "danger"
    | "warning"
    | "info"
    // biome-ignore lint/suspicious/noExplicitAny: allowed
    | React.ComponentType<any>;
  message: string | React.ReactNode;

  confirmBtnLabel: string;
  cancelBtnLabel: string;

  inProgress?: boolean;
  confirmBtnVariant: ButtonVariant;

  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  titleIconVariant,
  message,
  confirmBtnLabel,
  cancelBtnLabel,
  inProgress,
  confirmBtnVariant,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const confirmBtn = (
    <Button
      id="confirm-dialog-button"
      key="confirm"
      aria-label="confirm"
      variant={confirmBtnVariant}
      isDisabled={inProgress}
      onClick={onConfirm}
    >
      {confirmBtnLabel}
    </Button>
  );

  const cancelBtn = onCancel ? (
    <Button
      key="cancel"
      id="confirm-cancel-button"
      aria-label="cancel"
      variant={ButtonVariant.link}
      isDisabled={inProgress}
      onClick={onCancel}
    >
      {cancelBtnLabel}
    </Button>
  ) : undefined;

  return (
    <Modal
      id="confirm-dialog"
      variant="small"
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Confirm dialog"
    >
      <ModalHeader title={title} titleIconVariant={titleIconVariant} />
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        {onCancel ? (
          <>
            {confirmBtn}
            {cancelBtn}
          </>
        ) : (
          confirmBtn
        )}
      </ModalFooter>
    </Modal>
  );
};
