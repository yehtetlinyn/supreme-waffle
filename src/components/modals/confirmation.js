import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { MdCancel } from "react-icons/md";
import styles from "./modals.module.css";

const ConfirmationModal = ({
  isOpen,
  toggle,
  modalTitle,
  modalMsg,
  actionBtnProps = "Confirm",
  handleClick,
  actionBtns = true,
  enableModalFooter = false,
  disabled = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        {modalTitle}
        <MdCancel onClick={toggle} />
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.modalMsg}>{modalMsg}</div>
        {!enableModalFooter && actionBtns && (
          <div className={styles.modalBtnContainer}>
            <button
              type="button"
              className={styles.modalCancelBtn}
              onClick={toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={disabled}
              className={styles.modalActionBtn}
              onClick={handleClick}
            >
              {actionBtnProps}
            </button>
          </div>
        )}
      </ModalBody>
      {enableModalFooter && (
        <ModalFooter>
          <div className={styles.modalFooterBtnWrapper}>
            <button
              type="button"
              className={styles.modalCancelBorderBtn}
              onClick={toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClick}
              className={styles.modalActionBtn}
            >
              {actionBtnProps}
            </button>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default ConfirmationModal;
