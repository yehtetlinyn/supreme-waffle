import React from "react";
import { Spinner } from "reactstrap";
import styles from "./modals.module.css";
const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <Spinner style={{ width: "3rem", height: "3rem" }} />
    </div>
  );
};

export default Loading;
