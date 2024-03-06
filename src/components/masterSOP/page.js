"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import ContentWrap from "@/components/contentWrap/page";
import ManageHeader from "@/components/manageLayout/manageHeader";
import FilterForm from "@/components/masterSOP/filter";
import MasterSOPTable from "@/components/masterSOP/table";
import Paginate from "@/components/pagination/page";
import useMasterSOPStore from "@/store/masterSOPStore";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";

const pageSize = 10;
const MasterSOPManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const title = searchParam.get("sopName");
  const replacedTitle = title ? title.replace(/\+/g, " ") : "";
  const incidentId = searchParam.get("incidentType");
  const priority = searchParam.get("priority");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]); // for selecting rows
  const [selectedMasterSop, setSelectedMasterSop] = useState([]); //for delete

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const deleteConfirmationModalHandler = () => {
    toggleDeleteModalOpen();
    const selectedMasterSopDataToDelete = selectedRows?.map((row) => {
      return {
        id: row?.id,
        name: row?.name,
      };
    });
    setSelectedMasterSop(selectedMasterSopDataToDelete);
  };

  const {
    fetchMasterSOP,
    loading,
    masterSOPData,
    fetch,
    masterSOPCount,
    masterSOPPageCount,
  } = useMasterSOPStore(
    (state) => ({
      fetchMasterSOP: state.fetchMasterSOP,
      loading: state.loading,
      masterSOPData: state.masterSOPData,
      fetch: state.fetch,
      masterSOPCount: state.masterSOPCount,
      masterSOPPageCount: state.masterSOPPageCount,
    }),
    shallow
  );

  const handleAddNewSOP = () => {
    router.push(`${pathname}/create`);
  };

  useEffect(() => {
    fetchMasterSOP({
      replacedTitle,
      incidentId,
      priority,
      currentPage,
      pageSize,
    });
  }, [replacedTitle, incidentId, priority, currentPage, fetch]);

  return (
    <ContentWrap
      subTitle={"Total Master SOP"}
      listCount={
        loading && !masterSOPData
          ? "Loading..."
          : !loading && masterSOPData?.length === 0
          ? 0
          : masterSOPCount
      }
      pageHeader={
        <ManageHeader
          title={"Master SOP"}
          handleAddNew={handleAddNewSOP}
          create={"SOP"}
        />
      }
      filterRow={<FilterForm />}
      content={
        loading || !masterSOPData ? (
          <Loading />
        ) : masterSOPData?.length > 0 ? (
          <MasterSOPTable
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedSop={selectedMasterSop}
            setSelectedSop={setSelectedMasterSop}
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
        masterSOPPageCount > 0 ? (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={masterSOPPageCount}
          />
        ) : (
          false
        )
      }
      deleteBtn={"Delete"}
      deleteConfirmationModalHandler={deleteConfirmationModalHandler}
      disable={
        selectedRows?.length === 0 || masterSOPData.length === 0 ? true : false
      }
      totalCount={masterSOPCount}
      showingCount={masterSOPData?.length}
      loading={loading || !masterSOPData}
    />
  );
};

export default MasterSOPManagement;
