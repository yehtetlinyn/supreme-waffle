import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "./modals.module.css";
import { MdCancel } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import useProjectStore from "@/store/project";

const LeaveConfirmPopup = ({ isOpen, toggle, redirectLink }) => {
  const router = useRouter();

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setIsFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setIsFormDirty: state.setIsFormDirty,
    }),
    shallow
  );
  console.log("link", redirectLink);

  const handleLeaveAction = () => {
    setIsFormDirty(false);
    handleLeaveOpen(false);
    usePageStore.setState({ sidebarLinkName: null });
    router.push(redirectLink);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        Confirmation Message
        <MdCancel onClick={toggle} />
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.modalMsg}>
          Are you sure you want to leave this page without saving your changes?
        </div>
        <div className={styles.modalBtnContainer}>
          <button className={styles.modalCancelBtn} onClick={toggle}>
            Cancel
          </button>
          <button className={styles.modalActionBtn} onClick={handleLeaveAction}>
            Leave
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default LeaveConfirmPopup;
