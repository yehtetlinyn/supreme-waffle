import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "@/components/modals/modals.module.css";
import { MdCancel } from "react-icons/md";
import useSiteStore from "@/store/siteStore";

const DeleteConfirmation = (props) => {
  const { siteUser, loading, siteSop } = props;
  const siteName = useSiteStore((state) => state.siteName);
  const renderConfirmMessage = (dataLength) => {
    if (siteUser) {
      return (
        <>
          Are you sure you want to remove{" "}
          <span>
            {dataLength === 1
              ? props.selectedRow?.[0]?.name
              : `these ${dataLength} users`}
          </span>{" "}
          from&nbsp;
          {siteName}?
        </>
      );
    } else {
      return (
        <>
          Are you sure you want to delete these{" "}
          <span>{props.selectedRow || "---"}</span> with all related{" "}
          {props.sop && "configuration"} data ?
        </>
      );
    }
  };

  const renderBtnLabel = (loading, siteUser) => {
    if (loading) {
      return siteUser ? "Removing..." : "Deleting...";
    } else {
      return siteUser ? "Remove" : "Delete";
    }
  };
  return (
    <Modal
      isOpen={props.isOpen}
      // toggle={props.toggle}
      centered
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        Confirmation Message
        <MdCancel onClick={props.toggle} />
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.modalMsg}>
          {renderConfirmMessage(props.totalRows)}
        </div>
        <div className={styles.modalBtnContainer}>
          <button className={styles.modalCancelBtn} onClick={props.toggle}>
            Cancel
          </button>
          <button
            className={styles.modalActionBtn}
            onClick={props.deleteHandler}
          >
            {renderBtnLabel(loading, siteUser)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmation;
