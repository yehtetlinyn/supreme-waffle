"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import { shallow } from "zustand/shallow";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import useMasterSOPStore from "@/store/masterSOPStore";
import commonStyles from "@/components/styles/commonStyles.module.css";
import styles from "@/components/siteManagement/site.module.css";
import SelectCopySop from "@/components/siteManagement/utils/selectCopySop";
import useSiteSopStore from "@/store/siteSopStore";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import Loading from "@/components/modals/loading";

const pageSize = 10;

const CopySopModal = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    fetchMasterSOP,
    masterSOPData,
    masterSOPCount,
    masterSOPPageCount,
    loading,
  } = useMasterSOPStore(
    (state) => ({
      fetchMasterSOP: state.fetchMasterSOP,
      masterSOPData: state.masterSOPData,
      masterSOPCount: state.masterSOPCount,
      masterSOPPageCount: state.masterSOPPageCount,
      loading: state.loading,
    }),
    shallow
  );

  const {
    setIsCopyMasterSop,
    toggleCopySopModalOpen,
    isCopySopModalOpen,
    copyMasterSopData,
    setCopyMasterSopData,
    setIsCopySopModalOpen,
  } = useSiteSopStore(
    (state) => ({
      setIsCopyMasterSop: state.setIsCopyMasterSop,
      toggleCopySopModalOpen: state.toggleCopySopModalOpen,
      isCopySopModalOpen: state.isCopySopModalOpen,
      copyMasterSopData: state.copyMasterSopData,
      setCopyMasterSopData: state.setCopyMasterSopData,
      setIsCopySopModalOpen: state.setIsCopySopModalOpen,
    }),
    shallow
  );

  const breadcrumbList = ["SOP", "Copy From Master SOP"];
  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (breadcrumbIndex === 0) {
      //toggleCopySopModalOpen();
      setIsCopySopModalOpen(false);
      setCopyMasterSopData(null);
    }
  };
  const copyMasterSopHandler = () => {
    setIsCopyMasterSop(true);
    setIsCopySopModalOpen(false);
    //toggleCopySopModalOpen();
  };

  useEffect(() => {
    if (isCopySopModalOpen) {
      fetchMasterSOP({
        currentPage,
        pageSize,
      });
    }
  }, [currentPage, isCopySopModalOpen]);
  return (
    <div className={commonStyles.formWrapper}>
      <ContentWrap
        pageHeader={
          <>
            <CustomBreadcrumb
              breadcrumbList={breadcrumbList}
              handleBreadcrumbClick={handleBreadcrumbClick}
            />
            <div
              className={`${styles.selectMasterSopText} d-flex justify-content-between align-items-center mb-3`}
            >
              <span>Please select one Master SOP</span>
              <button
                className={
                  copyMasterSopData
                    ? `${commonStyles.addBtn} ${styles.nextBtn} align-self-end`
                    : `${commonStyles.disabledBtn} ${styles.nextBtn} align-self-end`
                }
                onClick={copyMasterSopHandler}
                disabled={!copyMasterSopData}
              >
                Copy
              </button>
            </div>
          </>
        }
        content={loading ? <Loading /> : <SelectCopySop />}
        footer={
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={masterSOPPageCount || 1}
          />
        }
        totalCount={masterSOPCount}
        showingCount={masterSOPData?.length}
      />
    </div>
  );
};

export default CopySopModal;
