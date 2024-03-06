import React from "react";
import EditMasterSOPForm from "@/components/masterSOP/edit/form";
import styles from "@/components/siteManagement/site.module.css";
import { Modal } from "reactstrap";
import { MdCancel } from "react-icons/md";
const PreviewSopModal = ({ isOpen, toggle }) => {
  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      centered
      contentClassName={styles.previewModal}
    >
      <div className={styles.cancelIcon}>
        <MdCancel onClick={toggle} />
      </div>
      <EditMasterSOPForm view previewSop />
    </Modal>
  );
};

export default PreviewSopModal;
