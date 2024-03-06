import React from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import AccountInformation from "./accountInformation";
import ProfileInformation from "./profileInformation";

const ReviewAndSubmit = ({
  accountInfo,
  profileInfo,
  submit,
  setCurrentTab,
}) => {
  if (accountInfo && profileInfo) {
    return (
      <div
        // onSubmit={handleSubmit(submit)}
        className={commonStyles.formWrapper}
        style={{ gap: 20 }}
      >
        <div className={styles.reviewAndSubmitWrapper}>
          <div className={styles.accountInformationWrapper}>
            <AccountInformation view accountInfo={accountInfo} />
          </div>
          <div className={styles.profileInformationWrapper}>
            <ProfileInformation view profileInfo={profileInfo} />
          </div>
        </div>
        <div className={styles.actionButtonContainer}>
          <button type="button" className={commonStyles.formCancelBtn}>
            Cancel
          </button>
          <button
            type="button"
            className={commonStyles.formCreateBtn}
            style={{ marginLeft: "auto" }}
            onClick={() => setCurrentTab(2)}
          >
            Back
          </button>
          <button
            type="button"
            className={commonStyles.formCreateBtn}
            onClick={() => submit("addNewUser")}
          >
            Create
          </button>
        </div>
      </div>
    );
  }
};

export default ReviewAndSubmit;
