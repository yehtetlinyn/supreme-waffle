import React from "react";
import styles from "@/components/contentWrap/contentWrapper.module.css";
import commonStyles from "@/components/styles/commonStyles.module.css";
import countStyles from "@/components/manageLayout/manage.module.css";
import { TbTrash } from "react-icons/tb";
const ContentWrap = ({
  pageHeader,
  filterRow,
  footer,
  content,
  totalCount,
  showingCount,
  loading,
  subTitle,
  listCount,
  form = false,
  deleteBtn = "",
  disable = false,
  deleteConfirmationModalHandler = () => {},
}) => {
  return (
    <div className={form ? styles.formRoot : styles.root}>
      {pageHeader && pageHeader}
      <div className={styles.container}>
        {filterRow && (
          <div className={totalCount === 0 ? "mb-4" : undefined}>
            {filterRow}
          </div>
        )}
        {totalCount > 0 && (
          <div className="d-flex justify-content-between align-items-center">
            {subTitle && (
              <p className={countStyles.subTitle}>
                {subTitle}
                <span className={countStyles.listCount}>
                  {listCount ? listCount : 0}
                </span>
              </p>
            )}
            {deleteBtn && (
              <span
                onClick={deleteConfirmationModalHandler}
                className={
                  disable
                    ? commonStyles.disabledDeleteBtn
                    : commonStyles.deleteBtn
                }
              >
                <TbTrash size={18} />
                {deleteBtn}
              </span>
            )}
          </div>
        )}
        {/* <small className={commonStyles.entriesText}></small> */}
        <div className={totalCount > 0 ? styles.content : styles.noDataContent}>
          {content}
        </div>
        {loading || !showingCount || !totalCount ? (
          <></>
        ) : (
          <small className={commonStyles.entriesText}>
            Showing {showingCount} of {totalCount} Entries
          </small>
        )}
        {footer && footer}
      </div>
    </div>
  );
};

export default ContentWrap;
