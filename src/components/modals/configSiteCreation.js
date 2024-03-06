import React from "react";
import styles from "./modals.module.css";

import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { MdCancel } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { extractPageName } from "@/utils/helpers";

const ConfigSiteCreationModal = (props) => {
  const { createdSiteId } = props;
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const goToEditPage = () => {
    router.push(`/${pageName}/edit/${createdSiteId}?tab=attendanceCheckpoint`);
  };

  const goToListPage = () => {
    router.push(`/${pageName}`);
  };
  return (
    <Modal
      isOpen={props.isOpen}
      centered
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className={styles.modalHeader}>
        Comfirmation Message
        <MdCancel onClick={goToListPage} />
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.modalMsg}>
          Site creation is successful. Do you wish to configure the Site ?
        </div>
        <div className={styles.modalBtnContainer}>
          <button className={styles.modalCancelBtn} onClick={goToListPage}>
            Cancel
          </button>
          <button className={styles.modalActionBtn} onClick={goToEditPage}>
            Continue
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfigSiteCreationModal;
