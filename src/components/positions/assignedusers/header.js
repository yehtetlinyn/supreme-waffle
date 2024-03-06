import React from "react";
import styles from "./assignedUsers.module.css";
import commonStyles from "@/components/styles/commonStyles.module.css";
import { TbTrash } from "react-icons/tb";

const AssignedUsersHeader = ({
  addBtnHandler,
  total,
  deleteBtnDisable,
  deleteConfirmationModalHandler,
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.flexRow}>
        <p>User List</p>
        <button
          className={commonStyles.searchBtn}
          onClick={addBtnHandler}
          id="addButton"
        >
          Add Users to Position
        </button>
      </div>
      <div className={styles.flexRow}>
        <span>Total Users</span>
        <span className={styles.badge}>{total}</span>
        <div style={{ marginLeft: "auto" }}>
          <span
            onClick={deleteConfirmationModalHandler}
            disabled={deleteBtnDisable}
            className={
              deleteBtnDisable
                ? commonStyles.disabledDeleteBtn
                : commonStyles.deleteBtn
            }
            style={{ marginLeft: "auto" }}
          >
            <TbTrash size={18} />
            Delete
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssignedUsersHeader;
