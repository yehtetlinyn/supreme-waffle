import styles from "@/components/styles/commonStyles.module.css";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

export const renderCustomSortIcon = (order, column) => {
  if (!order) {
    return (
      <div className="d-inline-block ms-auto">
        <span className="d-flex flex-column">
          <span className={styles.sortedUpArrow}>
            <TiArrowSortedUp color="var(--primary-main)" />
          </span>

          <span className={styles.sortedDownArrow}>
            <TiArrowSortedDown />
          </span>
        </span>
      </div>
    );
  } else if (order === "asc") {
    return (
      <div className="d-inline-block ms-auto">
        <span className="d-flex flex-column">
          <span className={styles.sortedUpArrow}>
            <TiArrowSortedUp color="var(--primary-main)" />
          </span>

          <span className={styles.sortedDownArrow}>
            <TiArrowSortedDown />
          </span>
        </span>
      </div>
    );
  } else if (order === "desc") {
    return (
      <div className="d-inline-block ms-auto">
        <span className="d-flex flex-column">
          <span className={styles.sortedUpArrow}>
            <TiArrowSortedUp />
          </span>

          <span className={styles.sortedDownArrow}>
            <TiArrowSortedDown color="var(--primary-main)" />
          </span>
        </span>
      </div>
    );
  }
  return null;
};
