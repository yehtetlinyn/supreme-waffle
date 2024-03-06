import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "./modals.module.css";
import { MdCancel } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";

const SuccessMessage = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered
      size="sm"
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        Success
        <MdCancel onClick={props.toggle} />
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <BiCheckCircle />
        <div className={styles.modalMsg}>
          {`You have successfully added these ${props.noOfAdded} ${
            props.noOfAdded === 1 ? "user" : "users"
          } to `}
          <span>{props.positionName}</span>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SuccessMessage;
