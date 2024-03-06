import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styles from "./modals.module.css";
import { MdCancel } from "react-icons/md";

const ActionHandlerModal = ({
  children,

  formParams,
  actionType,
  actionHeader,
  isOpen,
  toggle,
  actionBtns = true,
  enableModalHeader = false,
  enableModalFooter = false,
  disabled = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      size="lg"
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      {enableModalHeader && (
        <ModalHeader className={styles.modalHeader}>
          {actionHeader}
          <MdCancel onClick={toggle} />
        </ModalHeader>
      )}

      <ModalBody className={styles.modalBody}>
        {children}

        {!enableModalFooter && actionBtns && (
          <div className={styles.modalBtnWrapper}>
            <button
              type="reset"
              className={styles.modalCancelBorderBtn}
              onClick={toggle}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formParams}
              disabled={disabled}
              className={styles.modalActionBtn}
            >
              {actionType}
            </button>
          </div>
        )}
      </ModalBody>
      {enableModalFooter && (
        <ModalFooter>
          <div className={`mt-5 ${styles.modalFooterBtnWrapper}`}>
            <button
              type="reset"
              className={styles.modalCancelBorderBtn}
              onClick={toggle}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formParams}
              disabled={disabled}
              className={styles.modalActionBtn}
            >
              {actionType}
            </button>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default ActionHandlerModal;
