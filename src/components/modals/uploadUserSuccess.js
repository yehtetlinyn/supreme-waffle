import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import styles from "./modals.module.css";
import commonStyle from "../styles/commonStyles.module.css";
import { MdCancel } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";
import { PiIdentificationCardLight } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { AiOutlineIdcard, AiOutlineMail } from "react-icons/ai";

const UploadUserSuccess = ({
  isOpen,
  toggle,
  uploadType,
  userDetail,
  handleViewAllUsersClick,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      // toggle={toggle}
      centered
      size="md"
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        Success
        {/* <MdCancel onClick={() => } /> */}
      </ModalHeader>
      <ModalBody
        className={styles.userModalBody}
        style={{ padding: "30px 100px" }}
      >
        <BiCheckCircle className={styles.checkIcon} />
        {uploadType === "multiple" && (
          <>
            <div style={{ textAlign: "center" }}>
              {`Congratulations!`}
              <br />
              <span>{`${userDetail?.count} users `}</span>
              {`has been created successfully.`}
            </div>
            <button
              className={commonStyle.formCreateBtn}
              onClick={handleViewAllUsersClick}
            >
              View All Users
            </button>
          </>
        )}
        {uploadType === "individual" && (
          <>
            <div>
              {`Congratulations! The new user has\nbeen created successfully.`}
            </div>
            <div className={styles.userDetail}>
              <div className={styles.userDetailItem}>
                <AiOutlineIdcard />
                {`User ID : ${userDetail?.userId}`}
              </div>
              <div className={styles.userDetailItem}>
                <CgProfile />
                {`Username : ${userDetail?.userName}`}
              </div>
              <div className={styles.userDetailItem}>
                <AiOutlineMail />
                {`Email : ${userDetail?.email}`}
              </div>
            </div>
            <button
              className={styles.modalActionBtn}
              onClick={handleViewAllUsersClick}
            >
              View All Users
            </button>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default UploadUserSuccess;
