import React from "react";
import NoDataIcon from "@/assets/icons/noDataIcon";
import NoDataProsegurIcon from "@/assets/icons/noDataProsegurIcon";
import styles from "./noData.module.css";

const NoData = () => {
  return (
    <div className={styles.noDataWrapper}>
      <NoDataProsegurIcon />
      <p>There is no data to show you right now.</p>
    </div>
  );
};

export default NoData;
