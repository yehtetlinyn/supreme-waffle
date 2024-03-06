import React from "react";
import styles from "./manageUser.module.css";

const ManageUserTabBtn = ({ setCurrentTab, currentTab, createType }) => {
  return (
    <div className={styles.tab}>
      <div className={currentTab > 0 ? styles.tabBtnActive : styles.tabBtn}>
        <span className={styles.tabBadge}>1</span>
        <span className={styles.tabText}>
          {createType === "multiple"
            ? "Upload User List"
            : "Account Information"}
        </span>
      </div>
      <div className={currentTab > 1 ? styles.tabBtnActive : styles.tabBtn}>
        <span className={styles.tabBadge}>2</span>
        <span className={styles.tabText}>
          {createType === "multiple" ? "Select Users" : "Profile Information"}
        </span>
      </div>
      <div className={currentTab > 2 ? styles.tabBtnActive : styles.tabBtn}>
        <span className={styles.tabBadge}>3</span>
        <span className={styles.tabText}>
          {createType === "multiple" ? "Confirm Details" : "Review and Submit"}
        </span>
      </div>
    </div>
  );
};

export default ManageUserTabBtn;
