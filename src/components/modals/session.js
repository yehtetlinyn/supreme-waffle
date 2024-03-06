import { Modal, ModalHeader, ModalBody } from "reactstrap";
import CorrectIcon from "@/assets/icons/correctIcon";
import styles from "./modals.module.css";

const SessionSuccessModal = ({
  open,
  toggle,
  title,
  bodyValue,
  handleClick,
  enableRootToggle = true,
  actionBtnProps = "Confirm",
}) => {
  return (
    <Modal
      scrollable
      size="md"
      centered
      isOpen={open}
      toggle={enableRootToggle ? toggle : () => {}}
      className={styles.confirmationContainer}
      contentClassName={styles.modalContent}
    >
      <ModalHeader className="border-bottom-0 px-4" />
      <ModalBody>
        <div className="d-grid align-items-center justify-content-center">
          <span className="text-center">
            <CorrectIcon />
          </span>
          <div className={styles.title}>{title}</div>
          {bodyValue}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            className={styles.btn}
            onClick={() => {
              toggle();
              handleClick();
            }}
          >
            {actionBtnProps}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default SessionSuccessModal;
