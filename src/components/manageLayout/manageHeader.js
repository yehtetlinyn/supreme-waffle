import styles from "./manage.module.css";
import commonStyles from "../styles/commonStyles.module.css";
import { HiPlus } from "react-icons/hi";

const ManageHeader = ({
  title,
  subTitle,
  listCount,
  handleAddNew,
  create,
  loading,
}) => {
  return (
    <div className={styles.headerContainer}>
      {title && (
        <div>
          <p className={styles.title}>{title}</p>
        </div>
      )}
      {create && (
        <button className={styles.addBtn} onClick={handleAddNew}>
          <HiPlus size={20} />
          {`Create ${create}`}
        </button>
      )}
    </div>
  );
};

export default ManageHeader;
