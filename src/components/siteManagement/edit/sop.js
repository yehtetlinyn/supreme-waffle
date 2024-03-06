"use client";
import React, { useCallback, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSearchParams, usePathname, useParams } from "next/navigation";
import { shallow } from "zustand/shallow";
import { extractPageName } from "@/utils/helpers";

import commonStyles from "@/components/styles/commonStyles.module.css";
import styles from "@/components/siteManagement/site.module.css";
import ContentWrap from "@/components/contentWrap/page";
import FilterForm from "@/components/masterSOP/filter";
import MasterSOPTable from "@/components/masterSOP/table";
import Paginate from "@/components/pagination/page";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";
import CopySopModal from "@/components/siteManagement/utils/copySopModal";
import useSiteSopStore from "@/store/siteSopStore";
import EditMasterSOPForm from "@/components/masterSOP/edit/form";
import CreateMasterSOPForm from "@/components/masterSOP/create/form";
import LeaveConfirmation from "@/components/modals/leave";
import usePageStore from "@/store/pageStore";

const SiteSOP = ({ setCurrentPage, currentPage, isSiteSop }) => {
  const pathname = usePathname();

  const [isCreateSiteSopModalOpen, setIsCreateSiteSopModalOpen] =
    useState(false);
  const toggleCreateSiteSopModalOpen = useCallback(() => {
    setIsCreateSiteSopModalOpen(!isCreateSiteSopModalOpen);
  }, [isCreateSiteSopModalOpen]);

  const [isView, setIsView] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]); // for selecting rows
  const [selectedSiteSop, setSelectedSiteSop] = useState([]); //for delete

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const { leaveModal: isLeaveModal, handleLeaveOpen } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
    }),
    shallow
  );

  const deleteConfirmationModalHandler = () => {
    toggleDeleteModalOpen();
    const selectedSiteSopDataToDelete = selectedRows?.map((row) => {
      return {
        id: row?.id,
        name: row?.name,
      };
    });
    setSelectedSiteSop(selectedSiteSopDataToDelete);
  };

  const handleToggle = () => {
    if (isLeaveModal) {
      handleLeaveOpen(!isLeaveModal);
    }
  };
  const {
    loading,
    siteSopData,
    siteSopCount,
    siteSopPageCount,
    isCopyMasterSop,
    isCopySopModalOpen,
    toggleCopySopModalOpen,
    isSiteSopModalOpen,
    setIsCopySopModalOpen,
  } = useSiteSopStore(
    (state) => ({
      loading: state.loading,
      siteSopData: state.siteSopData,
      siteSopCount: state.siteSopCount,
      siteSopPageCount: state.siteSopPageCount,
      isCopyMasterSop: state.isCopyMasterSop,
      isCopySopModalOpen: state.isCopySopModalOpen,
      toggleCopySopModalOpen: state.toggleCopySopModalOpen,
      isSiteSopModalOpen: state.isSiteSopModalOpen,
      setIsCopySopModalOpen: state.setIsCopySopModalOpen,
    }),
    shallow
  );

  return (
    <>
      {/* check whether copy master button has been clicked or not
        if yes => show template of sop creation
        if no => show site sop table
     */}
      {isLeaveModal && (
        <LeaveConfirmation
          isOpen={isLeaveModal}
          toggle={handleToggle}
          siteSop={isSiteSop}
          setIsView={setIsView}
        />
      )}

      {isCopySopModalOpen ? (
        <CopySopModal
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : isCopyMasterSop ? (
        <>
          <EditMasterSOPForm />
        </>
      ) : isCreateSiteSopModalOpen ? (
        <>
          <CreateMasterSOPForm
            isCreateSiteSopModalOpen={isCreateSiteSopModalOpen}
            toggleCreateSiteSopModalOpen={toggleCreateSiteSopModalOpen}
          />
        </>
      ) : isSiteSopModalOpen ? (
        <EditMasterSOPForm view={isView} setIsView={setIsView} />
      ) : (
        <>
          <div className={styles.btnWrapper}>
            <button
              className={commonStyles.addBtn}
              onClick={() => {
                setIsCopySopModalOpen(true);
              }}
            >
              Copy From Master SOP
            </button>
            <button
              className={commonStyles.addBtn}
              onClick={toggleCreateSiteSopModalOpen}
            >
              <HiPlus size={20} />
              Create SOP
            </button>
          </div>

          <ContentWrap
            form
            deleteBtn={"Delete"}
            deleteConfirmationModalHandler={deleteConfirmationModalHandler}
            disable={
              selectedRows?.length === 0 || siteSopData.length === 0
                ? true
                : false
            }
            subTitle={siteSopData?.length !== 0 ? "Total Site SOP" : false}
            listCount={
              !loading && siteSopData?.length === 0 ? "0" : siteSopCount
            }
            filterRow={<FilterForm siteSOPForm pathname={pathname} />}
            content={
              loading || !siteSopData ? (
                <Loading />
              ) : siteSopData?.length > 0 ? (
                <MasterSOPTable
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  siteSop
                  setIsView={setIsView}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  selectedSop={selectedSiteSop}
                  setSelectedSop={setSelectedSiteSop}
                  isDeleteModalOpen={isDeleteModalOpen}
                  toggleDeleteModalOpen={toggleDeleteModalOpen}
                />
              ) : (
                <div>
                  <NoData />
                </div>
              )
            }
            footer={
              siteSopData?.length > 0 ? (
                <Paginate
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageCount={siteSopPageCount || 1}
                />
              ) : (
                false
              )
            }
            totalCount={siteSopCount}
            showingCount={siteSopData?.length}
            loading={loading || !siteSopData}
          />
        </>
      )}
    </>
  );
};

export default SiteSOP;
