import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "./modals.module.css";
import { MdCancel } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useRouter, useParams } from "next/navigation";
import usePageStore from "@/store/pageStore";
import { extractPageName } from "@/utils/helpers";
import { shallow } from "zustand/shallow";
import useSiteStore from "@/store/siteStore";
import useSiteSopStore from "@/store/siteSopStore";

const LeaveConfirmation = (props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const pageName = extractPageName(pathname, 1);
  const actionMode = extractPageName(pathname, 2);

  const leavePath =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const {
    handleLeaveOpen,
    clickSecondBreadcrumb,
    handleClickSecondBreadcrumb,
    sidebarLinkName,
    setSidebarLinkName,
    siteTabName,
  } = usePageStore(
    (state) => ({
      handleLeaveOpen: state.handleLeaveOpen,
      clickSecondBreadcrumb: state.clickSecondBreadcrumb,
      handleClickSecondBreadcrumb: state.handleClickSecondBreadcrumb,
      sidebarLinkName: state.sidebarLinkName,
      setSidebarLinkName: state.setSidebarLinkName,
      siteTabName: state.siteTabName,
    }),
    shallow
  );

  const resetFormState = useSiteSopStore((state) => state.resetFormState);

  const setIsFormDirty = usePageStore((state) => state.setIsFormDirty);
  const isFormDirty = usePageStore((state) => state.isFormDirty);
  const handleLeaveAction = () => {
    if (sidebarLinkName) {
      // if we are in edit page and when we click to sidebar link
      router.replace(`${sidebarLinkName}`);
    } else if (actionMode === "edit" && !clickSecondBreadcrumb) {
      router.replace(`/${pageName}`);
    } else if (props.siteSop || siteTabName) {
      if (siteTabName) {
        siteTabName === "site"
          ? router.replace(`${pathname}`)
          : router.replace(`${pathname}?tab=${siteTabName}`);
        resetFormState();
        props.setIsView(true);
      } else {
        resetFormState();
        props.setIsView(true);
      }
    } else {
      //router.back();
      router.replace(`/${leavePath}`);
    }
    setSidebarLinkName(null);
    handleLeaveOpen(false);
    setIsFormDirty(false);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
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
          Are you sure you want to leave this page without saving your changes?
        </div>
        <div className={styles.modalBtnContainer}>
          <button className={styles.modalCancelBtn} onClick={props.toggle}>
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

export default LeaveConfirmation;
